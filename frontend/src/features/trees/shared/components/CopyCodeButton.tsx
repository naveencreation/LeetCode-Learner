"use client";

import { useCallback, useState } from "react";
import { Check, Copy } from "lucide-react";

interface CopyCodeButtonProps {
  codeLines: readonly string[];
}

export function CopyCodeButton({ codeLines }: CopyCodeButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(codeLines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: silently fail if clipboard API unavailable
    }
  }, [codeLines]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center justify-center rounded-full border border-teal-200 bg-teal-50 p-1.5 text-teal-700 transition hover:bg-teal-100"
      title="Copy code"
    >
      {copied ? (
        <Check size={12} strokeWidth={2.5} aria-hidden="true" />
      ) : (
        <Copy size={12} strokeWidth={2.5} aria-hidden="true" />
      )}
    </button>
  );
}
