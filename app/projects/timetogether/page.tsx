import type { Metadata } from "next";
import Link from "next/link";
import DecisionCard from "@/components/project/DecisionCard";
import TimeTogetherDiagram from "@/components/project/TimeTogetherDiagram";
import { TIMETOGETHER_DECISIONS } from "@/data/projectDetails";

export const metadata: Metadata = {
  title: "TimeTogether",
  // layout.tsx 의 template 으로 "TimeTogether | 강동윤" 으로 렌더링
};

/* ── 페이지 ─────────────────────────────────────────────────────────────── */

export default function TimeTogetherPage() {
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
        {/* 섹션 레이블: 사이트 전체 공통 타이포그래피 */}
        <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.25em] text-muted">
          Project Detail
        </p>

        <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
          TimeTogether
        </h1>

        {/* 메타 정보 */}
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-0.5">
          <span className="font-mono text-xs text-muted">2024.03 — 2024.06</span>
          <span className="select-none text-border" aria-hidden>·</span>
          <span className="font-mono text-xs text-muted">Frontend · 보안 설계</span>
          <span className="select-none text-border" aria-hidden>·</span>
          <span className="font-mono text-xs text-muted">
            Next.js · TypeScript · Zustand · WebSocket · E2EE
          </span>
        </div>

        {/* 한 줄 개요 */}
        <div className="mt-8 border-t border-border pt-6">
          <p className="max-w-xl text-base leading-8 text-muted">
            실시간 그룹 채팅 서비스의{" "}
            <strong className="font-semibold text-foreground not-italic">
              클라이언트 아키텍처 단독 설계 및 구현
            </strong>
            — Signal Protocol 기반{" "}
            <strong className="font-semibold text-foreground not-italic">
              종단간 암호화(E2EE)
            </strong>
            를 적용하여 서버가 메시지 원문에 접근할 수 없는 보안 구조를 달성.
          </p>
        </div>
      </header>

      {/* ── 클라이언트 아키텍처 다이어그램 ── */}
      <section className="mt-14 print:mt-8">
        <p className="mb-6 border-t border-border pt-8 font-mono text-xs font-medium uppercase tracking-[0.25em] text-muted">
          클라이언트 아키텍처
        </p>
        <TimeTogetherDiagram />
      </section>

      {/* ── 기술 의사결정 ── */}
      <section className="mt-14 print:mt-8">
        <p className="mb-8 border-t border-border pt-8 font-mono text-xs font-medium uppercase tracking-[0.25em] text-muted">
          기술 의사결정
        </p>

        <div className="space-y-6">
          {TIMETOGETHER_DECISIONS.map((decision) => (
            <DecisionCard key={decision.title} {...decision} />
          ))}
        </div>
      </section>

      {/*
       * ── E2EE 인터랙티브 다이어그램 ──────────────────────────────────────
       * CLAUDE.md '선택적 인터랙션': E2EE 키 교환처럼 설명이 복잡한 기술적
       * 의사결정에 한해 인터랙티브 시각화를 허용.
       * 현재는 <E2EEVisualizer /> 컴포넌트가 들어갈 자리(Placeholder)만 확보.
       * 웹 전용 위젯이므로 print:hidden 처리 — 인쇄본에 빈 박스가 노출되지 않음.
       */}
      <section className="mt-14 print:hidden">
        <p className="mb-6 border-t border-border pt-8 font-mono text-xs font-medium uppercase tracking-[0.25em] text-muted">
          인터랙티브 다이어그램
        </p>

        {/* TODO: <E2EEVisualizer /> 로 교체 예정 */}
        <div className="border border-dashed border-border bg-white px-6 py-12 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
            Coming Soon
          </p>
          <p className="mt-2 text-sm font-semibold text-foreground">
            E2EE 키 교환 흐름
          </p>
          <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-muted">
            서버가 메시지를 읽을 수 없음을 증명하는 인터랙티브 다이어그램 —
            X3DH 공개키 교환 과정을 Alice · Server · Bob 3자 관점에서 단계별로 시각화
          </p>
        </div>
      </section>

    </article>
  );
}
