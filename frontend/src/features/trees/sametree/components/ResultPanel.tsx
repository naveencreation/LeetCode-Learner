interface ResultPanelProps {
	currentNodeP: number | null;
	currentNodeQ: number | null;
	currentPhase: string;
	result: boolean | null;
	currentStep: number;
	totalSteps: number;
	currentOperation: string;
}

export function ResultPanel({
	currentNodeP,
	currentNodeQ,
	currentPhase,
	result,
	currentStep,
	totalSteps,
	currentOperation,
}: ResultPanelProps) {
	const verdictLabel =
		result === null ? "Checking..." : result ? "Same \u2713" : "Different \u2717";

	const completionMessage =
		currentStep >= totalSteps
			? result
				? "Perfect! Trees are identical."
				: "Comparison complete: trees differ."
			: `Step ${currentStep + 1}: ${currentOperation}`;

	return (
		<section className="traversal-panel grid h-full min-h-0 overflow-hidden grid-rows-[auto_minmax(0,1fr)] gap-1.5 p-2">
			<div className="traversal-panel-header">
				<h2 className="traversal-panel-title">Comparison Progress</h2>
			</div>

			<div className="ui-scrollbar min-h-0 overflow-y-auto pr-1">
				<div className="grid content-start gap-1.5">
					<div className="grid grid-cols-2 gap-1.5">
						<div className="rounded-lg border bg-gradient-to-br from-teal-700 to-teal-500 p-1.5 text-center text-white transition-all duration-200">
							<p className="text-[10px] font-bold uppercase tracking-[0.03em] text-teal-100">Current P</p>
							<p className="mt-0.5 text-xl font-extrabold">{currentNodeP ?? "-"}</p>
						</div>
						<div className="rounded-lg border bg-gradient-to-br from-teal-700 to-teal-500 p-1.5 text-center text-white transition-all duration-200">
							<p className="text-[10px] font-bold uppercase tracking-[0.03em] text-teal-100">Current Q</p>
							<p className="mt-0.5 text-xl font-extrabold">{currentNodeQ ?? "-"}</p>
						</div>
					</div>

					<div className="grid gap-1 rounded-lg">
						<p className="text-[11px] font-extrabold uppercase tracking-[0.03em] text-slate-700">Phase</p>
						<div className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm font-bold text-slate-800">
							{currentPhase}
						</div>
					</div>

					<div className="grid gap-1 rounded-lg">
						<p className="text-[11px] font-extrabold uppercase tracking-[0.03em] text-slate-700">Verdict</p>
						<div
							className={`rounded-lg border px-2 py-1.5 text-sm font-extrabold ${
								result === null
									? "border-slate-200 bg-slate-50 text-slate-700"
									: result
										? "border-emerald-200 bg-emerald-50 text-emerald-900"
										: "border-rose-200 bg-rose-50 text-rose-800"
							}`}
						>
							{verdictLabel}
						</div>
					</div>

					<div
						className={`transition-all duration-300 rounded-lg border px-2 py-1.5 text-[11px] leading-snug ${
							currentStep >= totalSteps
								? result
									? "border-emerald-200 bg-emerald-50 font-bold text-emerald-900"
									: "border-rose-200 bg-rose-50 font-bold text-rose-800"
								: "border-amber-200 bg-amber-50 text-amber-900"
						}`}
					>
						{currentStep >= totalSteps ? "\u2705 " : "\ud83d\udc49 "}
						<span className="font-bold">{completionMessage}</span>
					</div>
				</div>
			</div>
		</section>
	);
}
