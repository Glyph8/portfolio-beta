import type { Metadata } from "next";
import Link from "next/link";
import DecisionCard from "@/components/project/DecisionCard";
import MermaidDiagram from "@/components/project/MermaidDiagram";
import BlockGuardFlowDiagram from "@/components/project/BlockGuardFlowDiagram";
import { BLOCKGUARD_DECISIONS } from "@/data/projectDetails";

export const metadata: Metadata = {
  title: "BlockGuard",
};

/**
 * 앱 흐름 다이어그램
 *
 * BlockGuard 는 단일 거대 페이지가 아니라 "분석 → 결과 → 시뮬레이션 → 뉴스 → 보호자" 라는
 * 노인 사용자 여정에 따라 페이지가 분기·합류하는 구조. 이 흐름을 한 화면에서 파악할 수 있도록
 * 핵심 페이지와 커스텀 훅 의존을 함께 표현.
 */
const APP_FLOW_CHART = `
flowchart TB

  HOME["홈<br/><i>뉴스 · 진입점</i>"]

  subgraph FRAUD["사기 분석 (13단계 설문)"]
    direction TB
    LANDING["설문 시작<br/><i>localStorage 초기화</i>"]
    SURVEY["1~13단계 입력<br/><i>useFraudSurvey + useImageSave</i>"]
    LOADING["분석 중<br/><i>Lottie 로딩</i>"]
    RESULT["결과 · 위험도 표<br/><i>useQuery · 5분 캐시</i>"]
    ERROR["에러 페이지"]
    LANDING --> SURVEY --> LOADING
    LOADING -->|"success"| RESULT
    LOADING -->|"error"| ERROR
  end

  subgraph SIM["사기 시뮬레이션"]
    direction TB
    SIM_INTRO["시뮬레이션 진입"]
    SIM_PLAY["메세지/전화 시간차 렌더링<br/><i>useDelayRender · isDone 게이트</i>"]
    SIM_END["사후 설명 · 정답 풀이"]
    SIM_INTRO --> SIM_PLAY --> SIM_END
  end

  subgraph NEWS["사기 관련 뉴스"]
    direction TB
    NEWS_LIST["뉴스 목록 / 카테고리"]
    NEWS_DETAIL["뉴스 상세"]
    NEWS_LIST --> NEWS_DETAIL
  end

  GUARD["보호자 긴급 신고<br/><i>Drawer · SMS 템플릿</i>"]

  HOME --> FRAUD
  HOME --> SIM
  HOME --> NEWS
  RESULT -.->|"위험 시 권유"| GUARD
  RESULT -.->|"세부 유형 → 관련 뉴스"| NEWS_LIST

  classDef accent fill:#fff7ed,stroke:#9a3412,stroke-width:2px,color:#111827
  classDef plain  fill:#ffffff,stroke:#111827,stroke-width:1.5px,color:#111827
  classDef sub    fill:#fafafa,stroke:#71717a,stroke-width:1.2px,color:#111827

  class HOME,GUARD plain
  class RESULT accent
  class LANDING,SURVEY,LOADING,ERROR,SIM_INTRO,SIM_PLAY,SIM_END,NEWS_LIST,NEWS_DETAIL sub
`;

export default function BlockGuardPage() {
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
          BlockGuard
        </h1>

        <p className="mt-2 text-base font-medium text-muted">
          노인 대상 보이스피싱 · 금융 사기 예방 모바일 웹
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-0.5">
          <span className="font-mono text-xs text-muted">2025.07 — 2025.08</span>
          <span className="select-none text-border" aria-hidden>·</span>
          <span className="font-mono text-xs text-muted">Frontend (공동 구현)</span>
          <span className="select-none text-border" aria-hidden>·</span>
          <span className="font-mono text-xs text-muted">
            React 19 · TypeScript · Vite · TanStack Query · Tailwind 4 · Lottie
          </span>
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <p className="max-w-xl text-base leading-8 text-muted">
            KUIT 5기 다학제간 팀 프로젝트로 진행해{" "}
            <strong className="font-semibold text-foreground not-italic">
              최우수상
            </strong>
            을 수상한 작품. 의심 메세지·전화번호·URL·이미지·상황을 13단계로 받아
            AI 위험도를 보여주는{" "}
            <strong className="font-semibold text-foreground not-italic">
              사기 분석
            </strong>
            과, 가족 사칭 · 대출 사기 등 실제 사기 시나리오를 재현하는{" "}
            <strong className="font-semibold text-foreground not-italic">
              실전 시뮬레이션
            </strong>
            , 사기 관련 뉴스, 보호자 긴급 신고까지 한 흐름으로 묶음. 프론트엔드는
            두 명이 공동 구현했고, 본인은 사기 분석 설문·결과 · 시뮬레이션 5종 ·
            뉴스 · 보호자 알림 · 모바일 호환성 영역을 담당.
          </p>
        </div>
      </header>

      {/* ── 앱 흐름 ── */}
      <section className="mt-14 print:mt-8">
        <p className="mb-6 border-t border-border pt-8 font-mono text-xs font-medium uppercase tracking-[0.25em] text-muted">
          앱 흐름
        </p>

        <MermaidDiagram
          id="blockguard-app-flow"
          chart={APP_FLOW_CHART}
          fallback={<BlockGuardFlowDiagram />}
        />

        <p className="mt-3 text-xs leading-relaxed text-muted">
          홈에서 분석 · 시뮬레이션 · 뉴스 세 갈래로 분기하며, 사기 분석 결과는
          위험도에 따라 보호자 알림과 사기 유형별 뉴스로 자연스럽게 합류.
        </p>
      </section>

      {/* ── 기술 의사결정 ── */}
      <section className="mt-14 print:mt-8">
        <p className="mb-8 border-t border-border pt-8 font-mono text-xs font-medium uppercase tracking-[0.25em] text-muted">
          기술 의사결정
        </p>

        <div className="space-y-6">
          {BLOCKGUARD_DECISIONS.map((decision) => (
            <DecisionCard key={decision.title} {...decision} />
          ))}
        </div>
      </section>

    </article>
  );
}
