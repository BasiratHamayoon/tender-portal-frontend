"use client";

import React from "react";

export default function LetterheadSpacer({
  height = "30vh",
  showGuideOnScreen = true,
  customLabel = "PRE-PRINTED LETTERHEAD SPACE (30% TOP MARGIN)",
}) {
  const formattedHeight = typeof height === "number" ? `${height}px` : height;

  return (
    <>
      {/* 1. ON-SCREEN VISUAL GUIDE (Hidden on print) */}
      {showGuideOnScreen && (
        <div
          className="no-print relative mb-6 w-full rounded-md border-2 border-dashed border-red-500/60 bg-red-500/5 dark:bg-red-950/20 p-4 transition-all"
          style={{ minHeight: "120px", height: formattedHeight }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-red-600 dark:text-red-400 uppercase">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{customLabel}</span>
            </div>
            <p className="mt-1 text-[11px] text-red-500/80 dark:text-red-300/70">
              This 30% top area will remain completely blank when printed to match your pre-printed letterhead paper.
            </p>
          </div>
        </div>
      )}

      {/* 2. PRINT-ONLY BLANK HEADER SPACER (Visible ONLY on print output) */}
      <div
        className="hidden print:block w-full"
        style={{
          height: formattedHeight,
          minHeight: formattedHeight,
        }}
        aria-hidden="true"
      />
    </>
  );
}