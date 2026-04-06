import { notFound } from "next/navigation";

import { ProblemFocusHeader } from "@/components/problem-focus-header";
import { binaryTreeProblemData } from "@/features/binary-tree/problemData";

interface BinaryTreeProblemPageProps {
  params: Promise<{
    problemSlug: string;
  }>;
}

export default async function BinaryTreeProblemPage({ params }: BinaryTreeProblemPageProps) {
  const { problemSlug } = await params;
  const problem = binaryTreeProblemData[problemSlug];

  if (!problem) {
    notFound();
  }

  return (
    <section className="relative h-full min-h-0 overflow-y-auto bg-[linear-gradient(140deg,#eff6ff_0%,#fdfdfc_60%,#eefbf9_100%)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,#dff6f2_0%,transparent_30%),radial-gradient(circle_at_82%_10%,#fff4e8_0%,transparent_24%)]" />

      <div className="relative z-[1] mx-auto flex w-full max-w-6xl flex-col gap-3 px-2 pb-4 md:px-3 md:pb-5">
        <ProblemFocusHeader
          title={problem.title}
          subtitle="Study mode: intuition and reference implementation"
          stats={[
            { label: "Topic", value: "Binary Tree" },
            { label: "Slug", value: problem.slug },
          ]}
        />

        <div className="grid min-h-0 gap-2.5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <article className="rounded-2xl border border-white/80 bg-white/90 p-4 shadow-[0_10px_28px_rgba(15,23,42,0.08)] backdrop-blur">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.04em] text-slate-500">
              Problem Intuition
            </h2>
            <p className="text-sm leading-7 text-slate-700">{problem.intuition}</p>
          </article>

          <article className="rounded-2xl border border-white/80 bg-white/90 p-4 shadow-[0_10px_28px_rgba(15,23,42,0.08)] backdrop-blur">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.04em] text-slate-500">
              Python Reference Solution
            </h2>
            <pre className="max-h-[65vh] overflow-auto rounded-xl border border-slate-800/40 bg-slate-950 p-4 text-sm leading-6 text-slate-100">
              <code>{problem.pythonCode}</code>
            </pre>
          </article>
        </div>
      </div>
    </section>
  );
}
