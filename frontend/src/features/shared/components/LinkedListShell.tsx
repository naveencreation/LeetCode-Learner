"use client";

import { useState, type ReactNode } from "react";
import { ProblemFocusHeader } from "@/components/problem-focus-header";
import { ResizableTraversalGrid } from "@/features/shared/components/ResizableTraversalGrid";

export interface LinkedListShellStat {
  label: string;
  value: ReactNode;
  minWidthClassName?: string;
}

interface LinkedListShellProps {
  title: string;
  subtitle: string;
  guideHref: string;
  stats: LinkedListShellStat[];
  left: ReactNode;
  middleTop: ReactNode;
  middleBottom: ReactNode;
  middleFooter: ReactNode;
  rightTop: ReactNode;
  rightBottom: ReactNode;
  modal?: ReactNode;
  headerExtraActions?: ReactNode;
  topicKey?: string;
  currentHref?: string;
}

export function LinkedListShell({
  title,
  subtitle,
  guideHref,
  stats,
  left,
  middleTop,
  middleBottom,
  middleFooter,
  rightTop,
  rightBottom,
  modal,
  headerExtraActions,
  topicKey = "linked-list",
  currentHref,
}: LinkedListShellProps) {
  const [resetLayout, setResetLayout] = useState<(() => void) | null>(null);

  return (
    <section className="relative h-full min-h-0 overflow-hidden bg-[linear-gradient(140deg,#f0f0ff_0%,#fdfdfc_60%,#eef4fb_100%)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,#e8e0f8_0%,transparent_30%),radial-gradient(circle_at_82%_10%,#ffe8f0_0%,transparent_24%)]" />

      <div className="relative z-[1] grid h-full min-h-0 grid-rows-[auto_1fr] gap-1.5">
        <ProblemFocusHeader
          title={title}
          subtitle={subtitle}
          guideHref={guideHref}
          topicKey={topicKey}
          currentHref={currentHref}
          backHref="/problems/topics/linked-list#problem-list"
          backLabel="Back To Linked List"
          extraActions={
            <div className="flex items-center gap-1.5">
              {headerExtraActions ?? null}
              <button
                type="button"
                onClick={() => resetLayout?.()}
                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.04em] text-slate-700 transition hover:bg-slate-50"
                title="Reset all panel sizes"
              >
                Reset Layout
              </button>
            </div>
          }
          stats={stats}
        />

        <ResizableTraversalGrid
          left={left}
          middleTop={middleTop}
          middleBottom={middleBottom}
          middleFooter={middleFooter}
          rightTop={rightTop}
          rightBottom={rightBottom}
          onResetReady={(resetFn) => setResetLayout(() => resetFn)}
        />

        {modal ?? null}
      </div>
    </section>
  );
}
