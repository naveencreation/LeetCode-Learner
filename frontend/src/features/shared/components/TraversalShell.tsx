"use client";

import { useState, type ReactNode } from "react";
import { ProblemFocusHeader } from "@/components/problem-focus-header";
import { ResizableTraversalGrid } from "@/features/shared/components/ResizableTraversalGrid";

export interface TraversalShellStat {
  label: string;
  value: ReactNode;
  minWidthClassName?: string;
}

interface TraversalShellProps {
  title: string;
  subtitle: string;
  guideHref: string;
  stats: TraversalShellStat[];
  left: ReactNode;
  middleTop: ReactNode;
  middleBottom: ReactNode;
  middleFooter: ReactNode;
  rightTop: ReactNode;
  rightBottom: ReactNode;
  modal?: ReactNode;
  headerExtraActions?: ReactNode;
  contentGapClassName?: string;
  gridClassName?: string;
}

export function TraversalShell({
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
  contentGapClassName = "gap-1.5",
  gridClassName = "xl:grid-cols-[minmax(300px,1.2fr)_minmax(380px,1.45fr)_minmax(250px,0.95fr)]",
}: TraversalShellProps) {
  const [resetLayout, setResetLayout] = useState<(() => void) | null>(null);

  return (
    <section className="relative h-full min-h-0 overflow-hidden bg-[linear-gradient(140deg,#eff6ff_0%,#fdfdfc_60%,#eefbf9_100%)]">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_15%_20%,#dff6f2_0%,transparent_30%),radial-gradient(circle_at_82%_10%,#fff4e8_0%,transparent_24%)]" />

      <div className={`relative z-[1] grid h-full min-h-0 grid-rows-[auto_1fr] ${contentGapClassName}`}>
        <ProblemFocusHeader
          title={title}
          subtitle={subtitle}
          guideHref={guideHref}
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
          className={gridClassName}
        />

        {modal ?? null}
      </div>
    </section>
  );
}
