import type { DecisionCardProps } from "@/components/project/DecisionCard";

export const TIMETOGETHER_DECISIONS: DecisionCardProps[] = [
  {
    title: "Web Crypto API 단독 기반 클라이언트 사이드 E2EE 설계",
    tags: ["Web Crypto API", "PBKDF2", "HMAC-SHA256", "AES-GCM", "IndexedDB"],
    context:
      "그룹 약속 조율 서비스 특성상 이메일·전화번호·ID 등 연락 가능한 PII가 수집됨. 서버 DB가 유출되어도 원문이 복원되지 않아야 하고, 외부 암호화 라이브러리에 대한 공급망 위험도 배제하고자 함.",
    problem:
      "일반적인 서버 측 해시 저장 방식은 로그·메모리 덤프·내부자 열람 등 다양한 경로에서 평문이 노출될 수 있음. 동시에 third-party 암호화 패키지는 의존성 체인을 통한 공급망 공격 벡터가 됨.",
    action:
      "브라우저 표준 Web Crypto API(`crypto.subtle`)만으로 파이프라인을 구성. userId를 salt로 PBKDF2-SHA256(100k iter)으로 MasterKey를 파생시키고, HMAC-SHA256으로 서버 인증용 hashedUserId를, PBKDF2(200k iter, salt=MasterKey)로 hashedPassword를 생성해 도메인을 분리. MasterKey는 IndexedDB에 `extractable: false`로 저장하여 XSS가 성공해도 raw 바이트 추출이 브라우저 레벨에서 차단되도록 설계. PII는 12바이트 랜덤 IV를 매회 생성하는 AES-GCM으로 암호화.",
    result:
      "원본 비밀번호·이메일·전화번호의 서버 전송 0회 달성. 서버 DB가 유출되어도 개별 사용자의 MasterKey 없이는 PII 복원 불가능. 외부 암호화 라이브러리 의존성 0개로 공급망 공격 표면 제거.",
  },
  {
    title: "BFF 패턴 Silent Refresh — 토큰 단일 소스화",
    tags: ["Next.js Server Actions", "httpOnly Cookie", "Zustand", "BFF"],
    context:
      "새로고침 시에도 로그인이 유지되어야 하는 한편, JWT가 localStorage에 저장되면 XSS 한 방에 세션 전체가 탈취 가능. 반대로 메모리에만 두면 새로고침마다 재로그인이 필요한 UX 딜레마.",
    problem:
      "Access Token을 localStorage에 두는 관행은 XSS 공격 표면을 넓히고, Refresh Token을 JS에서 직접 다루면 RT 자체가 탈취 경로가 됨. 그러나 RT를 완전히 서버 전용으로 숨기면 SPA 클라이언트가 이를 사용할 수 없음.",
    action:
      "Access Token은 Zustand 메모리에 단일 소스로 유지하고, Refresh Token은 httpOnly + SameSite=lax 쿠키로 JS 접근을 원천 차단. 새로고침 시 `useAuthSession` 훅이 IndexedDB의 MasterKey로 localStorage의 암호화된 userId를 복호화한 뒤, Server Action `refreshAccessToken()`을 호출해 서버-서버 경로로만 RT를 사용. 복원 완료 전까지 `Providers`가 로딩 UI를 대체 렌더해 race condition 차단.",
    result:
      "클라이언트 JS 번들 어디에도 Refresh Token이 하드코딩되지 않는 구조 확보. `document.cookie`·`localStorage` 어느 경로로도 토큰 탈취 불가. 새로고침·탭 복귀 시 사용자 개입 0회로 세션 유지.",
  },
  {
    title: "Smart Polling — 입력 상태로 refetchInterval을 제어하는 실시간 UX",
    tags: ["TanStack Query", "Pointer Events", "UX", "React 19"],
    context:
      "When2Meet 그리드에서 여러 사용자가 동시에 가능 시간을 드래그하는 상황을 반영해야 함. 하지만 WebSocket 서버를 별도 운영하기엔 인프라 비용 부담이 있었음.",
    problem:
      "단순 5초 폴링은 내가 드래그하는 도중에 서버 응답이 도착하면 내 입력을 덮어써 UX가 깨짐. 반대로 `refetchOnWindowFocus`만으로는 다른 사용자의 변경을 제때 반영하지 못함.",
    action:
      "`refetchInterval`을 `isInputMode` 상태에 대한 함수로 두어, 드래그 시작(`onPointerDown`) 시 폴링 OFF → 드래그 종료(`onPointerUp`) 시 폴링 ON으로 전환. `placeholderData: prev => prev`로 리페치 중 깜빡임 제거, `refetchIntervalInBackground: false`로 비활성 탭 리소스 낭비 차단. Pointer Events 단일 API로 mouse·touch·pen을 통합해 `touchAction: none`과 함께 iOS Safari 스크롤 충돌도 함께 해결.",
    result:
      "WebSocket 인프라 비용 0원으로 다중 사용자 실시간 조율 UX 달성. 드래그 중 내 입력이 서버 데이터로 덮어써지는 충돌 0건. 백그라운드 탭의 불필요한 네트워크 요청 0회.",
  },
  {
    title: "3단계 E2EE 그룹 조회 체인",
    tags: ["React Query", "암호학적 접근 제어", "Fetch Join"],
    context:
      "그룹 목록·그룹 키·멤버 ID가 한 번에 서버에 노출되면, 서버 관리자가 조인 그래프를 역추적해 사교 관계를 프로파일링할 수 있음.",
    problem:
      "전통적인 단일 API 응답 구조로는 서버가 `{ groupId, members[] }`를 평문으로 알고 있어야 하며, 이는 프라이버시 보장 범위를 심각하게 축소시킴.",
    action:
      "조회를 세 단계로 분할: view1에서 `encGroupId` 목록만 받아 클라이언트가 MasterKey로 복호화해 타깃 groupId를 찾고, view2에서 해당 그룹의 `encGroupKey`를 받아 AES-CryptoKey로 import, view3에서 그 groupKey로 멤버 `encUserId[]`를 병렬 복호화. 각 단계를 React Query의 독립 캐시로 운영하고 복호화 실패는 `retry: false`로 네트워크 재시도와 분리.",
    result:
      "서버 로그·DB 어느 지점에서도 그룹-멤버 관계 그래프를 평문으로 재구성 불가. 복호화 실패 시 무의미한 백엔드 호출 반복 차단으로 비용 낭비 제거.",
  },
];

export const MONIMENTOOM_DECISIONS: DecisionCardProps[] = [
  {
    title: "단일 EC2에서의 Blue-Green 무중단 배포",
    tags: ["AWS EC2", "Docker Compose", "Nginx", "GitLab CI", "Self-hosted Runner"],
    context:
      "k8s·ALB를 도입하기엔 프로젝트 규모·비용이 과도했지만, 배포 빈도가 늘어날수록 단순 `compose up` 방식의 커넥션 drop이 누적되어 사용자 경험을 해치고 있었음.",
    problem:
      "기존 배포는 기존 컨테이너를 중단한 뒤 새 컨테이너를 기동하는 순서라, 애플리케이션 워밍업 시간 동안 수 분간 502가 발생. 롤백 전략도 수동이라 실패 감지 시점이 늦음.",
    action:
      "Blue(8080)·Green(8081) 두 컨테이너 슬롯을 동시에 운영하고, `deploy.sh`가 (1) 현재 활성 슬롯을 감지 → (2) 반대 슬롯에 신규 이미지 기동 → (3) `/actuator/health`를 3초 간격 최대 20회 폴링 → (4) 통과 시 `sed`로 `nginx.conf`의 upstream 라인을 원자 치환한 뒤 `nginx -s reload`로 커넥션 drop 없이 전환 → (5) 구 컨테이너 stop 및 `docker image prune`. 헬스체크 실패 시 신규 슬롯을 즉시 stop하고 `exit 1`로 파이프라인 실패 처리. GitLab Shared Runner(빌드)와 EC2 Self-hosted Runner(배포)를 분리해 배포 비밀값을 CI 외부로 반출 없이 유지.",
    result:
      "배포 다운타임 수 분 → 0 분. 헬스체크 실패 기반 자동 롤백으로 장애 전파 차단. git push 후 평균 약 1분 내 트래픽 스위칭 완료.",
  },
  {
    title: "S3 Presigned URL로 이미지 업로드 트래픽 분리",
    tags: ["AWS S3", "Presigned URL", "SSRF 방어", "SDK v2"],
    context:
      "사용자가 굿즈·프레임·프로필 이미지를 업로드하는 서비스 특성상, 단일 EC2가 이미지 본문을 경유하면 메모리·네트워크가 쉽게 포화됨.",
    problem:
      "멀티파트 업로드를 WAS가 직접 받으면 대용량 이미지마다 힙 점유 증가, 업로드 중 다른 API 응답 지연, 그리고 파일명 조작을 통한 임의 경로 쓰기 위험이 공존.",
    action:
      "서버는 `S3Presigner`로 5분 유효 PUT URL만 서명해 반환하고, 업로드 본문은 클라이언트 ↔ S3 직접 경로로 분리. key는 `{category}/{UUID}_{원본명}` 형식으로 서버가 생성해 경로 조작 차단. Content-Type을 서명에 포함해 변조 방지, 확장자 화이트리스트로 비이미지 업로드 거부. 삭제 요청 시 `URI.getHost()`가 `.amazonaws.com`으로 끝나는지 검증해 SSRF·타 버킷 삭제 가능성 제거. 테스트 환경에서는 `@PostConstruct`에서 AWS 자격증명 부재를 감지해 graceful degrade(`s3Client = null`, 503 반환) 처리로 CI 안정화.",
    result:
      "이미지 업로드 트래픽이 WAS를 경유하지 않아 EC2 자원 사용량 구조적 완화. 악성 키 주입·SSRF 경로 사전 차단. AWS 자격증명이 없는 CI에서도 컨텍스트 로딩 실패 없이 전체 테스트 통과.",
  },
  {
    title: "JPA N+1 해결 — JOIN FETCH 기반 단일 쿼리 조회",
    tags: ["JPA", "Hibernate", "JOIN FETCH", "@Query"],
    context:
      "방 상세 페이지가 방명록·굿즈·배치(Position)를 모두 보여주는 구조라, 진입 시 연관 엔티티 다수를 동시에 조회해야 했음. 트래픽 증가에 따라 응답 지연이 포착됨.",
    problem:
      "기본 지연 로딩 설정으로 방 하나 조회 시 각 댓글마다 작성자 User를 추가 조회하는 N+1이 발생. 방명록 20건 조회 시 DB 쿼리가 21회 발행되어 커넥션 풀을 빠르게 잠식.",
    action:
      "EAGER로의 전역 전환은 불필요한 연관 데이터까지 끌어와 전체 성능을 악화시키므로 배제. 대신 조회 경로별로 `@Query(\"SELECT c FROM Comment c JOIN FETCH c.user WHERE c.room.id = :roomId\")` 형태의 명시적 Fetch Join을 사용해 컨텍스트별로 최적화. 굿즈 목록은 `LEFT JOIN FETCH g.positions` + `DISTINCT`로 배치 이력까지 1회에 적재. `positions.room_id`·`positions.goods_id`에 명시적 인덱스를 추가해 조인 선택도도 개선.",
    result:
      "방명록 조회 쿼리 N+1회 → 1회. 커넥션 점유 시간 단축으로 동시 요청 처리 용량 증가. EAGER 전환 대비 불필요한 필드 적재 없이 컨텍스트별 최적 쿼리 유지.",
  },
  {
    title: "도메인 엔티티 내재화된 IDOR 방어",
    tags: ["DDD", "불변식", "Spring Security", "IDOR"],
    context:
      "Room·Goods·Comment·Position 등 소유 관계가 있는 리소스가 다수. 서비스 레이어에서만 userId 일치 검사를 하면 신규 메서드 추가 시 체크를 빠뜨리는 순간 IDOR 취약점이 생김.",
    problem:
      "`if (!room.getUser().getId().equals(userId)) throw ...` 패턴이 서비스 여러 곳에 흩어져 있어 리뷰로는 누락을 잡기 어려움. 실제 수정·삭제 API마다 반복 작성되며 일관성이 깨짐.",
    action:
      "소유권 검증을 엔티티 메서드 `validateOwnership(Long userId)`로 내재화하고, 서비스는 조회 직후 해당 메서드를 무조건 호출하도록 컨벤션화. Spring Security 컨텍스트에는 User 엔티티 대신 `Long userId`만 principal로 보관해 Lazy 프록시 생명주기 문제와 매 요청 DB 재조회를 동시에 제거. 필터 체인 내부에서 발생한 `CustomException`은 `JwtExceptionFilter`가 `ErrorCode` 기반 통일 JSON으로 변환해 `@RestControllerAdvice`로 가지 못하는 예외까지 프런트 일관 처리 가능.",
    result:
      "소유권 체크 누락으로 인한 IDOR 가능성 구조적으로 차단. 매 요청당 User 조회 쿼리 제거. 필터·컨트롤러 어디서 던져도 동일한 JSON 에러 코드 체계로 응답.",
  },
];
