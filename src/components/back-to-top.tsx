"use client";

import { useEffect, useState } from "react";

export function BackToTop({ targetId }: { targetId: string }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const scrollTarget = document.getElementById(targetId);

    if (!scrollTarget) {
      return undefined;
    }

    function updateVisibility() {
      setIsVisible((scrollTarget?.scrollTop ?? 0) > 980);
    }

    updateVisibility();
    scrollTarget.addEventListener("scroll", updateVisibility, { passive: true });

    return () => scrollTarget.removeEventListener("scroll", updateVisibility);
  }, [targetId]);

  function scrollToTop() {
    document.getElementById(targetId)?.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!isVisible) {
    return null;
  }

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={scrollToTop}
      className="focus-ring fixed bottom-[calc(env(safe-area-inset-bottom)+1rem)] right-4 z-40 inline-flex h-9 items-center gap-1.5 rounded-md border border-white/[0.08] bg-slate-950/88 px-2.5 text-xs font-semibold text-slate-200 shadow-command backdrop-blur transition hover:bg-white/[0.08] sm:bottom-5 sm:right-5 sm:h-10 sm:gap-2 sm:px-3 sm:text-sm"
    >
      <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4 sm:size-5" fill="none">
        <path d="M5 12.5 10 7l5 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>Top</span>
    </button>
  );
}
