import type { Metadata } from "next";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getAllPosts, getPostBySlug } from "@/lib/mdx";

const MDX_OPTIONS = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
  },
};

/* ── 정적 경로 생성 ── */
export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

/* ── 동적 메타데이터 ── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  return {
    title: post.title,
    description: post.summary,
  };
}

/** "YYYY-MM-DD" → "YYYY.MM.DD" */
function formatDate(iso: string) {
  return iso.replace(/-/g, ".");
}

/* ── 페이지 ── */
export default async function LogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-16 print:py-8 print:bg-white">

      {/* ── 뒤로가기 ── */}
      <Link
        href="/log"
        className="print:hidden mb-10 inline-flex items-center gap-1.5 font-mono text-xs text-muted transition-colors hover:text-foreground"
      >
        ← 목록으로
      </Link>

      {/* ── 포스트 헤더 ── */}
      <header className="mt-4">
        <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.25em] text-muted">
          Log
        </p>
        <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-3 font-mono text-xs text-muted">
          {formatDate(post.date)}
        </p>
      </header>

      {/* ── 본문 ── */}
      <div className="mt-10 border-t border-border pt-10">
        {/*
         * prose-zinc: zinc 팔레트 기반 — 사이트 디자인 토큰과 동일한 계열
         * prose-sm: 본문 텍스트를 14px 기준으로 유지해 이력서 전체 밀도와 균형
         * max-w-none: 부모 max-w-3xl 이 이미 폭을 제어하므로 prose 내부 max-w 해제
         */}
        <div className="prose prose-zinc prose-sm max-w-none
          prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground
          prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-xl
          prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-base
          prose-p:text-muted prose-p:leading-relaxed
          prose-strong:text-foreground prose-strong:font-semibold
          prose-a:text-foreground prose-a:underline prose-a:decoration-border hover:prose-a:decoration-muted
          prose-blockquote:border-l-border prose-blockquote:text-muted prose-blockquote:not-italic
          prose-code:font-mono prose-code:text-[13px] prose-code:text-foreground
          prose-code:bg-surface prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
          prose-pre:bg-surface prose-pre:border prose-pre:border-border prose-pre:rounded-none
          prose-pre:text-[13px]
          prose-table:text-sm
          prose-th:text-foreground prose-th:font-semibold
          prose-td:text-muted
          prose-hr:border-border
          print:prose-a:no-underline">
          <MDXRemote source={post.content} options={MDX_OPTIONS} />
        </div>
      </div>

    </article>
  );
}
