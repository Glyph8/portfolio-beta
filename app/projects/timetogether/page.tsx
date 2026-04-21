import type { Metadata } from "next";
import Link from "next/link";
import DecisionCard from "@/components/project/DecisionCard";
import TimeTogetherDiagram from "@/components/project/TimeTogetherDiagram";
import MermaidDiagram from "@/components/project/MermaidDiagram";
import E2EEVisualizer from "@/components/project/E2EEVisualizer";
import { TIMETOGETHER_DECISIONS } from "@/data/projectDetails";

export const metadata: Metadata = {
  title: "TimeTogether",
};

const ARCHITECTURE_CHART = `
flowchart LR
  subgraph Browser["Browser (Client)"]
    UI["React 19 UI"]
    ZUS["Zustand Store<br/>AccessToken · userId"]
    RQ["TanStack Query<br/>Smart Polling"]
    WC["Web Crypto API<br/>PBKDF2 · HMAC · AES-GCM"]
    IDB[("IndexedDB<br/>MasterKey<br/>extractable=false")]
    LS[("localStorage<br/>encryptedUserId<br/>hashedUserId")]
    UI --> ZUS
    UI --> RQ
    UI --> WC
    WC --> IDB
    WC --> LS
  end

  subgraph Next["Next.js 16 Server (BFF)"]
    MW["CSP Middleware<br/>nonce 주입"]
    SA["Server Actions<br/>login · refresh"]
    CK[("httpOnly Cookie<br/>access_token<br/>refresh_token")]
    SA --> CK
  end

  subgraph Remote["Remote Backend"]
    AUTH["Auth<br/>hashedUserId 검증"]
    DB[("DB<br/>암호문 · 해시값")]
    AUTH --> DB
  end

  UI -- "Bearer AT" --> AUTH
  SA -- "RT (서버-서버)" --> AUTH
  RQ -- "5s polling" --> AUTH
`;

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
        <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.25em] text-muted">
          Project Detail
        </p>

        <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
          TimeTogether
        </h1>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-0.5">
          <span className="font-mono text-xs text-muted">2024.03 — 2024.06</span>
          <span className="select-none text-border" aria-hidden>·</span>
          <span className="font-mono text-xs text-muted">Frontend · 보안 설계</span>
          <span className="select-none text-border" aria-hidden>·</span>
          <span className="font-mono text-xs text-muted">
            Next.js 16 · TypeScript · Zustand · TanStack Query · Web Crypto API
          </span>
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <p className="max-w-xl text-base leading-8 text-muted">
            그룹 약속의{" "}
            <strong className="font-semibold text-foreground not-italic">
              시간 조율 · 장소 선정 · 일정 확정
            </strong>
            을 하나의 흐름으로 묶은 모바일 우선 웹 클라이언트. 외부 암호화 라이브러리 없이{" "}
            <strong className="font-semibold text-foreground not-italic">
              브라우저 표준 Web Crypto API만으로 E2EE
            </strong>
            를 구현해, ID·비밀번호·이메일·전화번호가 평문으로 서버에 도달하지 않는 구조를 달성.
          </p>
        </div>
      </header>

      {/* ── 시스템 아키텍처 (Mermaid) ── */}
      <section className="mt-14 print:mt-8">
        <p className="mb-6 border-t border-border pt-8 font-mono text-xs font-medium uppercase tracking-[0.25em] text-muted">
          시스템 아키텍처
        </p>
        <MermaidDiagram
          id="timetogether-arch"
          chart={ARCHITECTURE_CHART}
          fallback={<TimeTogetherDiagram />}
        />
      </section>

      {/* ── 클라이언트 레이어 구성 (HTML 기반 · 인쇄에도 안정적) ── */}
      <section className="mt-14 print:mt-8">
        <p className="mb-6 border-t border-border pt-8 font-mono text-xs font-medium uppercase tracking-[0.25em] text-muted">
          레이어 구성
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
       * CLAUDE.md '선택적 인터랙션' 원칙에 따라, E2EE 키 파생 흐름처럼
       * 설명이 복잡한 의사결정에 한해 허용된 인터랙티브 시각화.
       * 웹 전용이므로 print:hidden — 인쇄본에 빈 박스가 노출되지 않음.
       */}
      <section className="mt-14 print:hidden">
        <p className="mb-6 border-t border-border pt-8 font-mono text-xs font-medium uppercase tracking-[0.25em] text-muted">
          인터랙티브 · MasterKey 파생 흐름
        </p>
        <p className="mb-4 max-w-xl text-sm leading-6 text-muted">
          사용자의 원본 비밀번호가 서버에 도달하지 않음을 6단계로 증명.
          각 단계에서 브라우저가 보유한 값과 서버가 보유한 값이 어떻게 달라지는지를
          나란히 비교할 수 있도록 구성.
        </p>
        <E2EEVisualizer />
      </section>

    </article>
  );
}
