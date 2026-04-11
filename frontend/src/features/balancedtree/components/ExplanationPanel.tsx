interface ExplanationPanelProps {
  explanation: string;
}

export function ExplanationPanel({ explanation }: ExplanationPanelProps) {
  return (
    <section className="traversal-panel grid h-full min-h-0 overflow-hidden grid-rows-[auto_minmax(0,1fr)] gap-1.5 p-2">
      <div className="traversal-panel-header">
        <h2 className="traversal-panel-title">Explanation</h2>
      </div>
      <div className="ui-scrollbar min-h-0 overflow-y-auto pr-1">
        <p className="text-[13px] leading-relaxed text-slate-700">
          {explanation || "Click 'Run' to start the algorithm"}
        </p>
      </div>
    </section>
  );
}
