"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { useParams } from "next/navigation";

import {
  getProblemHref,
  sections,
  topicConfigurations,
} from "../../page";

export default function TopicProblemsPage() {
  const params = useParams<{ topicKey: string }>();
  const topicKey = Array.isArray(params.topicKey)
    ? params.topicKey[0]
    : params.topicKey;
  const [query, setQuery] = useState("");

  const topicConfig = topicConfigurations.find((topic) => topic.key === topicKey);

  const topicData = useMemo(() => {
    if (!topicConfig) {
      return null;
    }

    const sectionItems = sections.filter((section) =>
      topicConfig.matches(section.name),
    );

    const problems = sectionItems.flatMap((section) =>
      section.problems.map((problem) => ({
        sectionName: section.name,
        problem,
        href: getProblemHref(section.name, problem),
      })),
    );

    const solved = sectionItems.reduce((sum, section) => sum + section.solved, 0);
    const liveCount = problems.filter((item) => Boolean(item.href)).length;

    return {
      ...topicConfig,
      solved,
      liveCount,
      total: problems.length,
      sectionsCount: sectionItems.length,
      progress:
        problems.length === 0 ? 0 : Math.round((solved / problems.length) * 100),
      problems,
    };
  }, [topicConfig]);

  if (!topicData) {
    return (
      <section className="space-y-4">
        <div className="traversal-panel p-6">
          <h1 className="text-2xl font-extrabold text-slate-900">Topic Not Found</h1>
          <p className="mt-2 text-sm text-slate-600">
            The selected topic does not exist in the current collection.
          </p>
          <Link
            href="/problems"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft size={14} strokeWidth={2} aria-hidden="true" />
            Back To Problems
          </Link>
        </div>
      </section>
    );
  }

  const Icon = topicData.icon;

  const filteredProblems = topicData.problems.filter((item) =>
    `${item.problem} ${item.sectionName}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <section className="flex min-h-0 flex-col gap-4 xl:h-[calc(100dvh-7.5rem)]">
      <div className="flex items-center justify-between gap-2">
        <Link
          href="/problems"
          className="traversal-pill inline-flex items-center gap-1.5 transition hover:bg-slate-50"
        >
          <ArrowLeft size={12} strokeWidth={2} aria-hidden="true" />
          Back To Collections
        </Link>
      </div>

      <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[340px,1fr]">
        <aside className="traversal-panel h-fit p-5 xl:sticky xl:top-0">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-200 bg-sky-50 text-sky-700">
            <Icon size={22} strokeWidth={2.2} aria-hidden="true" />
          </div>

          <h1 className="text-[30px] font-extrabold tracking-[-0.03em] text-slate-900">
            {topicData.title}
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">{topicData.description}</p>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.04em] text-slate-500">
              Progress
            </p>
            <p className="mt-2 text-3xl font-extrabold tabular-nums text-slate-900">
              {topicData.solved}/{topicData.total}
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-500"
                style={{ width: `${topicData.progress}%` }}
              />
            </div>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.04em] text-slate-500">
              {topicData.progress}% complete
            </p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-xs font-semibold text-slate-500">Sections</p>
              <p className="mt-1 text-2xl font-extrabold tabular-nums text-slate-900">
                {topicData.sectionsCount}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-xs font-semibold text-slate-500">Live</p>
              <p className="mt-1 text-2xl font-extrabold tabular-nums text-emerald-600">
                {topicData.liveCount}
              </p>
            </div>
          </div>
        </aside>

        <div id="problem-list" className="traversal-panel flex min-h-0 flex-col overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50/80 px-4 py-3 sm:px-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-extrabold tracking-tight text-slate-900">
                Problem List
              </h2>

              <label className="relative block w-full max-w-xs">
                <Search
                  size={15}
                  strokeWidth={2}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search questions"
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
                />
              </label>
            </div>
          </div>

          <div className="ui-scrollbar min-h-0 flex-1 space-y-2 overflow-y-auto p-3 sm:p-4">
            {filteredProblems.map((item, index) => {
              if (item.href) {
                return (
                  <Link
                    key={`${item.sectionName}-${item.problem}`}
                    href={item.href}
                    className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-[0_8px_20px_rgba(15,23,42,0.08)]"
                  >
                    <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-md border border-emerald-200 bg-emerald-50 px-1 text-xs font-bold tabular-nums text-emerald-700">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {item.problem}
                      </p>
                      <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-slate-500">
                        {item.sectionName}
                      </p>
                    </div>
                    <span className="traversal-pill border-emerald-200 bg-emerald-50 text-emerald-700">
                      Live
                    </span>
                  </Link>
                );
              }

              return (
                <div
                  key={`${item.sectionName}-${item.problem}`}
                  className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3"
                >
                  <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-md border border-slate-200 bg-slate-50 px-1 text-xs font-bold tabular-nums text-slate-600">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {item.problem}
                    </p>
                    <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-slate-500">
                      {item.sectionName}
                    </p>
                  </div>
                  <span className="traversal-pill border-slate-200 bg-slate-100 text-slate-600">
                    Planned
                  </span>
                </div>
              );
            })}

            {filteredProblems.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center">
                <p className="text-sm font-semibold text-slate-700">No matching problems</p>
                <p className="mt-1 text-xs text-slate-500">
                  Try a different keyword in search.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
