import type { Metadata } from "next";
import Link from "next/link";
import DecisionCard from "@/components/project/DecisionCard";
import { TIMETOGETHER_DECISIONS } from "@/data/projectDetails";

export const metadata: Metadata = {
  title: "TimeTogether",
  // layout.tsx 의 template 으로 "TimeTogether | 강동윤" 으로 렌더링
};

/* ── 아키텍처 다이어그램: 텍스트/CSS 박스 ────────────────────────────────── */

/**
 * 레이어 내부 모듈 박스 하나.
 * `gap-px bg-border p-px` 그리드 기법으로 인접 셀 사이에 1px 경계선을 형성.
 */
function ModuleBox({
  name,
  desc,
}: {
  name: string;
  desc: string;
}) {
  return (
    <div className="bg-surface px-4 py-3">
      <p className="font-mono text-xs font-semibold text-foreground">{name}</p>
      <p className="font-mono text-[11px] text-muted">{desc}</p>
    </div>
  );
}

function ArchitectureDiagram() {
  return (
    <div className="space-y-0">

      {/* ── CLIENT 레이어 ── */}
      <div className="border border-border">
        {/* 레이어 헤더 */}
        <div className="border-b border-border bg-surface px-4 py-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
            Client
          </span>
          <span className="ml-2 font-mono text-[11px] text-muted">
            Browser / Next.js App Router
          </span>
        </div>

        {/*
         * gap-px bg-border p-px 기법:
         * 그리드 컨테이너를 border 색으로 채우고, 각 셀을 bg-surface 로 덮으면
         * 셀 사이 1px 간격이 구분선으로 보임 — 별도 border 없이 표 효과
         */}
        <div className="grid grid-cols-2 gap-px bg-border p-px">
          <ModuleBox
            name="Next.js App Router"
            desc="Server Components · SSR · 페이지 라우팅"
          />
          <ModuleBox
            name="React UI Layer"
            desc="컴포넌트 트리 · 선언형 렌더링"
          />
          <ModuleBox
            name="Zustand Store"
            desc="암호화 키 저장소 · 채팅 상태 관리"
          />
          <ModuleBox
            name="E2EE Module"
            desc="Signal Protocol · X3DH 공개키 교환"
          />
          <ModuleBox
            name="WebSocket Client"
            desc="연결 생명주기 · 재연결 · 메시지 큐잉"
          />
          <ModuleBox
            name="Custom Hooks"
            desc="useChatSession · useEncryption"
          />
        </div>
      </div>

      {/* ── 네트워크 경계 표시 ── */}
      <div className="flex items-center gap-0 py-2">
        {/*
         * dashed border: 논리적 경계(암호화 레이어)를 표현.
         * 아키텍처 다이어그램 관례상 점선 = 네트워크/논리 경계.
         */}
        <div className="flex-1 border-t border-dashed border-border" />
        <span className="shrink-0 px-3 font-mono text-[11px] text-muted">
          암호화된 메시지만 전송 — 서버 측 평문 접근 불가
        </span>
        <div className="flex-1 border-t border-dashed border-border" />
      </div>

      {/* ── SERVER 레이어 ── */}
      <div className="border border-border">
        <div className="border-b border-border bg-surface px-4 py-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
            Server
          </span>
          <span className="ml-2 font-mono text-[11px] text-muted">
            Spring Boot
          </span>
        </div>
        <div className="grid grid-cols-2 gap-px bg-border p-px">
          <ModuleBox
            name="WebSocket Broker"
            desc="메시지 중계 전용 · 복호화 불가"
          />
          <ModuleBox
            name="REST API"
            desc="사용자 인증 · 채팅방 관리"
          />
        </div>
      </div>

    </div>
  );
}

/* ── 페이지 ─────────────────────────────────────────────────────────────── */

export default function TimeTogetherPage() {
  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-16 print:py-8 bg-gray-50 print:bg-white">

      {/* ── 뒤로가기 — 인쇄 시 숨김 ── */}
      <Link
        href="/"
        className="print:hidden mb-10 inline-flex items-center gap-1.5 font-mono text-xs text-muted transition-colors hover:text-foreground"
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
        <ArchitectureDiagram />
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
