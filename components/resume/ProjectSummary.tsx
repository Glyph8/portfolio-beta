import Link from "next/link";
import { PROJECT_DATA, OTHER_PROJECT_DATA } from "@/data/projects";

export default function ProjectSummary() {
  return (
    <section
      id="projects"
      className="mx-auto w-full max-w-3xl px-6 pb-20 print:pb-6"
    >

      {/* ════════════════════════════════════════════════
          SELECTED PROJECTS
          — 대표 프로젝트: 3줄 요약 + Before/After 지표
          ════════════════════════════════════════════════ */}
      <p className="mb-10 border-t border-border pt-8 font-mono text-xs font-medium uppercase tracking-[0.25em] text-muted print:mb-4 print:pt-4">
        Selected Projects
      </p>

      <div className="space-y-14 print:space-y-7">
        {PROJECT_DATA.map((project) => (
          <div key={project.name} className="print:break-inside-avoid">

            {/* ── 헤더: 프로젝트 이름 + 상세 링크 ── */}
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                {project.name}
              </h3>
              <Link
                href={project.href}
                className="shrink-0 font-mono text-xs text-muted transition-colors hover:text-foreground"
              >
                상세 아키텍처 보기 ↗
              </Link>
            </div>

            {/* ── 메타: 기간 · 역할 · 기술 스택 ── */}
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5">
              <span className="font-mono text-xs text-muted">{project.period}</span>
              <span className="select-none text-border" aria-hidden>·</span>
              <span className="font-mono text-xs text-muted">{project.role}</span>
            </div>
            <p className="mt-1 font-mono text-xs text-muted/70">
              {project.stack.join(" · ")}
            </p>

            {/* ── 3줄 요약 ── */}
            <ul className="mt-5 space-y-2.5 border-t border-border pt-5 print:mt-3 print:pt-3">
              {project.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3 text-sm text-muted">
                  <span
                    className="mt-[0.35rem] h-1 w-1 shrink-0 rounded-full bg-border"
                    aria-hidden
                  />
                  <span className="leading-6">{bullet}</span>
                </li>
              ))}
            </ul>

            {/* ── Before / After 지표 ── */}
            <div className="mt-5 border-t border-border pt-5 print:mt-3 print:pt-3">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground">
                Result
              </p>
              <div className="space-y-2">
                {project.metrics.map((m) => (
                  <div key={m.label} className="flex items-baseline gap-3 text-sm">
                    <span className="w-28 shrink-0 text-xs text-muted">{m.label}</span>
                    <span className="font-mono text-sm text-muted">{m.before}</span>
                    <span className="select-none font-mono text-xs text-border" aria-hidden>→</span>
                    <span className="font-mono font-semibold text-foreground">{m.after}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* ════════════════════════════════════════════════
          OTHER PROJECTS
          — 콤팩트 리스트: 제목·기간·핵심 성과 2줄
            지표(Result) 영역 없음
          ════════════════════════════════════════════════ */}
      <p className="mb-6 mt-16 border-t border-border pt-8 font-mono text-xs font-medium uppercase tracking-[0.25em] text-muted print:mb-4 print:mt-8 print:pt-4">
        Other Projects
      </p>

      <div className="divide-y divide-border">
        {OTHER_PROJECT_DATA.map((project) => (
          <div key={project.name} className="py-5 print:py-3 print:break-inside-avoid">

            {/* ── 헤더 행 ── */}
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
              <h3 className="text-base font-bold tracking-tight text-foreground">
                {project.name}
              </h3>
              {project.note && (
                /*
                 * note 배지 — "중단" 같은 컨텍스트를 foreground 대비 낮은
                 * border+muted 조합으로 표현. 장식이 아니라 사실 전달 목적.
                 */
                <span className="border border-border px-1.5 py-px font-mono text-[10px] text-muted">
                  {project.note}
                </span>
              )}
              <span className="font-mono text-xs text-muted">{project.period}</span>
              <span className="select-none text-border" aria-hidden>·</span>
              <span className="font-mono text-xs text-muted">{project.role}</span>
            </div>

            {/* ── 스택 ── */}
            <p className="mt-0.5 font-mono text-xs text-muted/70">
              {project.stack.join(" · ")}
            </p>

            {/* ── 핵심 성과 2줄 ── */}
            <ul className="mt-3 space-y-1.5">
              {project.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3 text-sm text-muted">
                  <span
                    className="mt-[0.35rem] h-1 w-1 shrink-0 rounded-full bg-border"
                    aria-hidden
                  />
                  <span className="leading-6">{bullet}</span>
                </li>
              ))}
            </ul>

          </div>
        ))}
      </div>

    </section>
  );
}
