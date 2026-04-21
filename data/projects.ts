export type Metric = {
  label: string;
  before: string;
  after: string;
};

/** 대표 프로젝트 — 불릿 3줄 + Before/After 지표 필수 */
export type Project = {
  name: string;
  period: string;
  role: string;
  stack: string[];
  href: string;
  bullets: [string, string, string]; // 정확히 3줄 요약
  metrics: Metric[];
};

/** 서브 프로젝트 — 핵심 성과 2줄, 지표 없음 */
export type OtherProject = {
  name: string;
  period: string;
  role: string;
  stack: string[];
  note?: string;          // "중단", "팀 프로젝트" 등 부가 컨텍스트
  bullets: [string, string];
};

export const PROJECT_DATA: Project[] = [
  {
    name: "TimeTogether",
    period: "2024.03 — 2024.06",
    role: "Frontend · 보안 설계",
    stack: ["Next.js 16", "TypeScript", "Zustand", "TanStack Query", "Web Crypto API"],
    href: "/projects/timetogether",
    bullets: [
      "그룹 약속의 시간 조율(When2Meet)·장소 선정(Where2Meet)·일정 확정을 단일 흐름으로 묶은 모바일 웹 클라이언트 단독 구현",
      "Web Crypto API만으로 PBKDF2·HMAC-SHA256·AES-GCM 파이프라인을 구성해 ID·비밀번호·이메일·전화번호가 평문으로 서버에 도달하지 않는 클라이언트 사이드 E2EE 설계",
      "Server Actions + httpOnly 쿠키 기반 BFF로 Refresh Token 격리, TanStack Query refetchInterval을 드래그 입력 상태로 제어하는 Smart Polling으로 WebSocket 없이 실시간 UX 확보",
    ],
    metrics: [
      { label: "원본 자격증명 서버 전송", before: "상시",    after: "0 회" },
      { label: "DB 평문 PII 저장",        before: "평문",    after: "AES-GCM" },
      { label: "실시간 인프라",            before: "WebSocket", after: "폴링 0대" },
    ],
  },
  {
    name: "Monimentoom",
    period: "2023.09 — 2024.02",
    role: "Backend · Infra",
    stack: ["Spring Boot", "JPA", "MySQL", "Nginx", "AWS EC2 · S3", "Docker", "GitLab CI"],
    href: "/projects/monimentoom",
    bullets: [
      "단일 EC2 위에서 Nginx upstream을 sed로 원자 치환하고 reload하는 Blue-Green 파이프라인 설계 — 헬스체크 실패 시 자동 롤백까지 포함",
      "이미지 업로드를 S3 Presigned PUT URL로 분리해 업로드 트래픽이 WAS를 경유하지 않도록 구성; 호스트 suffix 검증으로 SSRF·타 버킷 삭제 방지",
      "JPA 지연로딩으로 발생하던 N+1을 JOIN FETCH 쿼리로 해결, 도메인 엔티티에 validateOwnership(userId) 불변식을 내재화해 IDOR 차단",
    ],
    metrics: [
      { label: "배포 다운타임",    before: "수 분",  after: "0 분" },
      { label: "댓글 목록 쿼리",   before: "N+1 회", after: "1 회" },
      { label: "이미지 업로드 경유", before: "WAS",    after: "S3 직접" },
    ],
  },
];

export const OTHER_PROJECT_DATA: OtherProject[] = [
  {
    name: "BlockGuard",
    period: "2025.03 — 2025.08",
    role: "Frontend",
    stack: ["React", "TypeScript", "Web Workers"],
    bullets: [
      "하이브리드 파일 처리 최적화 — 소용량 File API · 대용량 Web Worker 분기 처리로 UI 블로킹 제거",
      "KUIT 5기 기획·디자인·개발 다학제간 팀 프로젝트 — 최우수상 수상",
    ],
  },
  {
    name: "Charcoal",
    period: "2023.12 — 2024.05",
    role: "Frontend",
    stack: ["Next.js", "React Hook Form", "Zod", "TypeScript"],
    note: "중단",
    bullets: [
      "RHF + Zod 기반 폼 유효성 검증 및 에러 처리 아키텍처 설계",
      "Config 객체 기반 동적 폼 생성으로 UI 컴포넌트 재사용 구조 확보",
    ],
  },
];
