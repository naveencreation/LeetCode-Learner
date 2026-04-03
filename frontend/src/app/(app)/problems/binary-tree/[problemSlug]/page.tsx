import Link from "next/link";
import { notFound } from "next/navigation";

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
    <section className="mx-auto w-full max-w-5xl space-y-5">
      <header className="space-y-2">
        <Link
          href="/problems/topics/trees#problem-list"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          ← Back to Trees List
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">{problem.title}</h1>
        <p className="text-sm leading-relaxed text-muted-foreground">{problem.intuition}</p>
      </header>

      <article className="rounded-xl border bg-card p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Python Solution
        </h2>
        <pre className="overflow-x-auto rounded-lg border bg-slate-950 p-4 text-sm leading-6 text-slate-100">
          <code>{problem.pythonCode}</code>
        </pre>
      </article>
    </section>
  );
}
