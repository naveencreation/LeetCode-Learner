"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type ProblemFocusStat = {
  label: string;
  value: ReactNode;
  minWidthClassName?: string;
};

interface ProblemFocusHeaderProps {
  title: string;
  subtitle: string;
  guideHref?: string;
  guideLabel?: string;
  stats: ProblemFocusStat[];
  extraActions?: ReactNode;
  backHref?: string;
  backLabel?: string;
}

export function ProblemFocusHeader({
  title,
  subtitle,
  guideHref,
  guideLabel = "Read Here",
  stats,
  extraActions,
  backHref = "/problems/topics/trees#problem-list",
  backLabel = "Back To Trees List",
}: ProblemFocusHeaderProps) {
  return (
    <header className="sticky top-0 z-20 grid shrink-0 items-center gap-1.5 border-b border-slate-200/70 bg-white/85 px-3 py-2 backdrop-blur supports-[backdrop-filter]:bg-white/70 lg:grid-cols-[minmax(280px,1fr)_auto] md:px-4">
      <div className="min-w-0">
        <h1 className="text-[clamp(20px,2vw,28px)] font-extrabold leading-[1.15] tracking-[-0.02em] text-slate-900">
          {title}
        </h1>
        <p className="mt-0.5 text-xs font-semibold text-slate-500">{subtitle}</p>
      </div>

      <div className="flex flex-wrap items-center justify-start gap-2 lg:justify-end">
        {guideHref ? (
          <Link
            href={guideHref}
            className="inline-flex items-center gap-1 rounded-full border border-teal-200 bg-teal-50 px-2.5 py-1.5 text-[12px] font-extrabold text-teal-700 transition hover:bg-teal-100"
          >
            {guideLabel}
          </Link>
        ) : null}

        {extraActions}

        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`inline-flex items-center justify-between gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 ${stat.minWidthClassName ?? ""}`.trim()}
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.04em] text-slate-500">
              {stat.label}
            </span>
            <span className="truncate text-[13px] font-extrabold text-slate-900">{stat.value}</span>
          </div>
        ))}

        <Link
          href={backHref}
          className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-[12px] font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          ← {backLabel}
        </Link>
      </div>
    </header>
  );
}
