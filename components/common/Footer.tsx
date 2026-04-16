export default function Footer() {
  return (
    <footer className="print:hidden border-t border-border">
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6 text-sm text-muted">
        <span>© {new Date().getFullYear()} 강동윤 (Dean Kang)</span>
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
        </div>
      </div>
    </footer>
  );
}
