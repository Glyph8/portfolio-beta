type Skill = {
  name: string;
  purpose: string;
};

type Category = {
  label: string;
  skills: Skill[];
};

const categories: Category[] = [
  {
    label: "Frontend",
    skills: [
      {
        name: "React",
        purpose: "컴포넌트 기반 선언형 UI 설계와 상태 관리 패턴 적용",
      },
      {
        name: "Next.js",
        purpose:
          "App Router 기반 서버 컴포넌트로 렌더링 전략(SSR·SSG·ISR) 최적화",
      },
      {
        name: "TypeScript",
        purpose: "정적 타입으로 런타임 오류를 컴파일 타임에 조기 차단",
      },
      {
        name: "Tailwind CSS",
        purpose:
          "유틸리티 클래스로 웹·인쇄 이중 레이아웃을 단일 코드베이스에서 구현",
      },
    ],
  },
  {
    label: "Backend",
    skills: [
      {
        name: "Java",
        purpose: "객체지향 설계 원칙 적용 및 Spring 생태계의 기반 언어",
      },
      {
        name: "Spring Boot",
        purpose:
          "의존성 주입 기반 레이어드 아키텍처 구성과 RESTful API 설계",
      },
      {
        name: "JPA / Hibernate",
        purpose:
          "엔티티 연관관계 설계, N+1 탐지 및 JOIN FETCH 쿼리로 해결",
      },
      {
        name: "MySQL",
        purpose:
          "정규화된 스키마 설계와 인덱스 전략으로 슬로우 쿼리 성능 개선",
      },
    ],
  },
  {
    label: "Infra · Security",
    skills: [
      {
        name: "AWS EC2",
        purpose:
          "배포 환경 프로비저닝 및 Blue-Green 전략으로 무중단 배포 구현",
      },
      {
        name: "Nginx",
        purpose:
          "리버스 프록시 구성과 배포 전환 시 트래픽 라우팅 게이트웨이",
      },
      {
        name: "Docker",
        purpose:
          "컨테이너 기반 빌드 표준화로 환경 차이에 따른 배포 오류 제거",
      },
      {
        name: "E2EE",
        purpose:
          "Web Crypto API(PBKDF2·HMAC-SHA256·AES-GCM)로 클라이언트 사이드 E2EE 파이프라인 구현",
      },
    ],
  },
];

export default function Skills() {
  return (
    <section className="mx-auto w-full max-w-3xl px-6 pb-20 print:pb-6">

      {/* ── 섹션 레이블: Hero의 'Full-stack Developer' 레이블과 동일 타이포 ── */}
      <p className="mb-10 border-t border-border pt-8 font-mono text-xs font-medium uppercase tracking-[0.25em] text-muted print:mb-4 print:pt-4">
        Skills
      </p>

      {/* ── 카테고리 목록 ── */}
      <div className="space-y-10 print:space-y-5">
        {categories.map((category) => (
          /*
           * print:break-inside-avoid
           * — 인쇄 시 이 블록이 페이지 경계에서 잘리지 않도록 보장
           * — 카테고리 단위로 적용해서 Frontend/Backend/Infra 각각이 한 페이지 안에 완결
           */
          <div key={category.label} className="print:break-inside-avoid">

            {/* 카테고리 제목: 섹션 레이블보다 약간 큰 11px, foreground 색상으로 계층 구분 */}
            <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground">
              {category.label}
            </h3>

            {/* 스킬 행 목록: divide-y로 각 행 사이에 미세한 구분선 */}
            <div className="divide-y divide-border">
              {category.skills.map((skill) => (
                <div
                  key={skill.name}
                  className="grid grid-cols-[10rem_1fr] gap-x-6 py-3"
                >
                  {/* 기술명: font-mono로 코드·기술 식별자 느낌 부여 */}
                  <span className="font-mono text-sm font-medium text-foreground">
                    {skill.name}
                  </span>

                  {/* 활용 목적: muted 색상의 서술형 한 줄 */}
                  <span className="text-sm leading-6 text-muted">
                    {skill.purpose}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
