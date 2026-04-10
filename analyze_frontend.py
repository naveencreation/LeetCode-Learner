#!/usr/bin/env python3
"""
Analyze the frontend folder using graphify and generate knowledge graph outputs.
"""

from pathlib import Path
from graphify import extract, build, cluster, export

def main():
    frontend_path = Path("frontend/src").resolve()
    output_dir = Path("graphify_output").resolve()
    output_dir.mkdir(exist_ok=True)
    
    print(f"📊 Analyzing frontend codebase: {frontend_path}")
    print(f"📁 Output directory: {output_dir}\n")
    
    try:
        # Find all code files
        print("🔍 Scanning for code files...")
        code_files = []
        for pattern in ["**/*.tsx", "**/*.ts", "**/*.jsx", "**/*.js"]:
            code_files.extend(frontend_path.glob(pattern))
        
        # Filter out common exclusions
        exclude_dirs = {"node_modules", ".next", "dist", "build", "__pycache__"}
        code_files = [
            f for f in code_files
            if not any(part in exclude_dirs for part in f.parts)
        ]
        
        print(f"✓ Found {len(code_files)} code files\n")
        
        if not code_files:
            print("⚠️  No code files found. Exiting.")
            return
        
        # Extract code symbols
        print("🔍 Extracting code symbols...")
        extracted = extract.extract(code_files)
        print(f"✓ Extracted {len(extracted)} symbol definitions\n")
        
        # Build knowledge graph
        print("🔗 Building knowledge graph...")
        graph = build.build([extracted])  # wrap in list as per API
        print(f"✓ Graph built: {len(graph.nodes)} nodes, {len(graph.edges)} edges\n")
        
        # Cluster communities
        print("🎯 Clustering graph communities...")
        communities = cluster.cluster(graph)
        print(f"✓ Identified {len(communities)} communities\n")
        
        # Generate outputs
        print("📈 Generating outputs...")
        
        # 1. Export as JSON
        json_output = str(output_dir / "knowledge_graph.json")
        export.to_json(graph, communities, json_output)
        print(f"✓ Exported to JSON: {json_output}")
        
        # 2. Export as HTML
        html_output = str(output_dir / "graph_visualization.html")
        export.to_html(graph, communities, html_output)
        print(f"✓ Exported to HTML: {html_output}")
        
        # 3. Export as SVG
        svg_output = str(output_dir / "graph_visualization.svg")
        try:
            export.to_svg(graph, communities, svg_output)
            print(f"✓ Exported to SVG: {svg_output}")
        except Exception as e:
            print(f"⚠️  SVG export skipped: {e}")
        
        # 4. Export as GraphML
        graphml_output = str(output_dir / "knowledge_graph.graphml")
        try:
            export.to_graphml(graph, communities, graphml_output)
            print(f"✓ Exported to GraphML: {graphml_output}")
        except Exception as e:
            print(f"⚠️  GraphML export skipped: {e}")
        
        print(f"\n✨ Analysis complete! Check {output_dir} for outputs.")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()



if __name__ == "__main__":
    main()