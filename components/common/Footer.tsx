import Link from "next/link";

export default function Footer() {
  return (
    <footer className="print:hidden border-t border-border">
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6 text-sm text-muted">
        <span>© {new Date().getFullYear()} 강동윤 (Dongyun Kang)</span>
        <div className="flex items-center gap-5">
          <a
            href="https://github.com/glyph8"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            GitHub
          </a>
          <a
            href="mailto:newdy0808@gmail.com"
            className="transition-colors hover:text-foreground"
          >
            Email
          </a>
          {/* 전체 인쇄 페이지 — 소형 구분선 뒤에 배치 */}
          <span className="select-none text-border" aria-hidden>·</span>
          <Link
            href="/print"
            className="font-mono text-xs transition-colors hover:text-foreground"
          >
            전체 인쇄
          </Link>
        </div>
      </div>
    </footer>
  );
}
