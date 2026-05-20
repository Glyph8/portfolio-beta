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
    period: "2024.03 — 2025.10",
    role: "Frontend 단독 구현",
    stack: ["Next.js 16", "TypeScript", "Zustand", "TanStack Query", "Web Crypto API"],
    href: "/projects/timetogether",
    bullets: [
      "그룹 약속의 시간 조율 · 장소 선정 · 일정 확정을 한 흐름으로 묶은 모바일 웹 클라이언트를 단독 구현",
      "외부 암호 라이브러리 없이 Web Crypto API(PBKDF2 · HMAC-SHA256 · AES-GCM)만으로 클라이언트 사이드 종단간 암호화 파이프라인을 구성, 아이디 · 비밀번호 · 이메일 · 전화번호가 평문으로 서버에 도달하지 않는 구조 확보",
      "TanStack Query 의 refetchInterval 을 드래그 입력 상태로 제어하는 Smart Polling 으로 WebSocket 없이 다중 사용자 시간표 실시간 조율을 구현",
    ],
    metrics: [
      { label: "원본 자격증명·개인정보 서버 전송", before: "상시",      after: "0 회" },
      { label: "DB 평문 PII 저장",                  before: "평문",      after: "AES-GCM 암호문" },
      { label: "실시간 조율 인프라",                before: "WebSocket", after: "스마트 폴링" },
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
  {
    name: "BlockGuard",
    period: "2025.07 — 2025.08",
    role: "Frontend (공동 구현)",
    stack: ["React 19", "TypeScript", "Vite", "TanStack Query", "Tailwind 4", "Lottie"],
    href: "/projects/blockguard",
    bullets: [
      "노인 대상 보이스피싱·금융 사기 예방 모바일 웹 — 13단계 사기 분석 설문부터 결과 위험도 표시·실전 시뮬레이션·뉴스·보호자 긴급 신고까지 한 흐름으로 구현 (KUIT 5기 다학제간 팀 프로젝트, 최우수상)",
      "useFraudSurvey · useImageSave · useDelayRender 등 다단계 입력·이미지 첨부·시간차 메세지 렌더링을 커스텀 훅으로 분리하고, React Query 결과 캐싱(staleTime 5분 · refetchOnMount: false) 으로 결과 페이지 재방문 시 재요청 차단",
      "iOS 모바일 호환성에 집중 — 100dvh 레이아웃, overscroll-none 으로 스크롤 고무줄 효과 제거, 스크롤 위치에 따른 헤더 색상 전환으로 안전 영역과 콘텐츠 가독성 동시 확보",
    ],
    metrics: [
      { label: "사기 분석 결과 재요청", before: "재방문마다",  after: "5분 캐시" },
      { label: "이미지 미리보기 URL",   before: "메모리 누수", after: "수동 revoke" },
      { label: "시뮬레이션 메세지",     before: "즉시 노출",   after: "1.5~3초 stagger" },
    ],
  },
];

export const OTHER_PROJECT_DATA: OtherProject[] = [
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
