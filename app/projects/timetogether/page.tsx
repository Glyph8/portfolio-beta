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

/**
 * 클라이언트 아키텍처 다이어그램
 *
 * 시인성 우선 원칙:
 * - 한국어 기능명 + 라이브러리/표준명(괄호)로 1·2행 분리해 첫눈에 의미 파악
 * - 브라우저(상단) → 송신 경계 → 서버(하단) 세로 흐름으로 좌→우 시선 압박 제거
 * - 핵심 모듈(암·복호화)은 강조 색상 클래스로 시선 고정점 부여
 * - 사용자 키 저장소는 cylinder([( )]) 로 데이터 보관 의미 시각화
 * - 송신 경계 라벨로 "무엇이 서버를 건너가는가" 를 한 문장으로 명시
 */
const CLIENT_ARCH_CHART = `
flowchart TB

  subgraph BR["브라우저 (Client)"]
    direction TB

    UI["화면 · 라우팅<br/><i>Next.js App Router · React 19</i>"]
    STATE["인증 · 서버 상태 캐시<br/><i>Zustand · TanStack Query</i>"]
    CRYPTO["암 · 복호화 모듈<br/><i>Web Crypto API · PBKDF2 · AES-GCM · HMAC</i>"]
    KEY[("사용자 키 저장소<br/><i>IndexedDB · 추출 불가 CryptoKey</i>")]

    UI --> STATE
    STATE --> CRYPTO
    CRYPTO <--> KEY
  end

  CRYPTO ==>|"해시값 · 암호문만 송신"| API

  subgraph SV["서버 · DB"]
    direction LR
    API["API · 인증 검증"]
    STORE[("저장소<br/><i>해시값 · 암호문만 보관</i>")]
    API --> STORE
  end

  classDef accent fill:#fff7ed,stroke:#9a3412,stroke-width:2px,color:#111827
  classDef store  fill:#f9fafb,stroke:#374151,stroke-width:1.5px,color:#111827
  classDef plain  fill:#ffffff,stroke:#111827,stroke-width:1.5px,color:#111827

  class UI,STATE,API plain
  class CRYPTO accent
  class KEY,STORE store

  linkStyle 3 stroke:#9a3412,stroke-width:2.5px
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

        <p className="mt-2 text-base font-medium text-muted">
          그룹 약속의 시간 조율 · 장소 선정 · 일정 확정을 하나로 묶은 모바일 웹 클라이언트
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-0.5">
          <span className="font-mono text-xs text-muted">2024.03 — 2025.10</span>
          <span className="select-none text-border" aria-hidden>·</span>
          <span className="font-mono text-xs text-muted">Frontend 단독 구현</span>
          <span className="select-none text-border" aria-hidden>·</span>
          <span className="font-mono text-xs text-muted">
            Next.js 16 · TypeScript · Zustand · TanStack Query · Web Crypto API
          </span>
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <p className="max-w-xl text-base leading-8 text-muted">
            여러 명이 모일 시간을 조율하고, 장소를 결정하고, 일정을 확정하는
            전체 흐름을 한 화면 안에서 매끄럽게 잇는 데 집중. 외부 암호 라이브러리
            없이{" "}
            <strong className="font-semibold text-foreground not-italic">
              브라우저 표준 Web Crypto API 만으로 종단간 암호화
            </strong>
            를 구현해, 아이디 · 비밀번호 · 이메일 · 전화번호가 평문으로 서버에
            도달하지 않는 구조를 달성.
          </p>
        </div>
      </header>

      {/* ── 시스템 아키텍처 ── */}
      <section className="mt-14 print:mt-8">
        <p className="mb-6 border-t border-border pt-8 font-mono text-xs font-medium uppercase tracking-[0.25em] text-muted">
          클라이언트 아키텍처
        </p>

        {/*
         * 웹: Mermaid 다이어그램 — 모듈 간 관계와 송신 경계를 자연스러운 흐름으로 표현
         * 인쇄/SSR fallback: TimeTogetherDiagram (HTML) — PDF 에도 동일 정보가 남음
         */}
        <MermaidDiagram
          id="timetogether-client-arch"
          chart={CLIENT_ARCH_CHART}
          fallback={<TimeTogetherDiagram />}
        />

        <p className="mt-3 text-xs leading-relaxed text-muted">
          비밀번호 · 이메일 · 전화번호 같은 민감 정보는 브라우저 안의 암·복호화 모듈을
          반드시 거쳐 해시값이나 암호문으로 변환된 뒤에만 서버로 송신됨.
        </p>
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
       * ── 인터랙티브 시각화 ──────────────────────────────────────────────
       * 클라이언트 사이드 종단간 암호화의 핵심 흐름 3가지를 단계별로 비교.
       * 시나리오 탭으로 로그인 / 그룹 생성 / 약속 생성 흐름을 전환하며 확인.
       * 웹 전용 인터랙션이므로 인쇄본에는 노출하지 않음.
       */}
      <section className="mt-14 print:hidden">
        <p className="mb-6 border-t border-border pt-8 font-mono text-xs font-medium uppercase tracking-[0.25em] text-muted">
          인터랙티브 · 종단간 암호화 단계 비교
        </p>
        <p className="mb-4 max-w-xl text-sm leading-6 text-muted">
          각 단계에서 브라우저가 보유한 값과 서버에 도달한 값을 좌우 두 열로
          나란히 비교. 상단 탭으로 로그인 · 그룹 생성 · 약속 생성 세 가지 흐름을
          전환할 수 있음.
        </p>
        <E2EEVisualizer />
      </section>

      {/* ── 프로젝트 배경 / 연구 회고 링크 ── */}
      <section className="mt-14 print:mt-8 print:break-inside-avoid">
        <p className="mb-4 border-t border-border pt-8 font-mono text-xs font-medium uppercase tracking-[0.25em] text-muted">
          더 읽을거리
        </p>
        <Link
          href="/log/timetogether"
          className="group flex items-baseline justify-between gap-6 border border-border bg-white px-5 py-4 transition-colors hover:border-foreground/30"
        >
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">
              프로젝트 배경과 추천 모델 — 학회 발표 회고
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              팀이 어떤 문제 의식에서 출발했는지, 추천 모델이 익명성을 유지한 채
              어떻게 학습되는지, 그리고 학부 연구로 진행해 한국정보처리학회
              학술발표대회에 게재되기까지의 과정을 정리.
            </p>
          </div>
          <span
            className="shrink-0 font-mono text-xs text-border transition-colors group-hover:text-muted"
            aria-hidden
          >
            →
          </span>
        </Link>
      </section>

    </article>
  );
}
