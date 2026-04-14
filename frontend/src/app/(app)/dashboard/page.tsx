import Link from "next/link";
import Image from "next/image";

export default function DashboardPage() {
  return (
    <section className="grid h-[calc(100dvh-7rem)] min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-4 overflow-hidden px-4 py-4 sm:px-6 sm:py-5">
      <header className="traversal-panel relative overflow-hidden border-slate-200 p-4 sm:p-5">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_15%,rgba(56,189,248,0.24),transparent_36%),radial-gradient(circle_at_88%_0%,rgba(16,185,129,0.2),transparent_30%)]" />
        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-sky-700">ThinkDSA</p>
            <h1 className="mt-1 text-[clamp(24px,2.2vw,34px)] font-extrabold leading-[1.08] tracking-[-0.02em] text-slate-900">
              Dashboard Preview
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-600">
              Tree modules are live. Use quick actions below to jump directly into practice.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/problems/topics/trees#problem-list"
              className="inline-flex items-center rounded-xl border border-sky-300 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-100"
            >
              Open Trees Page
            </Link>
            <Link
              href="/problems"
              className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Explore Problems
            </Link>
          </div>
        </div>
      </header>

      <div className="flex min-h-0 items-center justify-center overflow-hidden">
        <div className="flex h-full w-full max-w-[980px] flex-col items-center justify-center gap-3 text-center">
          <Image
            src="/telecommuting.svg"
            alt="Under development illustration"
            width={760}
            height={520}
            className="mx-auto h-auto max-h-[44dvh] w-full max-w-[760px] object-contain md:max-h-[48dvh]"
            priority
          />
          <div className="shrink-0 space-y-1">
            <h2 className="text-[clamp(26px,2.1vw,34px)] font-extrabold tracking-tight text-slate-900">ThinkDSA Dashboard</h2>
            <p className="text-sm font-medium text-slate-600 sm:text-base">
              We are currently developing this page to deliver a polished ThinkDSA dashboard experience.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
