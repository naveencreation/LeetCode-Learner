import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

interface ErrorStateProps {
  title: string;
  message: string;
  imageSrc: string;
  imageAlt: string;
  statusCode?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  extraAction?: ReactNode;
}

export function ErrorState({
  title,
  message,
  imageSrc,
  imageAlt,
  statusCode,
  primaryHref = "/dashboard",
  primaryLabel = "Go To Dashboard",
  secondaryHref = "/problems",
  secondaryLabel = "Open Problems",
  extraAction,
}: ErrorStateProps) {
  return (
    <section className="box-border flex h-[100dvh] overflow-hidden items-center justify-center px-4 py-4">
      <div className="flex h-full w-full max-w-[980px] flex-col items-center justify-center text-center">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={760}
          height={520}
          className="mx-auto h-auto max-h-[58dvh] w-full max-w-[760px] object-contain"
        />

        <div className="mt-3 space-y-1">
          {statusCode ? (
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Error {statusCode}</p>
          ) : null}
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{title}</h1>
          <p className="text-base font-medium text-slate-600">{message}</p>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <Link
            href={primaryHref}
            className="inline-flex items-center rounded-xl border border-sky-300 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-100"
          >
            {primaryLabel}
          </Link>
          <Link
            href={secondaryHref}
            className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            {secondaryLabel}
          </Link>
          {extraAction}
        </div>
      </div>
    </section>
  );
}
