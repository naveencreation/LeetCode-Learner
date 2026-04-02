"use client";

import { ErrorState } from "@/components/error-state";

export default function GlobalRouteError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      statusCode="500"
      title="Something Went Wrong"
      message="An unexpected error occurred while rendering this page."
      imageSrc="/error-500.svg"
      imageAlt="500 internal server error illustration"
      primaryHref="/dashboard"
      primaryLabel="Go To Dashboard"
      secondaryHref="/problems"
      secondaryLabel="Open Problems"
      extraAction={
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-100"
        >
          Try Again
        </button>
      }
    />
  );
}
