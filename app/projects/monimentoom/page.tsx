import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import DecisionCard from "@/components/project/DecisionCard";
import { MONIMENTOOM_DECISIONS } from "@/data/projectDetails";

export const metadata: Metadata = {
  title: "Monimentoom",
  // layout.tsx template → "Monimentoom | 강동윤"
};

/* ── 페이지 ─────────────────────────────────────────────────────────────── */

export default function MonimentoomPage() {
  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-16 print:py-8 bg-gray-50 print:bg-white print:break-before-page">

      {/* ── 뒤로가기 ── */}
      <Link
        href="/"
        className="mb-10 inline-flex items-center gap-1.5 font-mono text-xs text-muted transition-colors hover:text-foreground"
      >
        ← 목록으로
      </Link>

      {/* ── 프로젝트 헤더 ── */}
      <header className="mt-4">
        <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.25em] text-muted">
          Project Detail
        </p>

        <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
          Monimentoom
        </h1>

        {/* 메타 — Backend & Infra 역할로 한정 */}
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-0.5">
          <span className="font-mono text-xs text-muted">2023.09 — 2024.02</span>
          <span className="select-none text-border" aria-hidden>·</span>
          <span className="font-mono text-xs text-muted">Backend · Infra</span>
          <span className="select-none text-border" aria-hidden>·</span>
          <span className="font-mono text-xs text-muted">
            Spring Boot · JPA · MySQL · Nginx · AWS EC2 · S3 · Docker · GitLab CI
          </span>
        </div>

        {/* 한 줄 개요 — 수치 기반, 프론트엔드 언급 없음 */}
        <div className="mt-8 border-t border-border pt-6">
          <p className="max-w-xl text-base leading-8 text-muted">
            개인 굿즈 전시 공간 서비스의 REST API·인프라를 단독 구현.{" "}
            <strong className="font-semibold text-foreground not-italic">
              단일 EC2에서의 Blue-Green 무중단 배포
            </strong>
            ,{" "}
            <strong className="font-semibold text-foreground not-italic">
              S3 Presigned URL 업로드 분리
            </strong>
            , JPA N+1 해결로 배포 다운타임{" "}
            <strong className="font-semibold text-foreground not-italic">
              수 분 → 0 분
            </strong>
            , 방명록 조회 쿼리{" "}
            <strong className="font-semibold text-foreground not-italic">
              N+1회 → 1회
            </strong>
            를 달성.
          </p>
        </div>
      </header>

      {/* ── EC2 + Nginx 인프라 아키텍처 다이어그램 ── */}
      <section className="mt-14 print:mt-8">
        <p className="mb-6 border-t border-border pt-8 font-mono text-xs font-medium uppercase tracking-[0.25em] text-muted">
          인프라 아키텍처
        </p>
        <div className="flex justify-center print:break-inside-avoid">
          <Image
            src="/images/monimentoom-infra-diagram.png"
            alt="Monimentoom 인프라 아키텍처 다이어그램 — EC2, Nginx, Blue-Green 배포, MySQL"
            width={720}
            height={480}
            className="max-w-full h-auto border border-gray-100 shadow-sm"
          />
        </div>
      </section>

      {/* ── 기술 의사결정 ── */}
      <section className="mt-14 print:mt-8">
        <p className="mb-8 border-t border-border pt-8 font-mono text-xs font-medium uppercase tracking-[0.25em] text-muted">
          기술 의사결정
        </p>

        <div className="space-y-6">
          {MONIMENTOOM_DECISIONS.map((decision) => (
            <DecisionCard key={decision.title} {...decision} />
          ))}
        </div>
      </section>

    </article>
  );
}
