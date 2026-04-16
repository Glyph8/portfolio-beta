import Link from "next/link";
import { PROJECT_DATA } from "@/data/projects";

export default function ProjectSummary() {
  return (
    <section
      id="projects"
      className="mx-auto w-full max-w-3xl px-6 pb-20 print:pb-10"
    >
      {/* ── 섹션 레이블: Skills·Hero와 동일한 타이포그래피 규칙 ── */}
      <p className="mb-10 border-t border-border pt-8 font-mono text-xs font-medium uppercase tracking-[0.25em] text-muted">
        Projects
      </p>

      {/* ── 프로젝트 목록 ── */}
      <div className="space-y-14">
        {PROJECT_DATA.map((project) => (
          /*
           * print:break-inside-avoid
           * — 제목·불릿·지표까지 하나의 프로젝트 블록이 페이지 경계에서 잘리지 않도록 보장
           */
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
              <span className="font-mono text-xs text-muted">
                {project.period}
              </span>
              <span className="select-none text-border" aria-hidden>·</span>
              <span className="font-mono text-xs text-muted">{project.role}</span>
            </div>
            <p className="mt-1 font-mono text-xs text-muted/70">
              {project.stack.join(" · ")}
            </p>

            {/* ── 3줄 요약: 얇은 구분선 이후 불릿 리스트 ── */}
            <ul className="mt-5 space-y-2.5 border-t border-border pt-5">
              {project.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3 text-sm text-muted">
                  {/*
                   * 불릿 마커를 독립 span으로 분리해
                   * 텍스트가 줄바꿈될 때 들여쓰기가 유지되도록 처리
                   */}
                  <span
                    className="mt-[0.35rem] h-1 w-1 shrink-0 rounded-full bg-border"
                    aria-hidden
                  />
                  <span className="leading-6">{bullet}</span>
                </li>
              ))}
            </ul>

            {/* ── Before / After 지표 ── */}
            <div className="mt-5 border-t border-border pt-5">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground">
                Result
              </p>
              <div className="space-y-2">
                {project.metrics.map((m) => (
                  <div
                    key={m.label}
                    className="flex items-baseline gap-3 text-sm"
                  >
                    {/* 지표 레이블 */}
                    <span className="w-28 shrink-0 text-xs text-muted">
                      {m.label}
                    </span>

                    {/* Before: muted 회색 — 개선 이전 수치 */}
                    <span className="font-mono text-sm text-muted">
                      {m.before}
                    </span>

                    {/* 화살표: border 색상(거의 투명)으로 전환을 암시 */}
                    <span
                      className="select-none font-mono text-xs text-border"
                      aria-hidden
                    >
                      →
                    </span>

                    {/* After: foreground + semibold — 시선이 자연스럽게 도달하는 결과값 */}
                    <span className="font-mono font-semibold text-foreground">
                      {m.after}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}
