/**
 * Experience — 경력/활동/학력/수상 섹션
 *
 * 레이아웃: 2-column 테이블 형태
 *   왼쪽(w-32 shrink-0): 기간 — font-mono text-xs text-gray-500
 *   오른쪽(flex-1):     제목·소속·설명 — 명도 대비로만 위계 표현
 *
 * 세로선·아이콘·배경색 일절 사용하지 않음.
 * 카테고리는 border-t 얇은 가로선으로만 구분.
 */

type ExperienceItem = {
  period: string;   // "YYYY.MM — YYYY.MM" 또는 "YYYY.MM"
  title: string;    // 역할 / 학위 / 수상명
  org?: string;     // 소속 기관 (선택)
  bullets?: string[]; // 세부 내역 (선택)
};

type ExperienceCategory = {
  label: string;
  items: ExperienceItem[];
};

const EXPERIENCE: ExperienceCategory[] = [
  {
    label: "Community & Leadership",
    items: [
      {
        period: "2025.09 — 2025.12",
        title: "Web 파트 튜터",
        org: "KUIT 6기",
        bullets: [
          "코드 리뷰 및 프로젝트 멘토링",
          "웹 개발 스터디 주도",
        ],
      },
      {
        period: "2025.03 — 2025.08",
        title: "Web 파트",
        org: "KUIT 5기",
        bullets: [
          "기획·디자인·개발 다학제간 팀 프로젝트 '블락가드' 진행",
          "최우수상 수상",
        ],
      },
    ],
  },
  {
    label: "Education",
    items: [
      {
        period: "2025.12 — 2026.06",
        title: "SW 스쿨 3기",
        org: "현대오토에버",
        bullets: [
          "풀스택 실무 교육",
          "'모니멘툼' 프로젝트 인큐베이팅",
        ],
      },
      {
        period: "2019.03 — 2026.08",
        title: "소프트웨어학과 졸업예정",
        org: "건국대학교",
      },
    ],
  },
  {
    label: "Awards",
    items: [
      {
        period: "2025.06",
        title: "교내 커리어 로드맵 경진대회 우수상",
      },
    ],
  },
];

export default function Experience() {
  return (
    <section className="mx-auto w-full max-w-3xl px-6 pb-20 print:pb-6">

      {/* ── 섹션 레이블 ── */}
      <p className="mb-10 border-t border-border pt-8 font-mono text-xs font-medium uppercase tracking-[0.25em] text-muted print:mb-4 print:pt-4">
        Experience
      </p>

      <div className="space-y-10 print:space-y-5">
        {EXPERIENCE.map((category) => (
          <div key={category.label} className="print:break-inside-avoid">

            {/* ── 카테고리 레이블 ── */}
            <p className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-900">
              {category.label}
            </p>

            {/* ── 항목 목록 ── */}
            <div className="divide-y divide-border">
              {category.items.map((item) => (
                /*
                 * print:break-inside-avoid
                 * — 기간·제목·불릿이 인쇄 시 페이지 경계에서 잘리지 않도록 보장
                 */
                <div
                  key={item.title}
                  className="flex gap-6 py-4 print:py-2 print:break-inside-avoid"
                >
                  {/* 왼쪽: 기간 */}
                  <p className="w-32 shrink-0 font-mono text-xs leading-5 text-gray-500">
                    {item.period}
                  </p>

                  {/* 오른쪽: 제목 + 소속 + 불릿 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span className="text-sm font-semibold text-gray-900">
                        {item.title}
                      </span>
                      {item.org && (
                        <span className="font-mono text-xs text-gray-500">
                          {item.org}
                        </span>
                      )}
                    </div>

                    {item.bullets && item.bullets.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {item.bullets.map((bullet) => (
                          <li
                            key={bullet}
                            className="flex gap-2.5 text-sm text-gray-500"
                          >
                            <span
                              className="mt-[0.4rem] h-1 w-1 shrink-0 rounded-full bg-border"
                              aria-hidden
                            />
                            <span className="leading-6">{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>

    </section>
  );
}
