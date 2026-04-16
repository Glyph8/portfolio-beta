import type { Metadata } from "next";
import Link from "next/link";
import DecisionCard from "@/components/project/DecisionCard";

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

          <DecisionCard
            title="종단간 암호화(E2EE) 도입"
            tags={["Signal Protocol", "X3DH", "공개키 교환", "WebSocket"]}
            context="실시간 채팅 서비스에서 개인정보 보호와 메시지 보안이 최우선 과제였음. 서비스의 핵심 신뢰 기반은 '대화 내용을 운영자조차 열람할 수 없다'는 보장에 있었음."
            problem="중앙 서버가 메시지를 평문으로 저장·중계하는 구조에서는 DB 유출, 내부자 열람, 중간자 공격(MITM) 등 다양한 경로로 메시지 원문이 노출될 수 있었음."
            action="Signal Protocol의 X3DH(Extended Triple Diffie-Hellman) 공개키 교환 방식을 도입. 각 클라이언트가 키 쌍을 로컬에서 생성하고, 서버는 공개키만 등록·중계함. 세션 키는 두 클라이언트 간에서만 합의되며, 서버는 암호화된 바이트스트림만 전달하고 복호화에 필요한 정보를 보유하지 않도록 설계."
            result="서버 측 메시지 가독성 0% 달성. 데이터베이스 유출 시 원문 복구 불가능 구조 확보. 보안 신뢰도 100% — 운영자 포함 서버 접근 권한자 누구도 메시지 원문을 열람할 수 없음."
          />

          <DecisionCard
            title="암호화 상태 관리 아키텍처 설계"
            tags={["Zustand", "Custom Hook", "WebSocket", "메시지 큐잉"]}
            context="E2EE 도입으로 클라이언트가 암호화 키 관리, 세션 상태, WebSocket 연결 생명주기, 실시간 메시지 큐 등 복잡한 상태를 단독으로 처리해야 했음."
            problem="React 컴포넌트 로컬 State만으로는 키 동기화 범위가 컴포넌트 트리에 종속되어, WebSocket 재연결 시 세션 키 소실 및 메시지 유실이 발생할 수 있었음. 암호화 상태와 UI 상태의 결합도가 높아 테스트와 유지보수도 어려웠음."
            action="Zustand로 '암호화 키 저장소(keyStore)'와 '채팅 메시지 상태(chatStore)'를 독립 슬라이스로 분리. 컴포넌트 외부에서도 접근 가능한 전역 저장소로 구성하여 WebSocket 재연결 후에도 키 컨텍스트가 유지되도록 설계. WebSocket 생명주기(연결·재연결·메시지 큐잉·해제)를 전담하는 커스텀 훅 useChatSession을 작성하여 UI 컴포넌트의 관심사를 분리."
            result="메시지 전송 성공률 99.9% 달성. 복호화 지연 시간 100 ms 미만 유지. WebSocket 재연결 이벤트에서 메시지 유실 건수 0건 — 큐잉된 메시지가 재연결 후 순서 보장하여 전달됨."
          />

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
