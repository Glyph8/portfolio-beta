import Link from "next/link";

export default function Navbar() {
  return (
    <header className="print:hidden sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <nav className="mx-auto flex h-14 max-w-3xl items-center justify-between px-6">
        {/* 로고 / 이름 */}
        <Link
          href="/"
          className="font-mono text-sm font-semibold tracking-tight text-foreground transition-colors hover:text-muted"
        >
          dongyun.dev
        </Link>

        {/* 네비게이션 링크 */}
        <ul className="flex items-center gap-6 text-sm text-muted">
          <li>
            <Link
              href="/#projects"
              className="transition-colors hover:text-foreground"
            >
              Projects
            </Link>
          </li>
          <li>
            <Link
              href="/log"
              className="transition-colors hover:text-foreground"
            >
              Log
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
