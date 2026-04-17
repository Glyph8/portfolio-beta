/**
 * TimeTogetherDiagram — 클라이언트·서버 2-레이어 아키텍처 다이어그램
 *
 * timetogether 상세 페이지와 /print 마스터 페이지에서 공유.
 * gap-px bg-border p-px 그리드 기법으로 1px 구분선 형성.
 */

function ModuleBox({ name, desc }: { name: string; desc: string }) {
  return (
    <div className="bg-surface px-4 py-3">
      <p className="font-mono text-xs font-semibold text-foreground">{name}</p>
      <p className="font-mono text-[11px] text-muted">{desc}</p>
    </div>
  );
}

export default function TimeTogetherDiagram() {
  return (
    <div className="space-y-0">

      {/* ── CLIENT 레이어 ── */}
      <div className="border border-border">
        <div className="border-b border-border bg-surface px-4 py-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
            Client
          </span>
          <span className="ml-2 font-mono text-[11px] text-muted">
            Browser / Next.js App Router
          </span>
        </div>
        {/*
         * gap-px bg-border p-px:
         * 컨테이너를 border 색으로 채우고 셀을 bg-surface 로 덮어
         * 셀 사이 1px 간격이 구분선으로 보임 — 별도 border 선언 없이 표 효과
         */}
        <div className="grid grid-cols-2 gap-px bg-border p-px">
          <ModuleBox name="Next.js App Router"  desc="Server Components · SSR · 페이지 라우팅" />
          <ModuleBox name="React UI Layer"      desc="컴포넌트 트리 · 선언형 렌더링" />
          <ModuleBox name="Zustand Store"       desc="암호화 키 저장소 · 채팅 상태 관리" />
          <ModuleBox name="E2EE Module"         desc="Signal Protocol · X3DH 공개키 교환" />
          <ModuleBox name="WebSocket Client"    desc="연결 생명주기 · 재연결 · 메시지 큐잉" />
          <ModuleBox name="Custom Hooks"        desc="useChatSession · useEncryption" />
        </div>
      </div>

      {/* ── 네트워크 경계 ── */}
      <div className="flex items-center gap-0 py-2">
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
          <ModuleBox name="WebSocket Broker" desc="메시지 중계 전용 · 복호화 불가" />
          <ModuleBox name="REST API"         desc="사용자 인증 · 채팅방 관리" />
        </div>
      </div>

    </div>
  );
}
