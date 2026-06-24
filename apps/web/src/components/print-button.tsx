"use client";

import { Printer } from "lucide-react";

/** Triggers the browser print dialog (Save as PDF). Hidden when printing. */
export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-2 rounded-[8px] bg-[#111] px-4 py-2 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
    >
      <Printer size={15} />
      Save as PDF
    </button>
  );
}
