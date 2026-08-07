"use client";

import Link from "next/link";
import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  ChevronDown,
  Clock,
  Command,
  Filter,
  Layers,
  ListChecks,
  Play,
  Search,
  Sparkles,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ArrayIcon,
  LinkedListIcon,
  BinaryTreeIcon,
  BSTIcon,
  GraphIcon,
  DPIcon,
  RecursionIcon,
  LeetCodeIcon,
  GFGIcon,
} from "@/components/dsa-icons";
import {
  sections,
  getProblemHref,
  getGuideHref,
  getPlatformLink,
  topicConfigurations,
  topicAccents,
  defaultAccent,
  type Accent,
} from "@/data/problems-data";

export {
  sections,
  getProblemHref,
  getGuideHref,
  getPlatformLink,
  topicConfigurations,
  topicAccents,
  defaultAccent,
  type Accent,
};

type ViewMode = "topics" | "sheet";

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function ProblemsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("topics");
  const [searchQuery, setSearchQuery] = useState("");
  const [openSections, setOpenSections] = useState<string[]>([sections[0].name]);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const totalProblems = useMemo(
    () => sections.reduce((sum, s) => sum + s.problems.length, 0),
    [],
  );
  const totalSolved = useMemo(
    () => sections.reduce((sum, s) => sum + s.solved, 0),
    [],
  );
  const totalLive = useMemo(
    () =>
      sections.reduce(
        (sum, s) =>
          sum + s.problems.filter((p) => getProblemHref(s.name, p) !== null).length,
        0,
      ),
    [],
  );

  const toggleSection = useCallback((name: string) => {
    setOpenSections((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    );
  }, []);

  const topicCollections = useMemo(
    () =>
      topicConfigurations.map((topic) => {
        const sectionItems = sections.filter((s) => topic.matches(s.name));
        const problems = sectionItems.flatMap((s) =>
          s.problems.map((p) => ({
            sectionName: s.name,
            problem: p,
            href: getProblemHref(s.name, p),
          })),
        );
        const liveCount = problems.filter((i) => Boolean(i.href)).length;
        const solved = sectionItems.reduce((sum, s) => sum + s.solved, 0);
        const total = problems.length;
        return {
          ...topic,
          sectionsCount: sectionItems.length,
          solved,
          total,
          liveCount,
          progress: total === 0 ? 0 : Math.round((solved / total) * 100),
          problems,
        };
      }),
    [],
  );

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const q = searchQuery.toLowerCase();
    return sections
      .map((s) => ({
        ...s,
        problems: s.problems.filter((p) => p.toLowerCase().includes(q)),
      }))
      .filter((s) => s.problems.length > 0);
  }, [searchQuery]);

  const featured = topicCollections.reduce((best, t) =>
    t.liveCount > best.liveCount ? t : best,
  );

  return (
    <div className="space-y-8">
      {/* ═══ HERO ═══ */}
      <header className="relative isolate overflow-hidden rounded-2xl border border-slate-200/50 bg-white">
        {/* Dot grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: "radial-gradient(circle, #94a3b8 0.8px, transparent 0.8px)",
            backgroundSize: "20px 20px",
          }}
        />
        {/* Gradient blobs */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gradient-to-br from-sky-300/25 via-indigo-300/15 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-60 w-60 rounded-full bg-gradient-to-tr from-emerald-300/20 via-teal-200/10 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-96 -translate-x-1/2 bg-gradient-to-b from-violet-200/10 to-transparent blur-2xl" />
        {/* Top accent stripe */}
        <div className="absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-500 opacity-80" />

        <div className="relative px-6 pb-7 pt-10 sm:px-8 sm:pt-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-white shadow-lg shadow-slate-900/20">
                <Zap size={10} strokeWidth={2.5} aria-hidden="true" className="text-amber-400" />
                Interview Prep
              </div>

              <h1 className="text-[clamp(28px,3vw,42px)] font-extrabold leading-[1.08] tracking-[-0.035em] text-slate-900">
                Problem<br />
                <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 bg-clip-text text-transparent">
                  Collection
                </span>
              </h1>

              <p className="text-[15px] leading-relaxed text-slate-500">
                <span className="font-semibold text-slate-700">{totalProblems}</span> problems across{" "}
                <span className="font-semibold text-slate-700">{topicConfigurations.length}</span> topics.
                Dive into interactive visualizers and structured learning paths.
              </p>
            </div>

            {/* Stat blocks */}
            <div className="flex shrink-0 items-stretch gap-3">
              <StatBlock label="Total" value={totalProblems} sub="problems" />
              <StatBlock label="Solved" value={totalSolved} sub={`of ${totalProblems}`} accent="emerald" />
              <StatBlock label="Live" value={totalLive} sub="visualizers" accent="sky" />
            </div>
          </div>

          {/* Search + view toggle */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="relative block w-full max-w-lg">
              <Search
                size={16}
                strokeWidth={2}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                ref={searchRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search problems..."
                className="h-11 w-full rounded-xl border border-slate-200/80 bg-white pl-11 pr-20 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              />
              <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 sm:inline-flex">
                <Command size={10} strokeWidth={2} aria-hidden="true" />K
              </kbd>
            </label>

            <div className="inline-flex items-center self-start rounded-xl border border-slate-200/80 bg-white p-1 shadow-sm">
              {(
                [
                  { key: "topics" as const, label: "Topics", icon: Layers },
                  { key: "sheet" as const, label: "All Sections", icon: ListChecks },
                ] as const
              ).map((tab) => {
                const TabIcon = tab.icon;
                const active = viewMode === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setViewMode(tab.key)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all",
                      active
                        ? "bg-slate-900 text-white shadow-lg shadow-slate-900/15"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-700",
                    )}
                  >
                    <TabIcon size={13} strokeWidth={2} aria-hidden="true" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* ═══ FEATURED TOPIC ═══ */}
      {viewMode === "topics" && !searchQuery.trim() && (
        <FeaturedTopicCard topic={featured} accent={topicAccents[featured.key] ?? defaultAccent} />
      )}

      {/* ═══ TOPIC CARDS / SECTION VIEW ═══ */}
      {viewMode === "topics" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {topicCollections
            .filter((t) => {
              if (searchQuery.trim()) {
                return t.problems.some((p) =>
                  p.problem.toLowerCase().includes(searchQuery.toLowerCase()),
                );
              }
              return t.key !== featured.key;
            })
            .map((topic) => {
              const Icon = topic.icon;
              const accent = topicAccents[topic.key] ?? defaultAccent;
              return (
                <Link
                  key={topic.key}
                  href={`/problems/topics/${topic.key}`}
                  className={cn(
                    "group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/60 bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)]",
                    accent.hoverBorder,
                  )}
                >
                  {/* Left accent stripe */}
                  <div className={cn("absolute bottom-0 left-0 top-0 w-[3px] rounded-l-2xl opacity-0 transition-opacity duration-200 group-hover:opacity-100", accent.stripe)} />
                  {/* Background glow */}
                  <div className={cn("pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100", accent.glow)} />

                  <div className="relative flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className={cn(
                          "inline-flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-200 group-hover:shadow-lg group-hover:ring-4",
                          accent.bg, accent.border, accent.icon, accent.ring,
                        )}
                      >
                        <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
                      </span>
                      <div className="flex items-center gap-2">
                        {topic.liveCount > 0 && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                            <Zap size={8} strokeWidth={2.5} aria-hidden="true" />
                            {topic.liveCount}
                          </span>
                        )}
                        <span className="rounded-full border border-slate-200/80 bg-slate-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.05em] text-slate-500">
                          {topic.sectionsCount}s
                        </span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h3 className="text-[17px] font-bold tracking-tight text-slate-900">
                        {topic.title}
                      </h3>
                      <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-slate-500">
                        {topic.description}
                      </p>
                    </div>

                    <div className="mt-auto pt-5">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                        <span className="tabular-nums">{topic.solved}/{topic.total}</span>
                        <span className="tabular-nums">{topic.progress}%</span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out", accent.bar)}
                          style={{ width: `${Math.max(topic.progress, 2)}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className="text-xs font-semibold text-slate-400 transition-colors group-hover:text-slate-600">
                        Explore topic
                      </span>
                      <span className={cn(
                        "inline-flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-200",
                        "bg-slate-100 text-slate-400 group-hover:bg-slate-900 group-hover:text-white group-hover:shadow-lg",
                      )}>
                        <ArrowRight size={13} strokeWidth={2} aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-slate-400">
              {filteredSections.length} {filteredSections.length === 1 ? "section" : "sections"}
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setOpenSections(filteredSections.map((s) => s.name))}
                className="rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              >
                Expand all
              </button>
              <span className="text-slate-300">&middot;</span>
              <button
                type="button"
                onClick={() => setOpenSections([])}
                className="rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              >
                Collapse all
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {filteredSections.map((section, sIdx) => {
              const isOpen = openSections.includes(section.name);
              const panelId = `section-panel-${sIdx}`;
              const progress =
                section.problems.length === 0
                  ? 0
                  : Math.round((section.solved / section.problems.length) * 100);
              const liveCt = section.problems.filter(
                (p) => getProblemHref(section.name, p) !== null,
              ).length;

              return (
                <article
                  key={section.name}
                  className={cn(
                    "overflow-hidden rounded-xl border bg-white transition-shadow",
                    isOpen ? "border-slate-200 shadow-sm" : "border-slate-200/60",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggleSection(section.name)}
                    className="group flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-slate-50/60"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                  >
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold tabular-nums text-slate-500 transition group-hover:bg-slate-200/80">
                      {sIdx + 1}
                    </span>

                    <div className="min-w-0 flex-1">
                      <h2 className="truncate text-[15px] font-semibold text-slate-800">
                        {section.name}
                      </h2>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      {liveCt > 0 && (
                        <span className="hidden items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white sm:inline-flex">
                          {liveCt} live
                        </span>
                      )}
                      <div className="hidden h-1.5 w-20 overflow-hidden rounded-full bg-slate-100 sm:block md:w-28">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-slate-300 to-slate-400 transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="w-[52px] text-right text-xs font-semibold tabular-nums text-slate-400">
                        {section.solved}/{section.problems.length}
                      </span>
                      <ChevronDown
                        size={14}
                        strokeWidth={2.2}
                        className={cn(
                          "shrink-0 text-slate-400 transition-transform duration-200",
                          isOpen ? "rotate-0" : "-rotate-90",
                        )}
                        aria-hidden="true"
                      />
                    </div>
                  </button>

                  {isOpen && (
                    <div
                      id={panelId}
                      className="border-t border-slate-100 bg-slate-50/40 px-5 py-4"
                    >
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {section.problems.map((problem, pIdx) => {
                          const href = getProblemHref(section.name, problem);
                          const isLive = href !== null;
                          const guideHref = getGuideHref(problem);
                          const platform = getPlatformLink(problem);

                          if (isLive) {
                            return (
                              <div
                                key={problem}
                                className="group/card flex items-center gap-2.5 rounded-lg border border-slate-200/80 bg-white px-3 py-2.5 transition-all hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-100/50"
                              >
                                <span className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-md border border-emerald-200 bg-emerald-50 px-1 text-[11px] font-bold tabular-nums text-emerald-600">
                                  {pIdx + 1}
                                </span>
                                <span className="flex-1 truncate text-[13px] font-medium text-slate-700">
                                  {problem}
                                </span>
                                <div className="flex shrink-0 items-center gap-1">
                                  <Link href={href} title="Visualizer" className="inline-flex h-6 w-6 items-center justify-center rounded border border-emerald-200 bg-emerald-50 text-emerald-600 transition hover:bg-emerald-100">
                                    <Play size={11} strokeWidth={2.5} aria-hidden="true" />
                                  </Link>
                                  {guideHref && (
                                    <Link href={guideHref} title="Learn" className="inline-flex h-6 w-6 items-center justify-center rounded border border-sky-200 bg-sky-50 text-sky-600 transition hover:bg-sky-100">
                                      <BookOpen size={11} strokeWidth={2.5} aria-hidden="true" />
                                    </Link>
                                  )}
                                  {platform && (
                                    <a href={platform.url} target="_blank" rel="noopener noreferrer" title={platform.platform === "leetcode" ? "LeetCode" : "GeeksforGeeks"} className="inline-flex h-6 w-6 items-center justify-center rounded border border-slate-200 bg-slate-50 transition hover:bg-slate-100">
                                      {platform.platform === "leetcode" ? <LeetCodeIcon size={12} aria-hidden="true" /> : <GFGIcon size={12} aria-hidden="true" />}
                                    </a>
                                  )}
                                </div>
                              </div>
                            );
                          }

                          return (
                            <div
                              key={problem}
                              className="flex items-center gap-2.5 rounded-lg border border-dashed border-slate-200/80 bg-white/50 px-3 py-2.5"
                            >
                              <span className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-md border border-slate-200 bg-slate-50 px-1 text-[11px] font-bold tabular-nums text-slate-400">
                                {pIdx + 1}
                              </span>
                              <span className="flex-1 truncate text-[13px] font-medium text-slate-500">
                                {problem}
                              </span>
                              <div className="flex shrink-0 items-center gap-1">
                                {platform && (
                                  <a href={platform.url} target="_blank" rel="noopener noreferrer" title={platform.platform === "leetcode" ? "LeetCode" : "GeeksforGeeks"} className="inline-flex h-6 w-6 items-center justify-center rounded border border-slate-200 bg-slate-50 transition hover:bg-slate-100">
                                    {platform.platform === "leetcode" ? <LeetCodeIcon size={12} aria-hidden="true" /> : <GFGIcon size={12} aria-hidden="true" />}
                                  </a>
                                )}
                                <Clock size={11} strokeWidth={2} className="shrink-0 text-slate-300" aria-hidden="true" />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          {filteredSections.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white py-20 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <Filter size={20} strokeWidth={1.5} className="text-slate-400" aria-hidden="true" />
              </div>
              <p className="mt-4 text-sm font-semibold text-slate-700">No matching sections</p>
              <p className="mt-1 text-xs text-slate-400">
                Try a different search term or clear the filter.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══ FEATURED TOPIC — wide highlighted card ═══ */
function FeaturedTopicCard({ topic, accent }: {
  topic: {
    key: string; title: string; description: string;
    icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
    liveCount: number; solved: number; total: number; progress: number; sectionsCount: number;
    problems: { sectionName: string; problem: string; href: string | null }[];
  };
  accent: Accent;
}) {
  const Icon = topic.icon;
  const topProblems = topic.problems.filter((p) => p.href).slice(0, 5);

  return (
    <Link
      href={`/problems/topics/${topic.key}`}
      className={cn(
        "group relative flex flex-col gap-6 overflow-hidden rounded-2xl border border-slate-200/50 bg-white p-6 transition-all duration-200 hover:shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-8 lg:flex-row lg:items-center lg:gap-10",
        accent.hoverBorder,
      )}
    >
      <div className={cn("pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br to-transparent blur-3xl", accent.glow)} />
      <div className={cn("pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-gradient-to-tr to-transparent opacity-50 blur-2xl", accent.glow)} />

      <div className="relative flex-1 space-y-4">
        <div className="flex items-center gap-3">
          <span className={cn(
            "inline-flex h-12 w-12 items-center justify-center rounded-2xl border transition-all group-hover:shadow-lg group-hover:ring-4",
            accent.bg, accent.border, accent.icon, accent.ring,
          )}>
            <Icon size={24} strokeWidth={1.6} aria-hidden="true" />
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em] text-amber-900 shadow-sm">
            <Sparkles size={9} strokeWidth={2.5} aria-hidden="true" />
            Featured
          </span>
        </div>

        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-[28px]">
            {topic.title}
          </h2>
          <p className="mt-2 max-w-md text-[14px] leading-relaxed text-slate-500">
            {topic.description} — {topic.liveCount} interactive visualizers ready to explore.
          </p>
        </div>

        <div className="flex items-center gap-5">
          <div>
            <p className="text-2xl font-extrabold tabular-nums text-slate-900">{topic.total}</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">Problems</p>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div>
            <p className="text-2xl font-extrabold tabular-nums text-emerald-600">{topic.liveCount}</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">Live</p>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div>
            <p className="text-2xl font-extrabold tabular-nums text-slate-900">{topic.sectionsCount}</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">Sections</p>
          </div>
        </div>
      </div>

      {topProblems.length > 0 && (
        <div className="relative w-full shrink-0 lg:w-72">
          <p className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.06em] text-slate-400">
            Top problems
          </p>
          <div className="space-y-1.5">
            {topProblems.map((p, i) => (
              <div
                key={p.problem}
                className="flex items-center gap-2.5 rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2 transition group-hover:border-slate-200 group-hover:bg-white"
              >
                <span className={cn(
                  "inline-flex h-5 min-w-[20px] items-center justify-center rounded text-[10px] font-bold tabular-nums",
                  accent.bg, accent.text,
                )}>
                  {i + 1}
                </span>
                <span className="flex-1 truncate text-[12px] font-medium text-slate-600">
                  {p.problem}
                </span>
                <ArrowUpRight size={11} strokeWidth={2} className="shrink-0 text-slate-400" aria-hidden="true" />
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-slate-400 transition group-hover:text-slate-700">
            View all {topic.total} problems
            <ArrowRight size={12} strokeWidth={2} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </div>
        </div>
      )}
    </Link>
  );
}

/* ─── Stat block for hero ─── */
function StatBlock({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: number;
  sub: string;
  accent?: "emerald" | "sky";
}) {
  const valueColor = accent === "emerald"
    ? "text-emerald-600"
    : accent === "sky"
      ? "text-sky-600"
      : "text-slate-900";

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200/60 bg-white/80 px-5 py-3.5 backdrop-blur-sm">
      <p className={cn("text-2xl font-extrabold tabular-nums tracking-tight", valueColor)}>
        {value}
      </p>
      <p className="text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">
        {label}
      </p>
      <p className="text-[9px] font-medium text-slate-300">
        {sub}
      </p>
    </div>
  );
}
