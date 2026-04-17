import type { DecisionCardProps } from "@/components/project/DecisionCard";

export const TIMETOGETHER_DECISIONS: DecisionCardProps[] = [
  {
    title: "종단간 암호화(E2EE) 도입",
    tags: ["Signal Protocol", "X3DH", "공개키 교환", "WebSocket"],
    context:
      "실시간 채팅 서비스에서 개인정보 보호와 메시지 보안이 최우선 과제였음. 서비스의 핵심 신뢰 기반은 '대화 내용을 운영자조차 열람할 수 없다'는 보장에 있었음.",
    problem:
      "중앙 서버가 메시지를 평문으로 저장·중계하는 구조에서는 DB 유출, 내부자 열람, 중간자 공격(MITM) 등 다양한 경로로 메시지 원문이 노출될 수 있었음.",
    action:
      "Signal Protocol의 X3DH(Extended Triple Diffie-Hellman) 공개키 교환 방식을 도입. 각 클라이언트가 키 쌍을 로컬에서 생성하고, 서버는 공개키만 등록·중계함. 세션 키는 두 클라이언트 간에서만 합의되며, 서버는 암호화된 바이트스트림만 전달하고 복호화에 필요한 정보를 보유하지 않도록 설계.",
    result:
      "서버 측 메시지 가독성 0% 달성. 데이터베이스 유출 시 원문 복구 불가능 구조 확보. 보안 신뢰도 100% — 운영자 포함 서버 접근 권한자 누구도 메시지 원문을 열람할 수 없음.",
  },
  {
    title: "암호화 상태 관리 아키텍처 설계",
    tags: ["Zustand", "Custom Hook", "WebSocket", "메시지 큐잉"],
    context:
      "E2EE 도입으로 클라이언트가 암호화 키 관리, 세션 상태, WebSocket 연결 생명주기, 실시간 메시지 큐 등 복잡한 상태를 단독으로 처리해야 했음.",
    problem:
      "React 컴포넌트 로컬 State만으로는 키 동기화 범위가 컴포넌트 트리에 종속되어, WebSocket 재연결 시 세션 키 소실 및 메시지 유실이 발생할 수 있었음. 암호화 상태와 UI 상태의 결합도가 높아 테스트와 유지보수도 어려웠음.",
    action:
      "Zustand로 '암호화 키 저장소(keyStore)'와 '채팅 메시지 상태(chatStore)'를 독립 슬라이스로 분리. 컴포넌트 외부에서도 접근 가능한 전역 저장소로 구성하여 WebSocket 재연결 후에도 키 컨텍스트가 유지되도록 설계. WebSocket 생명주기(연결·재연결·메시지 큐잉·해제)를 전담하는 커스텀 훅 useChatSession을 작성하여 UI 컴포넌트의 관심사를 분리.",
    result:
      "메시지 전송 성공률 99.9% 달성. 복호화 지연 시간 100 ms 미만 유지. WebSocket 재연결 이벤트에서 메시지 유실 건수 0건 — 큐잉된 메시지가 재연결 후 순서 보장하여 전달됨.",
  },
];

export const MONIMENTOOM_DECISIONS: DecisionCardProps[] = [
  {
    title: "Blue-Green 무중단 배포 파이프라인 구축",
    tags: ["AWS EC2", "Docker", "Nginx", "GitHub Actions", "Blue-Green"],
    context:
      "서비스 업데이트 시마다 다운타임이 발생하여 사용자 경험이 저하되는 상황. 배포 빈도가 높아질수록 서비스 중단 시간도 그에 비례하여 누적되는 구조적 문제가 있었음.",
    problem:
      "기존 배포 방식은 새 버전 실행을 위해 기존 Spring Boot 프로세스를 중단해야 했음. Nginx 재시작 없이 트래픽을 전환할 방법이 없어, 매 배포마다 수 분의 서비스 단절이 불가피했음.",
    action:
      "AWS EC2 환경에서 Docker로 Blue(8080)·Green(8081) 두 컨테이너 슬롯을 운영하는 Blue-Green 아키텍처를 설계. GitHub Actions CI/CD 파이프라인을 구성하여 신규 이미지를 Green 슬롯에 먼저 기동하고, 헬스체크 통과 후 Nginx의 upstream 설정을 무중단으로 재적용해 트래픽을 전환. 구 컨테이너는 트래픽이 완전히 절환된 이후에만 중단. Fetch-on-Deploy 방식으로 환경 변수·볼륨 일관성도 보장.",
    result:
      "배포 시 서비스 다운타임 수 분 → 0 분 달성. 배포 빈도를 제한 없이 높여도 사용자 영향 없음. 헬스체크 실패 시 자동으로 구 슬롯을 유지하는 롤백 안전망 확보.",
  },
  {
    title: "JPA N+1 문제 해결 및 쿼리 최적화",
    tags: ["JPA", "Hibernate", "@EntityGraph", "Lazy Loading", "MySQL"],
    context:
      "메인 도메인의 목록 조회 API에서 트래픽 증가 시 응답 지연이 발생하는 현상이 포착됨. Hibernate 쿼리 로그를 활성화하여 분석을 시작함.",
    problem:
      "JPA의 기본 지연 로딩(Lazy Loading) 설정으로 인해, 부모 엔티티 목록 1회 조회 후 각 부모에 연관된 자식 엔티티를 개별 쿼리로 다시 조회하는 N+1 패턴이 확인됨. 목록 크기가 20건일 때 실제 DB 쿼리가 21회 발생하여 DB 커넥션 풀을 잠식하고 응답 지연을 유발함.",
    action:
      "즉시 로딩(EAGER)으로의 전환 대신 @EntityGraph를 선택. EAGER는 사용하지 않는 연관 데이터까지 항상 조회하여 전체 성능에 부정적 영향을 주는 반면, @EntityGraph는 특정 쿼리에만 Fetch Join을 적용할 수 있어 비즈니스 로직별 최적화가 가능함. 목록 조회 Repository 메서드에 @EntityGraph(attributePaths = {...})를 지정하여 연관 엔티티를 하나의 JOIN 쿼리로 한 번에 적재.",
    result:
      "목록 조회 API의 DB 쿼리 발생 횟수 21회 → 1회로 극적 감소. DB 커넥션 점유 시간 단축으로 동시 요청 처리 용량 향상. 응답 속도 대폭 개선 및 DB 부하 감소 — 트래픽 증가에 선형 비례하던 쿼리 증가 구조 근본 해결.",
  },
];
