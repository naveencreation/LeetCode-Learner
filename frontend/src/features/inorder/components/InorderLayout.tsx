"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { ProblemFocusHeader } from "@/components/problem-focus-header";

import { getCodeLineForStep } from "../selectors";
import { useInorderTraversal } from "../useInorderTraversal";
import { CallStackPanel } from "./CallStackPanel";
import { CodePanel } from "./CodePanel";
import { ControlsBar } from "./ControlsBar";
import { ExplanationPanel } from "./ExplanationPanel";
import { ResultPanel } from "./ResultPanel";
import { TreePanel } from "./TreePanel";

const TreeSetupModal = dynamic(() =>
  import("./TreeSetupModal").then((module) => module.TreeSetupModal),
);

const COLUMN_GAP_PX = 6;
const MIN_COLUMN_WIDTHS = [300, 360, 250] as const;
const HEADER_COLLAPSE_PADDING_PX = 10;
const HEADER_COLLAPSE_FALLBACK_PX = 56;
const LAYOUT_STORAGE_PREFIX = "traversal-layout:";
const DEFAULT_COLUMN_PERCENTS: [number, number, number] = [33, 40, 27];
const DEFAULT_MIDDLE_ROW_PERCENTS: [number, number] = [62, 38];
const DEFAULT_RIGHT_ROW_PERCENTS: [number, number] = [36, 64];

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function getHeaderMinimumHeight(panelRef: RefObject<HTMLDivElement | null>): number {
  const panel = panelRef.current;
  if (!panel) {
    return HEADER_COLLAPSE_FALLBACK_PX;
  }

  const headerElement = panel.querySelector<HTMLElement>(".traversal-panel-header");
  if (!headerElement) {
    return HEADER_COLLAPSE_FALLBACK_PX;
  }

  return Math.ceil(headerElement.getBoundingClientRect().height + HEADER_COLLAPSE_PADDING_PX);
}

function setCollapsedVisualState(
  panelWrapperRef: RefObject<HTMLDivElement | null>,
  isCollapsed: boolean,
): void {
  const panelElement = panelWrapperRef.current?.querySelector<HTMLElement>(".traversal-panel");
  if (!panelElement) {
    return;
  }

  panelElement.setAttribute("data-collapsed", isCollapsed ? "true" : "false");
}

function normalizeDistribution(
  values: number[] | undefined,
  expectedLength: number,
): number[] | null {
  if (!values || values.length !== expectedLength) {
    return null;
  }

  if (values.some((value) => !Number.isFinite(value) || value <= 0)) {
    return null;
  }

  const total = values.reduce((sum, value) => sum + value, 0);
  if (total <= 0) {
    return null;
  }

  return values.map((value) => (value / total) * 100);
}

export function InorderLayout() {
  const pathname = usePathname();
  const [isTreeSetupOpen, setIsTreeSetupOpen] = useState(false);
  const [isXlLayout, setIsXlLayout] = useState(false);
  const [columnPercents, setColumnPercents] = useState<[number, number, number]>(
    DEFAULT_COLUMN_PERCENTS,
  );
  const [activeDivider, setActiveDivider] = useState<0 | 1 | null>(null);
  const [middleRowPercents, setMiddleRowPercents] = useState<[number, number]>(
    DEFAULT_MIDDLE_ROW_PERCENTS,
  );
  const [rightRowPercents, setRightRowPercents] = useState<[number, number]>(
    DEFAULT_RIGHT_ROW_PERCENTS,
  );
  const [activeRowDivider, setActiveRowDivider] = useState<"middle" | "right" | null>(null);
  const [hasLoadedLayoutMemory, setHasLoadedLayoutMemory] = useState(false);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const middleStackRef = useRef<HTMLDivElement | null>(null);
  const middleControlsRef = useRef<HTMLDivElement | null>(null);
  const rightStackRef = useRef<HTMLDivElement | null>(null);
  const middleTopPanelRef = useRef<HTMLDivElement | null>(null);
  const middleBottomPanelRef = useRef<HTMLDivElement | null>(null);
  const rightTopPanelRef = useRef<HTMLDivElement | null>(null);
  const rightBottomPanelRef = useRef<HTMLDivElement | null>(null);
  const layoutStorageKey = useMemo(() => {
    if (!pathname) {
      return null;
    }

    return `${LAYOUT_STORAGE_PREFIX}${pathname}`;
  }, [pathname]);

  const {
    currentCodeLine,
    currentNode,
    currentOperation,
    currentPhase,
    currentStep,
    executionSteps,
    root,
    selectedPreset,
    presets,
    customNodePositions,
    executedStep,
    isAtEnd,
    isAtStart,
    controlMode,
    setControlMode,
    isPlaying,
    autoPlaySpeedMs,
    setAutoPlaySpeedMs,
    playTraversal,
    pauseTraversal,
    nextStep,
    nodeStates,
    previousStep,
    resetTraversal,
    result,
    totalSteps,
    activeCallStack,
    activeStep,
    applyTreeConfiguration,
  } = useInorderTraversal();

  const executionLineNumbers = useMemo(() => {
    const lineNumbers = new Set<number>([currentCodeLine]);

    executionSteps.forEach((step) => {
      lineNumbers.add(getCodeLineForStep(step));
    });

    return Array.from(lineNumbers).sort((a, b) => a - b);
  }, [currentCodeLine, executionSteps]);

  useEffect(() => {
    if (!layoutStorageKey) {
      setHasLoadedLayoutMemory(true);
      return;
    }

    try {
      const raw = window.localStorage.getItem(layoutStorageKey);
      if (!raw) {
        return;
      }

      const parsed = JSON.parse(raw) as {
        columnPercents?: number[];
        middleRowPercents?: number[];
        rightRowPercents?: number[];
      };

      const persistedColumns = normalizeDistribution(parsed.columnPercents, 3);
      const persistedMiddleRows = normalizeDistribution(parsed.middleRowPercents, 2);
      const persistedRightRows = normalizeDistribution(parsed.rightRowPercents, 2);

      if (persistedColumns) {
        setColumnPercents(persistedColumns as [number, number, number]);
      }

      if (persistedMiddleRows) {
        setMiddleRowPercents(persistedMiddleRows as [number, number]);
      }

      if (persistedRightRows) {
        setRightRowPercents(persistedRightRows as [number, number]);
      }
    } catch {
      // Ignore malformed data and continue with defaults.
    } finally {
      setHasLoadedLayoutMemory(true);
    }
  }, [layoutStorageKey]);

  useEffect(() => {
    if (!layoutStorageKey || !hasLoadedLayoutMemory) {
      return;
    }

    window.localStorage.setItem(
      layoutStorageKey,
      JSON.stringify({
        columnPercents,
        middleRowPercents,
        rightRowPercents,
      }),
    );
  }, [
    layoutStorageKey,
    hasLoadedLayoutMemory,
    columnPercents,
    middleRowPercents,
    rightRowPercents,
  ]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1280px)");
    const syncLayout = (event: MediaQueryList | MediaQueryListEvent) => {
      setIsXlLayout(event.matches);
    };

    syncLayout(mediaQuery);
    mediaQuery.addEventListener("change", syncLayout);

    return () => {
      mediaQuery.removeEventListener("change", syncLayout);
    };
  }, []);

  useEffect(() => {
    if (!isXlLayout || activeDivider === null) {
      return;
    }

    const onMouseMove = (event: MouseEvent) => {
      const gridElement = gridRef.current;
      if (!gridElement) {
        return;
      }

      const rect = gridElement.getBoundingClientRect();
      const availableWidth = Math.max(rect.width - COLUMN_GAP_PX * 2, 1);
      const minWidth1 = MIN_COLUMN_WIDTHS[0];
      const minWidth2 = MIN_COLUMN_WIDTHS[1];
      const minWidth3 = MIN_COLUMN_WIDTHS[2];

      let [column1, column2, column3] = columnPercents.map(
        (percent) => (percent / 100) * availableWidth,
      ) as [number, number, number];

      const pointerX = clamp(event.clientX - rect.left, 0, availableWidth);

      if (activeDivider === 0) {
        const nextColumn1 = clamp(pointerX, minWidth1, availableWidth - minWidth2 - minWidth3);
        column1 = nextColumn1;
        column2 = availableWidth - column1 - column3;

        if (column2 < minWidth2) {
          const deficit = minWidth2 - column2;
          column3 = Math.max(minWidth3, column3 - deficit);
          column2 = availableWidth - column1 - column3;
        }
      } else {
        const dividerMin = column1 + minWidth2;
        const dividerMax = availableWidth - minWidth3;
        const nextDivider = clamp(pointerX, dividerMin, dividerMax);
        column2 = nextDivider - column1;
        column3 = availableWidth - nextDivider;
      }

      if (column1 < minWidth1 || column2 < minWidth2 || column3 < minWidth3) {
        return;
      }

      const total = column1 + column2 + column3;
      setColumnPercents([
        (column1 / total) * 100,
        (column2 / total) * 100,
        (column3 / total) * 100,
      ]);
    };

    const onMouseUp = () => {
      setActiveDivider(null);
    };

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [activeDivider, columnPercents, isXlLayout]);

  useEffect(() => {
    if (!isXlLayout || activeRowDivider === null) {
      return;
    }

    const onMouseMove = (event: MouseEvent) => {
      if (activeRowDivider === "middle") {
        const stackElement = middleStackRef.current;
        const controlsElement = middleControlsRef.current;

        if (!stackElement || !controlsElement) {
          return;
        }

        const rect = stackElement.getBoundingClientRect();
        const controlsHeight = controlsElement.offsetHeight;
        const availableHeight = Math.max(rect.height - controlsHeight - 8, 1);
        const topMin = getHeaderMinimumHeight(middleTopPanelRef);
        const bottomMin = getHeaderMinimumHeight(middleBottomPanelRef);
        const pointerY = clamp(event.clientY - rect.top, 0, availableHeight);
        const topHeight = clamp(pointerY, topMin, availableHeight - bottomMin);
        const bottomHeight = availableHeight - topHeight;

        setMiddleRowPercents([
          (topHeight / availableHeight) * 100,
          (bottomHeight / availableHeight) * 100,
        ]);
        return;
      }

      const stackElement = rightStackRef.current;
      if (!stackElement) {
        return;
      }

      const rect = stackElement.getBoundingClientRect();
      const availableHeight = Math.max(rect.height - 8, 1);
      const topMin = getHeaderMinimumHeight(rightTopPanelRef);
      const bottomMin = getHeaderMinimumHeight(rightBottomPanelRef);
      const pointerY = clamp(event.clientY - rect.top, 0, availableHeight);
      const topHeight = clamp(pointerY, topMin, availableHeight - bottomMin);
      const bottomHeight = availableHeight - topHeight;

      setRightRowPercents([
        (topHeight / availableHeight) * 100,
        (bottomHeight / availableHeight) * 100,
      ]);
    };

    const onMouseUp = () => {
      setActiveRowDivider(null);
    };

    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [activeRowDivider, isXlLayout]);

  const gridTemplateColumns = useMemo(() => {
    if (!isXlLayout) {
      return undefined;
    }

    return `${columnPercents[0]}% ${columnPercents[1]}% ${columnPercents[2]}%`;
  }, [columnPercents, isXlLayout]);

  const middleStackTemplateRows = useMemo(() => {
    if (!isXlLayout) {
      return undefined;
    }

    return `minmax(0, ${middleRowPercents[0]}fr) 8px minmax(0, ${middleRowPercents[1]}fr) auto`;
  }, [isXlLayout, middleRowPercents]);

  const rightStackTemplateRows = useMemo(() => {
    if (!isXlLayout) {
      return undefined;
    }

    return `minmax(0, ${rightRowPercents[0]}fr) 8px minmax(0, ${rightRowPercents[1]}fr)`;
  }, [isXlLayout, rightRowPercents]);

  const dividerOneLeft = columnPercents[0];
  const dividerTwoLeft = columnPercents[0] + columnPercents[1];

  const resetLayout = useCallback(() => {
    setColumnPercents(DEFAULT_COLUMN_PERCENTS);
    setMiddleRowPercents(DEFAULT_MIDDLE_ROW_PERCENTS);
    setRightRowPercents(DEFAULT_RIGHT_ROW_PERCENTS);
    setActiveDivider(null);
    setActiveRowDivider(null);
  }, []);

  const middleTopCollapsed = middleRowPercents[0] <= 11;
  const middleBottomCollapsed = middleRowPercents[1] <= 11;
  const rightTopCollapsed = rightRowPercents[0] <= 11;
  const rightBottomCollapsed = rightRowPercents[1] <= 11;

  useEffect(() => {
    setCollapsedVisualState(middleTopPanelRef, middleTopCollapsed);
    setCollapsedVisualState(middleBottomPanelRef, middleBottomCollapsed);
    setCollapsedVisualState(rightTopPanelRef, rightTopCollapsed);
    setCollapsedVisualState(rightBottomPanelRef, rightBottomCollapsed);
  }, [middleTopCollapsed, middleBottomCollapsed, rightTopCollapsed, rightBottomCollapsed]);

  return (
    <section className="relative h-full min-h-0 overflow-hidden bg-[linear-gradient(140deg,#eff6ff_0%,#fdfdfc_60%,#eefbf9_100%)]">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_15%_20%,#dff6f2_0%,transparent_30%),radial-gradient(circle_at_82%_10%,#fff4e8_0%,transparent_24%)]" />

      <div className="relative z-[1] grid h-full min-h-0 grid-rows-[auto_1fr] gap-1.5">
        <ProblemFocusHeader
          title="Inorder Tree Traversal"
          subtitle="Left -> Root -> Right recursion visualizer"
          guideHref="/problems/binary-tree/inorder-guide"
          extraActions={
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={resetLayout}
                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.04em] text-slate-700 transition hover:bg-slate-50"
                title="Reset all panel sizes"
              >
                Reset Layout
              </button>
            </div>
          }
          stats={[
            { label: "Step", value: `${currentStep}/${totalSteps}` },
            { label: "Visited", value: result.length },
            { label: "Result", value: `[${result.join(", ")}]`, minWidthClassName: "min-w-[110px]" },
          ]}
        />

      <div
        ref={gridRef}
        className="relative grid min-h-0 overflow-hidden gap-1.5 px-2 pb-2 md:px-3 md:pb-3 xl:grid-cols-[minmax(300px,1.2fr)_minmax(380px,1.45fr)_minmax(250px,0.95fr)] xl:grid-rows-[minmax(0,1.26fr)_minmax(0,0.74fr)_auto]"
        style={gridTemplateColumns ? { gridTemplateColumns } : undefined}
      >
        <div className="min-h-0 xl:row-span-3">
          <CodePanel
            currentCodeLine={currentCodeLine}
            executionLineNumbers={executionLineNumbers}
          />
        </div>

        <div className="min-h-0 xl:col-start-2 xl:row-span-3">
          <div
            ref={middleStackRef}
            className="grid h-full min-h-0 gap-1.5 xl:gap-0"
            style={middleStackTemplateRows ? { gridTemplateRows: middleStackTemplateRows } : undefined}
          >
            <div ref={middleTopPanelRef} className="min-h-0">
              <TreePanel
                root={root}
                currentOperation={currentOperation}
                nodeStates={nodeStates}
                activeStep={activeStep}
                customNodePositions={customNodePositions}
                onOpenTreeSetup={() => setIsTreeSetupOpen(true)}
              />
            </div>

            <button
              type="button"
              aria-label="Resize between tree and traversal progress panels"
              onMouseDown={() => setActiveRowDivider("middle")}
              onDoubleClick={resetLayout}
              className="group hidden cursor-row-resize items-center justify-center xl:flex"
            >
              <span
                className={`h-[2px] w-9 rounded-full transition-all ${
                  activeRowDivider === "middle"
                    ? "bg-slate-400"
                    : "bg-transparent group-hover:bg-slate-300"
                }`}
              />
            </button>

            <div ref={middleBottomPanelRef} className="min-h-0">
              <ResultPanel
                currentNode={currentNode}
                currentPhase={currentPhase}
                result={result}
                currentStep={currentStep}
                totalSteps={totalSteps}
                currentOperation={currentOperation}
              />
            </div>

            <div ref={middleControlsRef} className="min-h-0 pt-1.5 xl:pt-1.5">
              <ControlsBar
                isAtStart={isAtStart}
                isAtEnd={isAtEnd}
                controlMode={controlMode}
                setControlMode={setControlMode}
                isPlaying={isPlaying}
                autoPlaySpeedMs={autoPlaySpeedMs}
                setAutoPlaySpeedMs={setAutoPlaySpeedMs}
                playTraversal={playTraversal}
                pauseTraversal={pauseTraversal}
                nextStep={nextStep}
                previousStep={previousStep}
                resetTraversal={resetTraversal}
              />
            </div>
          </div>
        </div>

        <div className="min-h-0 xl:col-start-3 xl:row-span-3">
          <div
            ref={rightStackRef}
            className="grid h-full min-h-0 gap-1.5 xl:gap-0"
            style={rightStackTemplateRows ? { gridTemplateRows: rightStackTemplateRows } : undefined}
          >
            <div ref={rightTopPanelRef} className="min-h-0">
              <CallStackPanel activeCallStack={activeCallStack} />
            </div>

            <button
              type="button"
              aria-label="Resize between recursion stack and explanation panels"
              onMouseDown={() => setActiveRowDivider("right")}
              onDoubleClick={resetLayout}
              className="group hidden cursor-row-resize items-center justify-center xl:flex"
            >
              <span
                className={`h-[2px] w-9 rounded-full transition-all ${
                  activeRowDivider === "right"
                    ? "bg-slate-400"
                    : "bg-transparent group-hover:bg-slate-300"
                }`}
              />
            </button>

            <div ref={rightBottomPanelRef} className="min-h-0">
              <ExplanationPanel
                currentStep={currentStep}
                totalSteps={totalSteps}
                result={result}
                activeStep={executedStep}
                currentCodeLine={currentCodeLine}
              />
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 hidden xl:block">
          <button
            type="button"
            aria-label="Resize between code and visual columns"
            onMouseDown={() => setActiveDivider(0)}
            onDoubleClick={resetLayout}
            className="group pointer-events-auto absolute bottom-0 top-0 w-2 -translate-x-1/2 cursor-col-resize"
            style={{ left: `${dividerOneLeft}%` }}
          >
            <span
              className={`absolute left-1/2 top-1/2 h-11 w-[2px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-all ${
                activeDivider === 0
                  ? "bg-slate-400"
                  : "bg-transparent group-hover:bg-slate-300"
              }`}
            />
          </button>

          <button
            type="button"
            aria-label="Resize between visual and debug columns"
            onMouseDown={() => setActiveDivider(1)}
            onDoubleClick={resetLayout}
            className="group pointer-events-auto absolute bottom-0 top-0 w-2 -translate-x-1/2 cursor-col-resize"
            style={{ left: `${dividerTwoLeft}%` }}
          >
            <span
              className={`absolute left-1/2 top-1/2 h-11 w-[2px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-all ${
                activeDivider === 1
                  ? "bg-slate-400"
                  : "bg-transparent group-hover:bg-slate-300"
              }`}
            />
          </button>
        </div>
      </div>

      {isTreeSetupOpen ? (
        <TreeSetupModal
          root={root}
          selectedPreset={selectedPreset}
          presets={presets}
          customNodePositions={customNodePositions}
          onClose={() => setIsTreeSetupOpen(false)}
          onApply={(nextRoot, nextPositions, preset) =>
            applyTreeConfiguration(nextRoot, nextPositions, preset, false)
          }
          onApplyAndRun={(nextRoot, nextPositions, preset) =>
            applyTreeConfiguration(nextRoot, nextPositions, preset, true)
          }
        />
      ) : null}
      </div>
    </section>
  );
}
