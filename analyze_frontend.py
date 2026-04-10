#!/usr/bin/env python3
"""Analyze frontend with graphify, applying ID and quality guards before export."""

from __future__ import annotations

import json
import re
import traceback
from collections import defaultdict
from pathlib import Path

import networkx as nx
from graphify import build, cluster, export, extract

CODE_EXTENSIONS = {".ts", ".tsx", ".js", ".jsx"}
EXCLUDE_DIRS = {"node_modules", ".next", "dist", "build", "__pycache__"}
STRUCTURAL_SELF_LOOP_RELATIONS = {"imports_from", "contains"}
RELATION_WEIGHTS = {
    "imports_from": 1.0,
    "calls": 0.8,
    "contains": 0.15,
}
BUCKET_AFFINITY_WEIGHT = 0.12


def _slug(value: str) -> str:
    return re.sub(r"[^a-zA-Z0-9]+", "_", value).strip("_").lower() or "unknown"


def _normalize_relpath(path_str: str, root: Path) -> str:
    p = Path(path_str)
    try:
        rel = p.resolve().relative_to(root.resolve())
    except Exception:
        rel = Path(path_str)
    return str(rel).replace("\\", "/").lstrip("./").lower()


def _is_file_level_node(node: dict) -> bool:
    label = str(node.get("label", ""))
    return Path(label).suffix.lower() in CODE_EXTENSIONS


def _expected_id_kind(relation: str, endpoint_role: str) -> str | None:
    relation = relation.strip().lower()
    endpoint_role = endpoint_role.strip().lower()
    if relation == "imports_from":
        return "file"
    if relation == "contains":
        return "file" if endpoint_role == "source" else "symbol"
    if relation in {"calls", "implements", "inherits", "references", "cites"}:
        return "symbol"
    return None


def _score_endpoint_candidate(
    candidate: dict,
    *,
    old_id: str,
    edge_norm_path: str,
    relation: str,
    endpoint_role: str,
) -> int:
    score = 0
    expected_kind = _expected_id_kind(relation, endpoint_role)
    kind = str(candidate.get("id_kind", ""))
    norm_path = str(candidate.get("normalized_path", ""))
    label = str(candidate.get("label", ""))

    if expected_kind and kind == expected_kind:
        score += 7
    if norm_path == edge_norm_path:
        score += 5
    if relation == "contains" and endpoint_role == "target" and norm_path == edge_norm_path:
        score += 3
    if relation == "calls" and endpoint_role == "target" and norm_path == edge_norm_path:
        score += 2

    old_slug = _slug(old_id)
    label_slug = _slug(label)
    if old_slug and old_slug in label_slug:
        score += 1

    # Prefer deterministic stable selection even if several candidates tie.
    return score


def _choose_best_candidate(
    candidates: list[dict],
    *,
    old_id: str,
    edge_norm_path: str,
    relation: str,
    endpoint_role: str,
) -> tuple[str | None, bool]:
    if not candidates:
        return None, False
    if len(candidates) == 1:
        return str(candidates[0]["id"]), False

    ranked = sorted(
        candidates,
        key=lambda c: (
            _score_endpoint_candidate(
                c,
                old_id=old_id,
                edge_norm_path=edge_norm_path,
                relation=relation,
                endpoint_role=endpoint_role,
            ),
            str(c.get("id", "")),
        ),
        reverse=True,
    )
    return str(ranked[0]["id"]), True


def _bucket_key(normalized_path: str) -> str:
    parts = [p for p in normalized_path.split("/") if p]
    if len(parts) >= 3 and parts[0] == "features":
        return f"features/{parts[1]}"
    if len(parts) >= 2 and parts[0] == "app":
        return f"app/{parts[1]}"
    if parts:
        return parts[0]
    return "unknown"


def _make_canonical_node_id(node: dict, root: Path) -> tuple[str, str, str]:
    source_file = str(node.get("source_file", ""))
    normalized_path = _normalize_relpath(source_file, root)
    label = str(node.get("label", ""))
    source_loc = str(node.get("source_location", "")).strip()

    if _is_file_level_node(node):
        return f"file::{normalized_path}", "file", normalized_path

    symbol = _slug(label)
    if source_loc:
        symbol = f"{symbol}::{_slug(source_loc)}"
    return f"symbol::{normalized_path}::{symbol}", "symbol", normalized_path


def _scan_code_files(frontend_src: Path) -> list[Path]:
    files: list[Path] = []
    for pattern in ("**/*.tsx", "**/*.ts", "**/*.jsx", "**/*.js"):
        files.extend(frontend_src.glob(pattern))
    return sorted(
        f for f in files if not any(part in EXCLUDE_DIRS for part in f.parts)
    )


def _remap_extraction(extracted: dict, root: Path) -> tuple[dict, dict]:
    old_id_to_nodes: dict[str, list[dict]] = defaultdict(list)
    old_and_source_to_nodes: dict[tuple[str, str], list[dict]] = defaultdict(list)
    remapped_nodes: list[dict] = []
    used_ids: set[str] = set()

    audit = {
        "node_id_collisions": 0,
        "edge_dropped_missing_endpoint": 0,
        "edge_dropped_ambiguous_endpoint": 0,
        "edge_resolved_by_scoring": 0,
        "edge_dropped_structural_self_loop": 0,
        "edge_kept": 0,
    }

    for node in extracted.get("nodes", []):
        old_id = str(node.get("id", ""))
        canonical_id, id_kind, normalized_path = _make_canonical_node_id(node, root)
        new_id = canonical_id
        counter = 2
        while new_id in used_ids:
            audit["node_id_collisions"] += 1
            new_id = f"{canonical_id}::{counter}"
            counter += 1

        used_ids.add(new_id)
        new_node = dict(node)
        new_node["id"] = new_id
        new_node["id_kind"] = id_kind
        new_node["normalized_path"] = normalized_path
        new_node["canonical_id_version"] = "v2_path_based"

        remapped_nodes.append(new_node)
        old_id_to_nodes[old_id].append(new_node)
        old_and_source_to_nodes[(old_id, normalized_path)].append(new_node)

    def resolve_endpoint(old_id: str, edge_source_file: str, relation: str, endpoint_role: str) -> str | None:
        norm_path = _normalize_relpath(edge_source_file, root)
        strict_matches = old_and_source_to_nodes.get((old_id, norm_path), [])
        chosen, was_scored = _choose_best_candidate(
            strict_matches,
            old_id=old_id,
            edge_norm_path=norm_path,
            relation=relation,
            endpoint_role=endpoint_role,
        )
        if chosen:
            if was_scored:
                audit["edge_resolved_by_scoring"] += 1
            return chosen

        loose_matches = old_id_to_nodes.get(old_id, [])
        chosen, was_scored = _choose_best_candidate(
            loose_matches,
            old_id=old_id,
            edge_norm_path=norm_path,
            relation=relation,
            endpoint_role=endpoint_role,
        )
        if chosen:
            if was_scored:
                audit["edge_resolved_by_scoring"] += 1
            return chosen

        if loose_matches or strict_matches:
            audit["edge_dropped_ambiguous_endpoint"] += 1
        else:
            audit["edge_dropped_missing_endpoint"] += 1
        return None

    remapped_edges: list[dict] = []
    for edge in extracted.get("edges", []):
        old_source = str(edge.get("source", ""))
        old_target = str(edge.get("target", ""))
        relation = str(edge.get("relation", ""))
        edge_file = str(edge.get("source_file", ""))

        new_source = resolve_endpoint(old_source, edge_file, relation, "source")
        new_target = resolve_endpoint(old_target, edge_file, relation, "target")
        if not new_source or not new_target:
            continue

        if new_source == new_target and relation in STRUCTURAL_SELF_LOOP_RELATIONS:
            audit["edge_dropped_structural_self_loop"] += 1
            continue

        new_edge = dict(edge)
        new_edge["source"] = new_source
        new_edge["target"] = new_target
        remapped_edges.append(new_edge)
        audit["edge_kept"] += 1

    remapped = {
        "nodes": remapped_nodes,
        "edges": remapped_edges,
        "hyperedges": extracted.get("hyperedges", []),
        "input_tokens": extracted.get("input_tokens", 0),
        "output_tokens": extracted.get("output_tokens", 0),
    }
    return remapped, audit


def _project_file_graph(graph: nx.Graph, root: Path) -> nx.Graph:
    projected = nx.Graph()

    def file_node_id(node_id: str) -> str | None:
        src = str(graph.nodes[node_id].get("source_file", "")).strip()
        if not src:
            return None
        return f"file::{_normalize_relpath(src, root)}"

    for node_id in graph.nodes:
        fnode = file_node_id(node_id)
        if fnode and fnode not in projected:
            projected.add_node(fnode)

    for src, tgt, attrs in graph.edges(data=True):
        fs = file_node_id(src)
        ft = file_node_id(tgt)
        if not fs or not ft or fs == ft:
            continue
        relation = str(attrs.get("relation", ""))
        weight = RELATION_WEIGHTS.get(relation, 0.3)
        if projected.has_edge(fs, ft):
            projected[fs][ft]["weight"] += weight
        else:
            projected.add_edge(fs, ft, weight=weight)

    # Density tuning: connect isolated/sparse files to a same-bucket anchor using weak affinity.
    buckets: dict[str, list[str]] = defaultdict(list)
    for file_id in projected.nodes:
        path = str(file_id).removeprefix("file::")
        buckets[_bucket_key(path)].append(file_id)

    for _, file_ids in buckets.items():
        if len(file_ids) < 2:
            continue
        anchor = max(file_ids, key=lambda fid: projected.degree(fid, weight="weight"))
        for fid in file_ids:
            if fid == anchor:
                continue
            if projected.has_edge(anchor, fid):
                continue
            projected.add_edge(anchor, fid, weight=BUCKET_AFFINITY_WEIGHT, derived="bucket_affinity")

    return projected


def _lift_file_communities(graph: nx.Graph, file_communities: dict[int, list[str]], root: Path) -> dict[int, list[str]]:
    file_to_cid = {fid: cid for cid, fids in file_communities.items() for fid in fids}
    lifted: dict[int, list[str]] = defaultdict(list)
    orphan_cid = max(file_communities.keys(), default=-1) + 1

    for node_id, attrs in graph.nodes(data=True):
        src = str(attrs.get("source_file", "")).strip()
        if not src:
            lifted[orphan_cid].append(node_id)
            continue
        fid = f"file::{_normalize_relpath(src, root)}"
        cid = file_to_cid.get(fid, orphan_cid)
        lifted[cid].append(node_id)

    return {cid: sorted(nodes) for cid, nodes in sorted(lifted.items(), key=lambda x: x[0])}


def _top_file_hotspots(file_graph: nx.Graph, top_n: int = 10) -> list[dict]:
    ranked = sorted(file_graph.degree(weight="weight"), key=lambda x: x[1], reverse=True)
    result = []
    for node_id, score in ranked[:top_n]:
        path = node_id.removeprefix("file::")
        result.append({"file": path, "hotspot_score": round(float(score), 3)})
    return result


def _symbol_hotspots(graph: nx.Graph, top_n: int = 80) -> list[dict]:
    ranked = sorted(graph.degree(), key=lambda x: x[1], reverse=True)
    result: list[dict] = []
    for node_id, degree in ranked:
        attrs = graph.nodes[node_id]
        label = str(attrs.get("label", ""))
        if label.endswith((".ts", ".tsx", ".js", ".jsx")):
            continue
        source_file = str(attrs.get("source_file", "")).strip()
        if not source_file:
            continue
        result.append(
            {
                "id": node_id,
                "label": label,
                "degree": int(degree),
                "source_file": source_file,
                "source_location": str(attrs.get("source_location", "")).strip(),
                "normalized_path": str(attrs.get("normalized_path", "")).strip(),
                "id_kind": str(attrs.get("id_kind", "")).strip(),
            }
        )
        if len(result) >= top_n:
            break
    return result


def _build_change_guide(
    graph: nx.Graph,
    file_hotspots: list[dict],
    output_dir: Path,
) -> tuple[Path, Path]:
    symbol_targets = _symbol_hotspots(graph)
    targets_by_file: dict[str, list[dict]] = defaultdict(list)
    for t in symbol_targets:
        key = t.get("normalized_path") or t.get("source_file")
        targets_by_file[key].append(t)

    # Keep only strongest nodes per file for fast triage.
    for key in list(targets_by_file.keys()):
        targets_by_file[key] = sorted(
            targets_by_file[key], key=lambda x: x["degree"], reverse=True
        )[:8]

    json_payload = {
        "summary": {
            "target_files": len(targets_by_file),
            "target_symbols": len(symbol_targets),
        },
        "top_file_hotspots": file_hotspots,
        "targets_by_file": dict(sorted(targets_by_file.items(), key=lambda x: x[0])),
    }
    json_path = output_dir / "change_targets.json"
    json_path.write_text(json.dumps(json_payload, indent=2), encoding="utf-8")

    md_lines = [
        "# Change Guide",
        "",
        "Use this to quickly locate high-impact code blocks to edit.",
        "",
        "## Top Files To Start",
    ]
    for i, item in enumerate(file_hotspots[:15], 1):
        md_lines.append(
            f"{i}. {item['file']}  (hotspot_score: {item['hotspot_score']})"
        )

    md_lines += ["", "## Editable Code Blocks By File"]
    for file_key, targets in sorted(targets_by_file.items()):
        md_lines += ["", f"### {file_key}"]
        for t in targets:
            loc = t["source_location"] or "line ?"
            md_lines.append(
                f"- {t['label']} ({loc})  [degree={t['degree']}]"
            )

    md_path = output_dir / "change_guide.md"
    md_path.write_text("\n".join(md_lines), encoding="utf-8")
    return json_path, md_path


def _run_qa_gates(extracted: dict, graph: nx.Graph) -> dict:
    seen = set()
    dupes = 0
    for node in extracted.get("nodes", []):
        nid = node.get("id")
        if nid in seen:
            dupes += 1
        else:
            seen.add(nid)

    self_loops = 0
    for src, tgt, attrs in graph.edges(data=True):
        if src == tgt and attrs.get("relation") in STRUCTURAL_SELF_LOOP_RELATIONS:
            self_loops += 1

    return {
        "gate_unique_ids": dupes == 0,
        "gate_no_structural_self_loops": self_loops == 0,
        "duplicate_id_count": dupes,
        "structural_self_loop_count": self_loops,
    }


def main() -> None:
    frontend_path = Path("frontend/src").resolve()
    output_dir = Path("graphify_output").resolve()
    output_dir.mkdir(exist_ok=True)

    print(f"Analyzing frontend codebase: {frontend_path}")
    print(f"Output directory: {output_dir}\n")

    try:
        print("Scanning for code files...")
        code_files = _scan_code_files(frontend_path)
        print(f"Found {len(code_files)} code files\n")
        if not code_files:
            print("No code files found. Exiting.")
            return

        print("Extracting symbols...")
        extracted = extract.extract(code_files)
        print(
            f"Raw extraction: {len(extracted.get('nodes', []))} nodes, "
            f"{len(extracted.get('edges', []))} edges\n"
        )

        print("Applying ID remap + edge validation...")
        remapped, remap_audit = _remap_extraction(extracted, frontend_path)
        print(
            f"Sanitized extraction: {len(remapped['nodes'])} nodes, {len(remapped['edges'])} edges "
            f"(dropped loops={remap_audit['edge_dropped_structural_self_loop']}, "
            f"missing_endpoints={remap_audit['edge_dropped_missing_endpoint']}, "
            f"ambiguous_endpoints={remap_audit['edge_dropped_ambiguous_endpoint']})\n"
        )

        print("Building graph...")
        graph = build.build([remapped])
        print(f"Graph built: {graph.number_of_nodes()} nodes, {graph.number_of_edges()} edges\n")

        print("Projecting file graph for cleaner clustering/hotspots...")
        file_graph = _project_file_graph(graph, frontend_path)
        file_communities = cluster.cluster(file_graph) if file_graph.number_of_nodes() else {}
        communities = _lift_file_communities(graph, file_communities, frontend_path)
        hotspots = _top_file_hotspots(file_graph)
        print(
            f"Projected graph: {file_graph.number_of_nodes()} files, {file_graph.number_of_edges()} edges, "
            f"{len(file_communities)} file communities\n"
        )

        qa = _run_qa_gates(remapped, graph)
        print("QA gates:")
        print(f"  unique_ids: {qa['gate_unique_ids']} (duplicates={qa['duplicate_id_count']})")
        print(
            "  no_structural_self_loops: "
            f"{qa['gate_no_structural_self_loops']} "
            f"(count={qa['structural_self_loop_count']})"
        )
        print()

        print("Generating outputs...")
        json_output = str(output_dir / "knowledge_graph.json")
        html_output = str(output_dir / "graph_visualization.html")
        graphml_output = str(output_dir / "knowledge_graph.graphml")

        export.to_json(graph, communities, json_output)
        print(f"Exported JSON: {json_output}")

        export.to_html(graph, communities, html_output)
        print(f"Exported HTML: {html_output}")

        try:
            svg_output = str(output_dir / "graph_visualization.svg")
            export.to_svg(graph, communities, svg_output)
            print(f"Exported SVG: {svg_output}")
        except Exception as err:
            print(f"SVG export skipped: {err}")

        try:
            export.to_graphml(graph, communities, graphml_output)
            print(f"Exported GraphML: {graphml_output}")
        except Exception as err:
            print(f"GraphML export skipped: {err}")

        change_targets_json, change_guide_md = _build_change_guide(
            graph,
            hotspots,
            output_dir,
        )
        print(f"Wrote change targets JSON: {change_targets_json}")
        print(f"Wrote change guide markdown: {change_guide_md}")

        audit_path = output_dir / "graph_pipeline_audit.json"
        audit_payload = {
            "id_version": "v2_path_based",
            "remap_audit": remap_audit,
            "qa": qa,
            "projected_file_graph": {
                "nodes": file_graph.number_of_nodes(),
                "edges": file_graph.number_of_edges(),
                "communities": len(file_communities),
            },
            "top_file_hotspots": hotspots,
            "change_artifacts": {
                "targets_json": "change_targets.json",
                "guide_markdown": "change_guide.md",
            },
        }
        audit_path.write_text(json.dumps(audit_payload, indent=2), encoding="utf-8")
        print(f"Wrote pipeline audit: {audit_path}")

        print("\nAnalysis complete.")

    except Exception as err:
        print(f"Error: {err}")
        traceback.print_exc()


if __name__ == "__main__":
    main()