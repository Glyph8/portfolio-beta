/**
 * DecisionCard — 기술 의사결정 경험 표준 컴포넌트
 *
 * CLAUDE.md 명세:
 *   Context → Problem → Action → Result 순서 고정
 *   Result 는 반드시 정량 지표 포함
 *   카드 전체에 print:break-inside-avoid 적용
 */

export interface DecisionCardProps {
  title: string;
  context: string;  // 상황: 어떤 비즈니스적/기술적 한계가 있었는가?
  problem: string;  // 문제: 그로 인해 발생한 구체적 문제
  action: string;   // 해결책: 어떤 기술을 왜 선택했는가?
  result: string;   // 결과: 정량 지표
  tags?: string[];  // 관련 기술 태그 (선택)
}

type Section = {
  label: string;
  content: string;
  isResult?: boolean;
};

export default function DecisionCard({
  title,
  context,
  problem,
  action,
  result,
  tags,
}: DecisionCardProps) {
  const sections: Section[] = [
    { label: "Context", content: context },
    { label: "Problem", content: problem },
    { label: "Action",  content: action  },
    { label: "Result",  content: result, isResult: true },
  ];

  return (
    /*
     * print:break-inside-avoid
     * — 카드 전체가 페이지 경계에서 잘리지 않도록 보장
     */
    <article className="border border-border bg-surface print:break-inside-avoid">

      {/* ── 카드 헤더: 제목 + 태그 ── */}
      <div className="border-b border-border px-5 py-4">
        <h3 className="text-base font-bold tracking-tight text-foreground">
          {title}
        </h3>

        {tags && tags.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="border border-border px-2 py-0.5 font-mono text-[11px] text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── CPAR 섹션: divide-y 로 각 행 사이 1px 구분선 ── */}
      <div className="divide-y divide-border">
        {sections.map(({ label, content, isResult }) => (
          <div key={label} className="px-5 py-4">

            {/*
             * 레이블 계층:
             *   Context / Problem / Action → text-muted  (배경 정보)
             *   Result                     → text-foreground (결과값 강조)
             */}
            <p
              className={[
                "mb-1.5 text-[11px] font-semibold uppercase tracking-[0.18em]",
                isResult ? "text-foreground" : "text-muted",
              ].join(" ")}
            >
              {label}
            </p>

            {/*
             * 내용 계층:
             *   Context / Problem / Action → text-muted   (경위·배경)
             *   Result                     → text-foreground font-semibold (달성 수치)
             */}
            <p
              className={[
                "text-sm leading-6",
                isResult
                  ? "font-semibold text-foreground"
                  : "text-muted",
              ].join(" ")}
            >
              {content}
            </p>
          </div>
        ))}
      </div>

    </article>
  );
}
