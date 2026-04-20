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
            Browser / Next.js 16 App Router
          </span>
        </div>
        {/*
         * gap-px bg-border p-px:
         * 컨테이너를 border 색으로 채우고 셀을 bg-surface 로 덮어
         * 셀 사이 1px 간격이 구분선으로 보임 — 별도 border 선언 없이 표 효과
         */}
        <div className="grid grid-cols-2 gap-px bg-border p-px">
          <ModuleBox name="App Router + RSC"    desc="서버 컴포넌트 · 라우트 그룹 (auth) · (dashboard)" />
          <ModuleBox name="Zustand Store"        desc="AccessToken · userId 메모리 단일 소스" />
          <ModuleBox name="TanStack Query"       desc="서버 상태 · Smart Polling · 독립 캐시 체인" />
          <ModuleBox name="Web Crypto API"       desc="PBKDF2 · HMAC-SHA256 · AES-GCM" />
          <ModuleBox name="IndexedDB"            desc="MasterKey · extractable=false CryptoKey" />
          <ModuleBox name="Pointer Events Grid"  desc="When2Meet 드래그 · touchAction=none" />
        </div>
      </div>

      {/* ── 네트워크 경계 ── */}
      <div className="flex items-center gap-0 py-2">
        <div className="flex-1 border-t border-dashed border-border" />
        <span className="shrink-0 px-3 font-mono text-[11px] text-muted">
          HMAC·AES-GCM 암호문만 전송 — 서버는 원본 ID·비밀번호·PII 미수신
        </span>
        <div className="flex-1 border-t border-dashed border-border" />
      </div>

      {/* ── NEXT SERVER (BFF) 레이어 ── */}
      <div className="border border-border">
        <div className="border-b border-border bg-surface px-4 py-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
            Next.js Server (BFF)
          </span>
          <span className="ml-2 font-mono text-[11px] text-muted">
            Server Actions · Route Handlers
          </span>
        </div>
        <div className="grid grid-cols-2 gap-px bg-border p-px">
          <ModuleBox name="Server Actions"  desc="login · refresh · register — httpOnly 쿠키 격리" />
          <ModuleBox name="CSP Middleware"  desc="nonce 주입 · script-src nonce 기반" />
        </div>
      </div>

      {/* ── REMOTE BACKEND 레이어 ── */}
      <div className="mt-0 border border-border">
        <div className="border-b border-border bg-surface px-4 py-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
            Remote Backend
          </span>
          <span className="ml-2 font-mono text-[11px] text-muted">
            암호문·해시값만 저장
          </span>
        </div>
        <div className="grid grid-cols-2 gap-px bg-border p-px">
          <ModuleBox name="Auth"         desc="hashedUserId · hashedPassword 검증" />
          <ModuleBox name="Group View"   desc="encGroupId · encGroupKey · encUserId[]" />
        </div>
      </div>

    </div>
  );
}
