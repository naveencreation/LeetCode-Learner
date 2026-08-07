"use client";

import { useEffect, useRef } from "react";

interface TraversalKeyboardActions {
  nextStep: () => void;
  previousStep: () => void;
  resetTraversal: () => void;
}

export function useTraversalKeyboardShortcuts({
  nextStep,
  previousStep,
  resetTraversal,
}: TraversalKeyboardActions): void {
  const actionsRef = useRef<TraversalKeyboardActions>({
    nextStep,
    previousStep,
    resetTraversal,
  });

  useEffect(() => {
    actionsRef.current = { nextStep, previousStep, resetTraversal };
  }, [nextStep, previousStep, resetTraversal]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        actionsRef.current.nextStep();
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        actionsRef.current.previousStep();
        return;
      }

      if (event.key.toLowerCase() === "r") {
        event.preventDefault();
        actionsRef.current.resetTraversal();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}