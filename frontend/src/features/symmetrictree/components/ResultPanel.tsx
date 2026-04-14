interface ResultPanelProps {
	currentNode: number | null;
	currentPhase: string;
	result: boolean | null;
	currentStep: number;
	totalSteps: number;
	currentOperation: string;
	symmetricResult: boolean | null;
}

export function ResultPanel({
	currentNode,
	currentPhase,
	currentStep,
	totalSteps,
	currentOperation,
	symmetricResult,
}: ResultPanelProps) {
	const statusLabel =
		symmetricResult === null
			? "Checking..."
			: symmetricResult
				? "Symmetric"
				: "Not Symmetric";

	return (
		<section className="traversal-panel grid h-full min-h-0 overflow-hidden grid-rows-[auto_minmax(0,1fr)] gap-1.5 p-2">
			<div className="traversal-panel-header">
				<h2 className="traversal-panel-title">Mirror Check Progress</h2>
			</div>

			<div className="ui-scrollbar min-h-0 overflow-y-auto pr-1">
				<div className="grid content-start gap-1.5">
					<div className="grid grid-cols-2 gap-1.5">
						<div className="rounded-lg border bg-gradient-to-br from-teal-700 to-teal-500 p-1.5 text-center text-white transition-all duration-200">
							<p className="text-[10px] font-bold uppercase tracking-[0.03em] text-teal-100">Current Node</p>
							<p className="mt-0.5 text-xl font-extrabold">{currentNode ?? "-"}</p>
						</div>
						<div className="rounded-lg border bg-gradient-to-br from-teal-700 to-teal-500 p-1.5 text-center text-white transition-all duration-200">
							<p className="text-[10px] font-bold uppercase tracking-[0.03em] text-teal-100">Phase</p>
							<p className="mt-0.5 truncate text-xl font-extrabold">{currentPhase}</p>
						</div>
					</div>

					<div className="rounded-lg border border-slate-200 bg-white p-2 text-[12px]">
						<span className="font-bold text-slate-700">Status: </span>
						<span className="font-extrabold text-teal-700">{statusLabel}</span>
					</div>

					<div
						className={`transition-all duration-300 rounded-lg border px-2 py-1.5 text-[11px] leading-snug ${
							currentStep >= totalSteps
								? "border-emerald-200 bg-emerald-50 font-bold text-emerald-900"
								: "border-amber-200 bg-amber-50 text-amber-900"
						}`}
					>
						{currentStep >= totalSteps ? "✅ " : "👉 "}
						<span className="font-bold">
							{currentStep >= totalSteps ? "Mirror validation complete." : `Step ${currentStep + 1}: ${currentOperation}`}
						</span>
					</div>
				</div>
			</div>
		</section>
	);
}
