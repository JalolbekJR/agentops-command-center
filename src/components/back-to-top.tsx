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
      setIsVisible((scrollTarget?.scrollTop ?? 0) > 420);
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
      className="fixed bottom-5 right-5 z-40 grid size-11 place-items-center rounded-full bg-slate-900/95 text-slate-200 shadow-command backdrop-blur transition hover:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-slate-400/40"
    >
      <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5" fill="none">
        <path d="M5 12.5 10 7l5 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
