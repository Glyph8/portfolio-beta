/**
 * BlockGuardFlowDiagram — Mermaid 다이어그램의 인쇄/SSR fallback.
 *
 * 사용자 여정의 3 갈래(사기 분석 / 시뮬레이션 / 뉴스)와 결과 페이지에서
 * 합류하는 보호자 알림·관련 뉴스를 한 화면에서 파악할 수 있도록 HTML 만으로 구성.
 *
 * /projects/blockguard 상세 페이지와 /print 마스터 페이지에서 공유.
 */

function NodeBox({ name, lib }: { name: string; lib?: string }) {
  return (
    <div className="bg-surface px-4 py-3">
      <p className="text-sm font-semibold text-foreground">{name}</p>
      {lib && <p className="mt-0.5 font-mono text-[11px] text-muted">{lib}</p>}
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-border">
      <div className="border-b border-border bg-surface px-4 py-2.5">
        <p className="text-sm font-semibold text-foreground">{title}</p>
      </div>
      <div className="grid grid-cols-1 gap-px bg-border p-px">
        {children}
      </div>
    </div>
  );
}

export default function BlockGuardFlowDiagram() {
  return (
    <div className="space-y-3">

      {/* ── 홈 (진입점) ── */}
      <div className="border border-border bg-surface px-4 py-3">
        <p className="text-sm font-semibold text-foreground">홈</p>
        <p className="mt-0.5 text-xs text-muted">
          뉴스 · 진입점 — 사기 분석 / 시뮬레이션 / 뉴스 세 갈래로 분기
        </p>
      </div>

      {/* ── 세 갈래 ── */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Group title="사기 분석">
          <NodeBox name="설문 시작"        lib="localStorage 초기화" />
          <NodeBox name="1~13단계 입력"    lib="useFraudSurvey · useImageSave" />
          <NodeBox name="분석 중 (Lottie)" lib="useQuery loading" />
          <NodeBox name="결과 · 위험도 표" lib="5분 캐시 · refetchOnMount: false" />
        </Group>

        <Group title="실전 시뮬레이션">
          <NodeBox name="시뮬레이션 진입"    lib="가족 사칭 · 대출 사기 등 5종" />
          <NodeBox name="메세지/전화 렌더링" lib="useDelayRender · isDone 게이트" />
          <NodeBox name="사후 설명 · 정답 풀이" lib="공용 결과 컴포넌트" />
        </Group>

        <Group title="사기 관련 뉴스">
          <NodeBox name="뉴스 목록 / 카테고리" lib="fixed 헤더 + 카테고리 바" />
          <NodeBox name="뉴스 상세"             lib="이미지 비율 유지" />
        </Group>
      </div>

      {/* ── 결과에서 합류하는 경로 ── */}
      <div className="border border-dashed border-border bg-gray-50 px-4 py-3">
        <p className="text-sm font-semibold text-foreground">
          결과 페이지에서 합류
        </p>
        <ul className="mt-2 space-y-1 text-xs leading-6 text-muted">
          <li>· 위험도 높음 → <strong className="font-semibold text-foreground">보호자 긴급 신고</strong> (Drawer + SMS 템플릿)</li>
          <li>· 사기 세부 유형 → <strong className="font-semibold text-foreground">대분류 뉴스 탭</strong>으로 자동 이동</li>
        </ul>
      </div>

    </div>
  );
}
