export type Metric = {
  label: string;
  before: string;
  after: string;
};

export type Project = {
  name: string;
  period: string;
  role: string;
  stack: string[];
  href: string;
  bullets: [string, string, string]; // 정확히 3줄 요약
  metrics: Metric[];
};

export const PROJECT_DATA: Project[] = [
  {
    name: "TimeTogether",
    period: "2024.03 — 2024.06",
    role: "Frontend · 보안 설계",
    stack: ["Next.js", "TypeScript", "Zustand", "WebSocket", "E2EE"],
    href: "/projects/timetogether",
    bullets: [
      "Next.js App Router 기반 클라이언트 단독 구현; 서버 컴포넌트·SSR 전환으로 초기 로드 최적화",
      "Signal Protocol 공개키 교환 방식의 E2EE 채팅 직접 설계 — 서버는 암호화된 메시지만 보관",
      "Zustand 기반 전역 채팅 상태 관리와 WebSocket 생명주기(재연결·메시지 큐잉) 처리",
    ],
    metrics: [
      { label: "E2EE 커버리지", before: "0 %", after: "100 %" },
      { label: "페이지 LCP", before: "3.2 s", after: "1.4 s" },
    ],
  },
  {
    name: "Monimentoom",
    period: "2023.09 — 2024.02",
    role: "Backend · Infra",
    stack: ["Spring Boot", "JPA", "MySQL", "Nginx", "AWS EC2", "Docker"],
    href: "/projects/monimentoom",
    bullets: [
      "Blue-Green 무중단 배포 파이프라인 구축; Nginx 트래픽 전환으로 배포 중 다운타임 완전 제거",
      "RDBMS 기반 Refresh Token 관리 도입; 만료·재발급·블랙리스트 처리로 세션 보안 강화",
      "JPA N+1 문제를 @EntityGraph로 해결; 목록 조회 API 쿼리 21회 → 1회로 감소",
    ],
    metrics: [
      { label: "배포 다운타임", before: "수 분", after: "0 분" },
      { label: "목록 API 쿼리", before: "21 회", after: "1 회" },
    ],
  },
];
