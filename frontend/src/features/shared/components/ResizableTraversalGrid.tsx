"use client";

import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

const COLUMN_GAP_PX = 6;
const MIN_COLUMN_WIDTHS = [300, 360, 250] as const;
const HEADER_COLLAPSE_PADDING_PX = 10;
const HEADER_COLLAPSE_FALLBACK_PX = 56;
const LAYOUT_STORAGE_PREFIX = "traversal-layout:";

type RowDivider = "middle" | "right";

interface ResizableTraversalGridProps {
  left: ReactNode;
  middleTop: ReactNode;
  middleBottom: ReactNode;
  middleFooter: ReactNode;
  rightTop: ReactNode;
  rightBottom: ReactNode;
  initialColumnPercents?: [number, number, number];
  initialMiddleRowPercents?: [number, number];
  initialRightRowPercents?: [number, number];
  storageKey?: string;
  className?: string;
  onResetReady?: (resetFn: () => void) => void;
}

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

function getHeaderMinimumWidth(
  panelRef: RefObject<HTMLDivElement | null>,
  fallback: number,
): number {
  const panel = panelRef.current;
  if (!panel) {
    return fallback;
  }

  const headerElement = panel.querySelector<HTMLElement>(".traversal-panel-header");
  if (!headerElement) {
    return fallback;
  }

  const measured = Math.ceil(headerElement.scrollWidth + 20);
  if (!Number.isFinite(measured) || measured <= 0) {
    return fallback;
  }

  return Math.max(fallback, measured);
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

function getGridAvailableWidth(gridElement: HTMLDivElement): number {
  const rect = gridElement.getBoundingClientRect();
  return Math.max(rect.width - COLUMN_GAP_PX * 2, 1);
}

function getEffectiveColumnMinimums(
  availableWidth: number,
  requestedMins: [number, number, number],
): [number, number, number] {
  const baseMins = [...requestedMins] as [number, number, number];
  const totalBaseMins = baseMins[0] + baseMins[1] + baseMins[2];

  if (availableWidth >= totalBaseMins) {
    return baseMins;
  }

  const scale = availableWidth / totalBaseMins;
  return [
    Math.max(baseMins[0] * scale, 1),
    Math.max(baseMins[1] * scale, 1),
    Math.max(baseMins[2] * scale, 1),
  ];
}

function constrainColumnPercents(
  percents: [number, number, number],
  availableWidth: number,
  requestedMins: [number, number, number],
): [number, number, number] {
  const mins = getEffectiveColumnMinimums(availableWidth, requestedMins);
  let widths = percents.map((percent) => (percent / 100) * availableWidth) as [
    number,
    number,
    number,
  ];

  widths = widths.map((width, index) => Math.max(width, mins[index])) as [number, number, number];

  const overflow = widths[0] + widths[1] + widths[2] - availableWidth;
  if (overflow > 0) {
    const reducible = widths.map((width, index) => width - mins[index]) as [number, number, number];
    const totalReducible = reducible[0] + reducible[1] + reducible[2];

    if (totalReducible > 0) {
      widths = widths.map((width, index) => {
        const reduction = (overflow * reducible[index]) / totalReducible;
        return width - reduction;
      }) as [number, number, number];
    } else {
      widths = mins;
    }
  }

  const total = widths[0] + widths[1] + widths[2];
  if (total <= 0) {
    return [33, 40, 27];
  }

  return [
    (widths[0] / total) * 100,
    (widths[1] / total) * 100,
    (widths[2] / total) * 100,
  ];
}

export function ResizableTraversalGrid({
  left,
  middleTop,
  middleBottom,
  middleFooter,
  rightTop,
  rightBottom,
  initialColumnPercents = [33, 40, 27],
  initialMiddleRowPercents = [62, 38],
  initialRightRowPercents = [36, 64],
  storageKey,
  className,
  onResetReady,
}: ResizableTraversalGridProps) {
  const pathname = usePathname();
  const [isXlLayout, setIsXlLayout] = useState(false);
  const [columnPercents, setColumnPercents] = useState<[number, number, number]>(initialColumnPercents);
  const [activeDivider, setActiveDivider] = useState<0 | 1 | null>(null);
  const [middleRowPercents, setMiddleRowPercents] = useState<[number, number]>(initialMiddleRowPercents);
  const [rightRowPercents, setRightRowPercents] = useState<[number, number]>(initialRightRowPercents);
  const [activeRowDivider, setActiveRowDivider] = useState<RowDivider | null>(null);
  const [hasLoadedLayoutMemory, setHasLoadedLayoutMemory] = useState(false);

  const gridRef = useRef<HTMLDivElement | null>(null);
  const middleStackRef = useRef<HTMLDivElement | null>(null);
  const middleControlsRef = useRef<HTMLDivElement | null>(null);
  const rightStackRef = useRef<HTMLDivElement | null>(null);
  const middleTopPanelRef = useRef<HTMLDivElement | null>(null);
  const middleBottomPanelRef = useRef<HTMLDivElement | null>(null);
  const rightTopPanelRef = useRef<HTMLDivElement | null>(null);
  const rightBottomPanelRef = useRef<HTMLDivElement | null>(null);
  const persistTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getRequestedColumnMinimums = useCallback(
    (): [number, number, number] => [
      MIN_COLUMN_WIDTHS[0],
      getHeaderMinimumWidth(middleTopPanelRef, MIN_COLUMN_WIDTHS[1]),
      Math.max(
        getHeaderMinimumWidth(rightTopPanelRef, MIN_COLUMN_WIDTHS[2]),
        getHeaderMinimumWidth(rightBottomPanelRef, MIN_COLUMN_WIDTHS[2]),
      ),
    ],
    [],
  );

  const resolvedStorageKey = useMemo(() => {
    if (storageKey) {
      return storageKey;
    }

    if (!pathname) {
      return null;
    }

    return `${LAYOUT_STORAGE_PREFIX}${pathname}`;
  }, [pathname, storageKey]);

  useEffect(() => {
    if (!resolvedStorageKey) {
      setHasLoadedLayoutMemory(true);
      return;
    }

    try {
      const raw = window.localStorage.getItem(resolvedStorageKey);
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
  }, [resolvedStorageKey]);

  useEffect(() => {
    if (!resolvedStorageKey || !hasLoadedLayoutMemory) {
      return;
    }

    const isDragging = activeDivider !== null || activeRowDivider !== null;
    if (isDragging) {
      if (persistTimerRef.current) {
        clearTimeout(persistTimerRef.current);
        persistTimerRef.current = null;
      }
      return;
    }

    persistTimerRef.current = setTimeout(() => {
      window.localStorage.setItem(
        resolvedStorageKey,
        JSON.stringify({
          columnPercents,
          middleRowPercents,
          rightRowPercents,
        }),
      );
      persistTimerRef.current = null;
    }, 200);

    return () => {
      if (persistTimerRef.current) {
        clearTimeout(persistTimerRef.current);
        persistTimerRef.current = null;
      }
    };
  }, [
    resolvedStorageKey,
    hasLoadedLayoutMemory,
    activeDivider,
    activeRowDivider,
    columnPercents,
    middleRowPercents,
    rightRowPercents,
  ]);

  useEffect(() => {
    if (!isXlLayout) {
      return;
    }

    const gridElement = gridRef.current;
    if (!gridElement) {
      return;
    }

    const reconcileColumns = () => {
      const availableWidth = getGridAvailableWidth(gridElement);
      const requestedColumnMinimums = getRequestedColumnMinimums();
      setColumnPercents((previous) => {
        const next = constrainColumnPercents(previous, availableWidth, requestedColumnMinimums);
        const maxDiff = Math.max(
          Math.abs(previous[0] - next[0]),
          Math.abs(previous[1] - next[1]),
          Math.abs(previous[2] - next[2]),
        );

        return maxDiff > 0.05 ? next : previous;
      });
    };

    reconcileColumns();

    const observer = new ResizeObserver(reconcileColumns);
    observer.observe(gridElement);

    return () => {
      observer.disconnect();
    };
  }, [getRequestedColumnMinimums, isXlLayout]);

  const resetLayout = useCallback(() => {
    setColumnPercents(initialColumnPercents);
    setMiddleRowPercents(initialMiddleRowPercents);
    setRightRowPercents(initialRightRowPercents);
    setActiveDivider(null);
    setActiveRowDivider(null);
  }, [initialColumnPercents, initialMiddleRowPercents, initialRightRowPercents]);

  useEffect(() => {
    onResetReady?.(resetLayout);
  }, [onResetReady, resetLayout]);

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
      const availableWidth = getGridAvailableWidth(gridElement);
      const requestedColumnMinimums = getRequestedColumnMinimums();
      const [minWidth1, minWidth2, minWidth3] = getEffectiveColumnMinimums(
        availableWidth,
        requestedColumnMinimums,
      );

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
      const nextPercents: [number, number, number] = [
        (column1 / total) * 100,
        (column2 / total) * 100,
        (column3 / total) * 100,
      ];

      setColumnPercents(constrainColumnPercents(nextPercents, availableWidth, requestedColumnMinimums));
    };

    const onMouseUp = () => setActiveDivider(null);

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
  }, [activeDivider, columnPercents, getRequestedColumnMinimums, isXlLayout]);

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

    const onMouseUp = () => setActiveRowDivider(null);

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

  return (
    <div
      ref={gridRef}
      className={[
        "relative grid min-h-0 overflow-hidden gap-1.5 px-2 pb-2 md:px-3 md:pb-3 xl:grid-cols-[minmax(300px,1.2fr)_minmax(380px,1.45fr)_minmax(250px,0.95fr)]",
        className ?? "",
      ].join(" ")}
      style={gridTemplateColumns ? { gridTemplateColumns } : undefined}
    >
      <div className="min-h-0 min-w-0 xl:row-span-3">{left}</div>

      <div className="min-h-0 min-w-0 xl:col-start-2 xl:row-span-3">
        <div
          ref={middleStackRef}
          className="grid h-full min-h-0 gap-1.5 xl:gap-0"
          style={middleStackTemplateRows ? { gridTemplateRows: middleStackTemplateRows } : undefined}
        >
          <div ref={middleTopPanelRef} className="min-h-0">
            {middleTop}
          </div>

          <button
            type="button"
            aria-label="Resize between middle top and middle bottom panels"
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
            {middleBottom}
          </div>

          <div ref={middleControlsRef} className="min-h-0 pt-1.5 xl:pt-1.5">
            {middleFooter}
          </div>
        </div>
      </div>

      <div className="min-h-0 min-w-0 xl:col-start-3 xl:row-span-3">
        <div
          ref={rightStackRef}
          className="grid h-full min-h-0 gap-1.5 xl:gap-0"
          style={rightStackTemplateRows ? { gridTemplateRows: rightStackTemplateRows } : undefined}
        >
          <div ref={rightTopPanelRef} className="min-h-0">
            {rightTop}
          </div>

          <button
            type="button"
            aria-label="Resize between right top and right bottom panels"
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
            {rightBottom}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 hidden xl:block">
        <button
          type="button"
          aria-label="Resize between left and middle columns"
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
          aria-label="Resize between middle and right columns"
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
  );
}
