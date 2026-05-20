/**
 * TimeTogetherDiagram — 브라우저 중심 클라이언트 아키텍처 다이어그램
 *
 * 첫 방문자가 한눈에 "이 프로젝트는 브라우저에서 무엇을 책임지는가" 를
 * 파악할 수 있도록, 모듈 라벨은 한국어 기능명을 앞세우고 라이브러리/표준명을
 * 작게 부기. 글자 크기는 본문(text-sm) 기준에 맞춰 가독성을 우선.
 *
 * /projects/timetogether 상세 페이지와 /print 마스터 페이지에서 공유.
 */

function ModuleBox({ name, lib }: { name: string; lib: string }) {
  return (
    <div className="bg-surface px-4 py-3">
      <p className="text-sm font-semibold text-foreground">{name}</p>
      <p className="mt-0.5 font-mono text-[11px] text-muted">{lib}</p>
    </div>
  );
}

export default function TimeTogetherDiagram() {
  return (
    <div className="space-y-0">

      {/* ── 브라우저(클라이언트) — 본 프로젝트가 책임지는 영역 ── */}
      <div className="border border-border">
        <div className="border-b border-border bg-surface px-4 py-3">
          <p className="text-sm font-semibold text-foreground">
            브라우저 (Client)
          </p>
          <p className="mt-0.5 text-xs text-muted">
            화면 · 상태 · 암·복호화를 모두 브라우저에서 수행
          </p>
        </div>

        {/*
         * gap-px bg-border p-px:
         * 컨테이너를 border 색으로 채우고 셀을 bg-surface 로 덮어
         * 셀 사이 1px 간격이 구분선으로 보임 — 별도 border 선언 없이 표 효과
         */}
        <div className="grid grid-cols-2 gap-px bg-border p-px">
          <ModuleBox name="화면 · 라우팅"          lib="Next.js 16 App Router · React 19" />
          <ModuleBox name="인증 / 세션 상태"        lib="Zustand — 액세스 토큰 메모리 보관" />
          <ModuleBox name="서버 상태 캐시 · 폴링"   lib="TanStack Query" />
          <ModuleBox name="암·복호화 모듈"          lib="Web Crypto API · PBKDF2 · AES-GCM · HMAC" />
          <ModuleBox name="키 보관소"               lib="IndexedDB · 추출 불가(CryptoKey)" />
          <ModuleBox name="시간표 입력"             lib="Pointer Events · touch-action 제어" />
        </div>
      </div>

      {/* ── 네트워크 경계 — 무엇이 서버를 건너가는가 ── */}
      <div className="flex items-center gap-0 py-3">
        <div className="flex-1 border-t border-dashed border-border" />
        <span className="shrink-0 px-3 text-xs text-muted">
          해시·암호문만 송신 (원본 비밀번호·이메일·연락처는 브라우저를 떠나지 않음)
        </span>
        <div className="flex-1 border-t border-dashed border-border" />
      </div>

      {/* ── 서버 — 간략 표기 ── */}
      <div className="border border-border">
        <div className="border-b border-border bg-surface px-4 py-3">
          <p className="text-sm font-semibold text-foreground">서버 · DB</p>
          <p className="mt-0.5 text-xs text-muted">
            해시값과 암호문만 저장 · 평문 PII 보관 없음
          </p>
        </div>
        <div className="px-4 py-3">
          <p className="text-sm leading-relaxed text-muted">
            인증 검증, 그룹·일정·장소 데이터 보관, 추천 후보 산출을 담당하나
            모든 사용자 데이터를 암호문 상태로만 보유.
          </p>
        </div>
      </div>

    </div>
  );
}
