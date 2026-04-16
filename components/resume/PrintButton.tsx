"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="print:hidden inline-flex h-8 items-center gap-2.5 rounded-sm border border-border px-3.5 text-xs font-medium text-muted transition-all duration-150 hover:scale-105 hover:border-foreground hover:text-foreground active:scale-100"
    >
      PDF 다운로드
      <kbd className="font-mono text-[10px] opacity-50">⌘P</kbd>
    </button>
  );
}
