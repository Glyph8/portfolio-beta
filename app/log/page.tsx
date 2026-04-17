import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Log",
  // layout.tsx template → "Log | 강동윤"
};

/** "YYYY-MM-DD" → "YYYY.MM.DD" */
function formatDate(iso: string) {
  return iso.replace(/-/g, ".");
}

export default function LogPage() {
  const posts = getAllPosts();

  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-16 print:py-8">

      {/* ── 섹션 레이블 ── */}
      <p className="mb-10 border-t border-border pt-8 font-mono text-xs font-medium uppercase tracking-[0.25em] text-muted">
        Log
      </p>

      {posts.length === 0 ? (
        <p className="font-mono text-sm text-muted">아직 작성된 글이 없습니다.</p>
      ) : (
        <ol className="divide-y divide-border">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/log/${post.slug}`}
                className="group flex items-baseline justify-between gap-6 py-6 transition-colors hover:text-foreground"
              >
                {/* 왼쪽: 날짜 + 제목 + 요약 */}
                <div className="min-w-0">
                  <p className="mb-1.5 font-mono text-[11px] text-muted">
                    {formatDate(post.date)}
                  </p>
                  <h2 className="text-base font-bold tracking-tight text-foreground">
                    {post.title}
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted line-clamp-2">
                    {post.summary}
                  </p>
                </div>

                {/* 오른쪽: 화살표 — 호버 시에만 foreground */}
                <span
                  className="shrink-0 font-mono text-xs text-border transition-colors group-hover:text-muted"
                  aria-hidden
                >
                  →
                </span>
              </Link>
            </li>
          ))}
        </ol>
      )}

    </article>
  );
}
