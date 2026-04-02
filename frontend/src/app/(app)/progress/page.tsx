import Link from "next/link";

export default function ProgressPage() {
  return (
    <section className="flex min-h-[calc(100dvh-7.5rem)] items-center justify-center px-4 py-6 sm:px-6">
      <div className="w-full max-w-[980px] text-center">
        <img
          src="/telecommuting.svg"
          alt="Under development illustration"
          className="mx-auto h-auto w-full max-w-[760px] object-contain"
        />
        <div className="mt-3 space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">CodeArena Progress</h1>
          <p className="text-base font-medium text-slate-600">
            We are currently developing this page to deliver a polished CodeArena progress experience.
          </p>
          <div className="pt-3">
            <Link
              href="/problems/topics/trees#problem-list"
              className="inline-flex items-center rounded-xl border border-sky-300 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-100"
            >
              Move To Trees Page
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
