import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/resume/Hero";
import Skills from "@/components/resume/Skills";
import ProjectSummary from "@/components/resume/ProjectSummary";
import Experience from "@/components/resume/Experience";
import DecisionCard from "@/components/project/DecisionCard";
import TimeTogetherDiagram from "@/components/project/TimeTogetherDiagram";
import PrintButton from "@/components/resume/PrintButton";
import { TIMETOGETHER_DECISIONS, MONIMENTOOM_DECISIONS } from "@/data/projectDetails";

export const metadata: Metadata = {
  title: "인쇄용 이력서 전체",
};

const PRINT_PROJECTS = [
  {
    id: "timetogether",
    title: "TimeTogether",
    period: "2024.03 — 2024.06",
    roles: "Frontend · 보안 설계",
    stack: "Next.js 16 · TypeScript · Zustand · TanStack Query · Web Crypto API",
    description: (
      <>
        그룹 약속의{" "}
        <strong className="font-semibold text-foreground not-italic">
          시간 조율 · 장소 선정 · 일정 확정
        </strong>
        을 하나의 흐름으로 묶은 모바일 우선 웹 클라이언트. 외부 암호화 라이브러리 없이{" "}
        <strong className="font-semibold text-foreground not-italic">
          브라우저 표준 Web Crypto API만으로 E2EE
        </strong>
        를 구현해, ID·비밀번호·이메일·전화번호가 평문으로 서버에 도달하지 않는 구조를 달성.
      </>
    ),
    // 다이어그램 영역도 인쇄 시 높이를 제한하고 여백을 줄이도록 클래스 수정
    diagram: (
      <div className="print:max-h-[250px] print:overflow-hidden print:flex print:justify-center">
        <TimeTogetherDiagram />
      </div>
    ),
    decisions: TIMETOGETHER_DECISIONS,
  },
  {
    id: "monimentoom",
    title: "Monimentoom",
    period: "2023.09 — 2024.02",
    roles: "Backend · Infra",
    stack: "Spring Boot · JPA · MySQL · Nginx · AWS EC2 · S3 · Docker · GitLab CI",
    description: (
      <>
        개인 굿즈 전시 공간 서비스의 REST API·인프라를 단독 구현.{" "}
        <strong className="font-semibold text-foreground not-italic">
          단일 EC2에서의 Blue-Green 무중단 배포
        </strong>
        ,{" "}
        <strong className="font-semibold text-foreground not-italic">
          S3 Presigned URL 업로드 분리
        </strong>
        , JPA N+1 해결로 배포 다운타임{" "}
        <strong className="font-semibold text-foreground not-italic">수 분 → 0 분</strong>
        , 방명록 조회 쿼리{" "}
        <strong className="font-semibold text-foreground not-italic">N+1회 → 1회</strong>를 달성.
      </>
    ),
    diagram: (
      <div className="flex justify-center">
        <Image
          src="/images/monimentoom-infra-diagram.png"
          alt="Monimentoom 인프라 아키텍처"
          width={720}
          height={480}
          /* 인쇄 시 이미지가 너무 커서 페이지를 낭비하지 않도록 높이 강제 제한 */
          className="max-w-full h-auto border border-gray-100 shadow-sm print:max-h-[220px] print:w-auto print:object-contain"
        />
      </div>
    ),
    decisions: MONIMENTOOM_DECISIONS,
  },
];

export default function PrintPage() {
  return (
    <div data-print-page className="bg-white text-foreground">
      
      <div className="print:hidden sticky top-0 z-50 flex items-center justify-between border-b border-border bg-white px-6 py-3">
        <span className="font-mono text-[11px] text-muted">
          이력서 전체 인쇄 모드
        </span>
        <div className="flex items-center gap-5">
          <Link href="/" className="font-mono text-xs text-muted transition-colors hover:text-foreground">
            ← 홈으로
          </Link>
          <PrintButton />
        </div>
      </div>

      <div className="print:pb-4">
        <Hero />
        <Skills />
        <ProjectSummary />
        <div className="mt-16 print:mt-6 print:break-inside-avoid">
          <Experience />
        </div>
      </div>

      {PRINT_PROJECTS.map((project) => (
        <section 
          key={project.id} 
          className="break-before-page mx-auto w-full max-w-3xl px-6 py-16 print:py-6"
        >
          <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.25em] text-muted print:mb-2">
            Project Detail
          </p>

          <h2 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
            {project.title}
          </h2>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-0.5 print:mt-2">
            <span className="font-mono text-xs text-muted">{project.period}</span>
            <span className="select-none text-border" aria-hidden>·</span>
            <span className="font-mono text-xs text-muted">{project.roles}</span>
            <span className="select-none text-border" aria-hidden>·</span>
            <span className="font-mono text-xs text-muted">{project.stack}</span>
          </div>

          <div className="mt-8 border-t border-border pt-6 print:mt-4 print:pt-4">
            <p className="max-w-xl text-base leading-8 text-muted print:leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* 아키텍처 다이어그램 영역 */}
          <div className="mt-14 print:mt-6">
            <p className="mb-6 border-t border-border pt-8 font-mono text-xs font-medium uppercase tracking-[0.25em] text-muted print:pt-4 print:mb-3 print:break-after-avoid">
              아키텍처
            </p>
            <div className="print:break-inside-avoid">
              {project.diagram}
            </div>
          </div>

          {/* 기술 의사결정 영역 */}
          <div className="mt-14 print:mt-6">
            <p className="mb-8 border-t border-border pt-8 font-mono text-xs font-medium uppercase tracking-[0.25em] text-muted print:pt-4 print:mb-4 print:break-after-avoid">
              기술 의사결정
            </p>
            {/* 핵심: break-inside-auto로 설정하여 카드가 자연스럽게 쪼개지며 빈 여백을 채우도록 함 */}
            <div className="space-y-6 print:space-y-4 print:break-inside-auto">
              {project.decisions.map((decision) => (
                <div key={decision.title} className="print:break-inside-auto">
                  <DecisionCard {...decision} />
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
      
    </div>
  );
}