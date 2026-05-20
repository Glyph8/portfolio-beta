import type { DecisionCardProps } from "@/components/project/DecisionCard";

/**
 * TIMETOGETHER_DECISIONS
 *
 * TimeTogether 프론트엔드(NextTimeTogether-Frontend) 에서 내린 기술 의사결정 4건.
 * 모든 카드는 브라우저에서 동작하는 클라이언트 코드 범위에 한정한다.
 */
export const TIMETOGETHER_DECISIONS: DecisionCardProps[] = [
  {
    title: "Web Crypto API 만으로 클라이언트 사이드 종단간 암호화 구현",
    tags: ["Web Crypto API", "PBKDF2", "AES-GCM", "IndexedDB"],
    context:
      "그룹 약속 조율 특성상 이메일·전화번호·아이디 같은 식별 가능한 개인정보를 다루어야 함. 서버 DB 가 유출되더라도 원문이 복원되지 않는 구조가 필요했고, 외부 암호 라이브러리를 도입하면 공급망 위험과 번들 비대화가 따라옴.",
    problem:
      "일반적인 서버 측 해싱은 로그·메모리 덤프·내부자 접근 등 여러 경로로 평문이 노출될 수 있음. 반대로 사용자 키를 브라우저 메모리에만 두면 새로고침마다 재로그인이 필요해 UX 가 무너짐.",
    action:
      "외부 의존성 없이 브라우저 표준 crypto.subtle 로 모든 암·복호화를 처리. 비밀번호로부터 PBKDF2 100k 회 반복을 거쳐 사용자 키를 유도하고, 인증용 해시는 다시 PBKDF2 200k 회로 분리해 키와 인증 해시가 같은 출처를 공유하지 않도록 설계. 개인정보는 매 회 새로 생성한 12바이트 IV 와 함께 AES-GCM 으로 암호화하고, 사용자 키 자체는 IndexedDB 에 추출 불가(extractable: false) CryptoKey 로 보관해 XSS 가 성공해도 키 바이트 추출 자체가 브라우저 레벨에서 차단되도록 함.",
    result:
      "원본 비밀번호·이메일·전화번호의 서버 전송 0 회 달성. 외부 암호 라이브러리 의존성 0 개로 공급망 공격 표면 제거. 새로고침 시 키 복원은 IndexedDB 에서 즉시 수행되어 사용자 개입 0 회로 세션 유지.",
  },
  {
    title: "그룹 키 공유와 다단계 암호화 식별자로 그룹 익명성 보장",
    tags: ["AES-GCM", "React Query", "암호학적 접근 제어"],
    context:
      "단일 응답으로 그룹 정보와 멤버 목록을 평문 반환하면 서버 측에서 누가 누구와 같은 그룹인지 추적할 수 있고, 이는 사교 관계 프로파일링으로 이어짐. 동시에 초대·조회 흐름은 매끄러워야 했음.",
    problem:
      "그룹 키를 클라이언트 단독 보관 시 멤버 초대가 불가능. 서버 평문 보관 시 익명성 전제가 무너짐. 그룹 키와 멤버 식별자를 모두 서버에서 식별 불가 상태로 유지하면서 초대·조회는 자연스럽게 동작해야 함.",
    action:
      "그룹 생성 시 클라이언트가 AES-GCM 256-bit 그룹 키를 생성하고, 본인의 사용자 키로 한 번 더 감싸 서버에 올림. 초대 시에는 그룹 키와 그룹 식별자가 결합된 토큰을 초대 URL 에 실어 그룹원 사이에서만 공유. 멤버 가입 시 본인의 사용자 ID 를 그룹 키로 암호화한 뒤, 다시 본인의 사용자 키로 한 번 더 감싸 저장. 조회는 그룹 ID 목록 복호화 → 그룹 키 임포트 → 멤버 식별자 병렬 복호화의 3 단계로 나누고, 단계별로 TanStack Query 독립 캐시 + 복호화 실패 시 재시도 차단을 적용해 무의미한 백엔드 호출을 막음.",
    result:
      "서버 로그·DB 어디서도 그룹-멤버 관계를 평문으로 재구성 불가능. 그룹장도 본인 키 없이는 그룹 키를 풀 수 없는 대칭 구조 확보. 복호화 실패가 네트워크 재시도로 전파되지 않아 불필요 트래픽 0 회.",
  },
  {
    title: "추천 요청 시 사용자 신원과 행동 이력을 분리하는 익명 식별자 생성",
    tags: ["HMAC-SHA256", "TanStack Query", "프라이버시"],
    context:
      "장소 추천 모델은 사용자별 행동 이력을 누적해야 추천 품질이 유지됨. 그러나 매 요청마다 실제 사용자 ID 를 그대로 보내면 일정·장소 방문 이력과 실제 신원이 서버에서 결합 가능해짐.",
    problem:
      "매번 랜덤 ID 를 새로 만들면 행동 이력이 단절되어 추천 학습이 불가. 반대로 사용자 ID 를 그대로 송신하면 익명성이 깨짐. 같은 사용자가 항상 같은 값을 재현하면서도, 그 값에서 원본 ID 를 역산할 수 없는 식별자가 필요.",
    action:
      "로그인 시 브라우저 로컬에 사용자별 인덱스 키를 보관해두고, 추천 요청 직전 HMAC-SHA256 으로 결정성 익명 식별자를 생성해 사용자 ID 대신 송신. HMAC 은 같은 입력에 같은 출력을 보장하므로 동일 사용자의 행동 이력이 일관되게 누적되지만, 단방향 해시이므로 식별자에서 원본 ID 를 역산할 수 없음. 추천 결과는 TanStack Query 캐시에 저장해 장소 후보 목록·투표·확정 흐름과 그대로 합류.",
    result:
      "추천 요청에서 원본 사용자 ID 평문 전송 0 회. 동일 사용자가 항상 동일 식별자를 재현해 추천 모델의 사용자별 패턴 학습은 끊김 없이 유지. 신원-이력 결합 가능성을 클라이언트 단계에서 차단.",
  },
  {
    title: "드래그 입력 상태로 폴링을 제어하는 실시간 시간표 조율",
    tags: ["TanStack Query", "Pointer Events", "UX"],
    context:
      "여러 그룹원이 동시에 가능한 시간대를 드래그로 표시하는 화면이 핵심 UX. 다른 사람의 변경 사항은 빠르게 반영되어야 하지만, WebSocket 서버를 별도로 운영하기엔 인프라 비용과 보안 모델 유지 비용이 모두 부담스러웠음.",
    problem:
      "고정 5 초 폴링은 내가 드래그하는 도중 서버 응답이 도착하면 입력을 덮어써 UX 가 깨짐. 창 포커스 기반 갱신만으로는 같은 화면에 머무는 동료의 변경을 제때 반영하지 못함.",
    action:
      "TanStack Query 의 refetchInterval 을 입력 모드에 대한 함수로 두고, 시간표 셀의 pointerdown 에서 폴링 OFF, pointerup 에서 ON 으로 전환. 리페치 중 화면이 깜빡이지 않도록 직전 데이터를 placeholderData 로 유지하고, 비활성 탭에서는 폴링을 멈춰 불필요한 네트워크 요청을 차단. 마우스·터치·펜을 Pointer Events 단일 API 로 통합하고 touch-action: none 으로 iOS Safari 스크롤 충돌까지 함께 해결.",
    result:
      "WebSocket 인프라 비용 0 원으로 다중 사용자 실시간 조율 UX 확보. 드래그 중 내 입력이 서버 응답에 덮이는 충돌 0 건. 비활성 탭에서의 폴링 0 회로 자원 낭비 제거.",
  },
];

/**
 * BLOCKGUARD_DECISIONS
 *
 * BlockGuard 프론트엔드(BlockGuard-Client) 에서 직접 구현·리팩토링한 기술
 * 의사결정 4건. 노인 사용자 대상 모바일 웹의 UX·상태·호환성에 집중.
 */
export const BLOCKGUARD_DECISIONS: DecisionCardProps[] = [
  {
    title: "13단계 사기 분석 설문 — 영속화와 결과 캐싱을 한 흐름으로 묶기",
    tags: ["React 19", "TanStack Query", "localStorage", "Custom Hook"],
    context:
      "사기 분석은 텍스트·전화번호·URL·이미지·상황 설명을 13단계에 걸쳐 입력받는 무거운 폼. 노인 사용자가 실수로 새로고침하거나 외부 앱(전화·메신저)으로 이탈했다 돌아왔을 때 입력이 모두 사라지면 다시 끝까지 작성하는 부담이 너무 큼.",
    problem:
      "초기 구현은 fraudStore 단일 store 에 진행 상태를 두고 단계별 검증을 컴포넌트 안에서 반복 작성. 새로고침 시 진행 상태가 초기화되고, 결과 페이지로 진입 후 뒤로가기/재진입 때마다 분석 API 가 다시 호출되어 노인 사용자가 같은 결과를 또 기다리는 문제가 발생.",
    action:
      "fraudStore 를 `useFraudSurvey` 커스텀 훅으로 리팩토링. 각 단계 필수 키·다중 선택 여부를 `STEP_CONFIG` 한 곳에서 선언하고 `canProceed` 검증을 일관 처리. 매 답변 변경 시 `localStorage.setItem(\"surveyAnswers\", ...)` 로 자동 영속화하고, Outlet 자식 라우트는 `useFraudSurveyContext()` 로 동일 상태를 공유. 결과 페이지(`AnalysisResultPage`) 는 useQuery 의 idle/loading/error/success 를 명시적 분기로 처리하고, `queryKey: ['fraud-result', JSON.stringify(allAnswers)]` + `staleTime: 5분` + `refetchOnMount: false` 로 동일 답변에 대한 재호출을 차단.",
    result:
      "새로고침·외부 앱 이탈 후에도 설문 진행 상태 100 % 복원. 결과 페이지 재방문 시 5 분 이내 API 재호출 0 회. 단계별 검증 로직 중복 제거로 새 단계 추가 시 STEP_CONFIG 한 줄만 수정.",
  },
  {
    title: "사기 시뮬레이션 — 시간차 메세지 렌더링과 조기 이탈 차단",
    tags: ["Custom Hook", "useDelayRender", "Lottie · memo"],
    context:
      "보이스피싱 시뮬레이션(가족 사칭 · 대출사기 전화·문자) 은 \"실제 사기처럼 천천히 펼쳐지는 메세지\" 가 학습 핵심. 노인 사용자가 한 화면에서 모든 메세지를 한 번에 보면 사기 흐름의 긴장감과 학습 효과가 사라짐.",
    problem:
      "초기에는 모든 메세지를 한 번에 렌더했고, 사용자가 첫 메세지가 뜨자마자 다음 화면으로 클릭해 시뮬레이션의 학습 효과가 무너졌음. 또한 Lottie 애니메이션이 부모 입력 변경마다 리렌더되며 깜빡이는 문제도 발견됨.",
    action:
      "`useDelayRender(items, delayMs)` 훅을 만들어 메세지 1.5 초 · 전화 대사 3 초 간격으로 stagger 렌더링하고, 모든 항목 렌더링이 끝나기 전까지는 `isDone` 플래그로 다음 화면 클릭 자체를 차단. 지연 상수는 `delay-ms.ts` 로 분리(`MESSAGE_DELAY_MS = 1500`, `VOICECHAT_DELAY_MS = 3000`) 해 시나리오 간 일관 유지. Lottie 깜빡임은 입력값을 받는 부모 컴포넌트와 분리한 메모이즈드 모달로 감싸 해결.",
    result:
      "메세지가 전부 노출되기 전 다음 화면으로 이탈하는 케이스 0 건. Lottie 가 입력 변경마다 재마운트되는 문제 제거로 시뮬레이션 몰입도 회복. 새 시뮬레이션 추가 시 지연 상수와 useDelayRender 만 조합해 일관된 시간차 UX 재사용.",
  },
  {
    title: "이미지 첨부 useImageSave — URL 메모리 누수와 5MB 제한, Base64 영속화",
    tags: ["URL.createObjectURL", "Sonner", "localStorage"],
    context:
      "사기 분석 13단계 중 이미지 첨부 단계(피싱 의심 문자/통화 캡처) 는 한 번에 여러 장이 올라옴. 미리보기를 위해 `URL.createObjectURL` 을 쓰는데, 컴포넌트 언마운트나 개별 이미지 삭제 시 revoke 를 잊으면 모바일 환경에서 메모리가 빠르게 쌓임.",
    problem:
      "초기 구현은 미리보기 URL 을 만들기만 하고 정리하지 않아 13단계를 오가며 메모리 사용량이 누적. 또한 대용량 사진(특히 노인 사용자의 카메라 원본) 을 그대로 전송하면 모바일 셀룰러 환경에서 업로드가 자주 실패. 새로고침 시 첨부한 이미지가 모두 사라져 사용자가 재첨부해야 하는 문제도 함께 존재.",
    action:
      "이미지 관련 로직을 모두 `useImageSave` 커스텀 훅으로 분리. 미리보기 URL 의 라이프사이클(생성 → 개별 삭제 시 즉시 revoke → 언마운트 시 일괄 revoke) 을 한 군데서 책임지게 함. 5 MB 초과 파일은 업로드를 거부하고 Sonner 토스트(\"이미지 용량은 최대 5MB 까지 첨부 가능합니다\") 로 즉시 피드백. 새로고침 시에도 첨부 상태를 유지하기 위해 File 객체를 Base64 로 변환해 localStorage 에 저장하고 마운트 시 복원.",
    result:
      "미리보기 URL 누수 0 건 (revoke 누락 케이스 제거). 5 MB 초과 첨부로 인한 모바일 업로드 실패 차단. 새로고침 후 첨부 이미지 100 % 복원으로 13단계 도중 재첨부 0 회.",
  },
  {
    title: "iOS · 모바일 호환성 — 100dvh · overscroll · 스크롤 헤더 색상 전환",
    tags: ["iOS Safari", "Tailwind 4 dvh", "overscroll", "Sticky Header"],
    context:
      "주 사용자가 노인이고, 그 가족이 함께 쓰는 환경이라 iOS Safari 비중이 매우 높음. 100vh 기준 레이아웃은 주소창이 나타날 때 잘리고, 스크롤 끝에서 화면이 튕기는 고무줄 효과 때문에 결과 페이지가 의도하지 않게 위·아래로 흔들리며 위험도 표가 한눈에 안 들어옴.",
    problem:
      "`100vh` 기반 레이아웃은 iOS 주소창 토글마다 높이가 변해 시뮬레이션·결과 페이지 하단이 잘림. 스크롤 가능한 컨테이너 중첩으로 인해 결과 페이지에서 overscroll bounce 가 발생하며 헤더와 본문이 겹쳐 보임. 단색 헤더는 위쪽(밝은 결과 영역) 과 아래쪽(어두운 위험도 표 영역) 모두에서 대비를 잃음.",
    action:
      "전 페이지 레이아웃을 `h-dvh` (`100dvh`) + `flex-1` 조합으로 통일해 주소창 변화에 영향받지 않도록 함. 결과 페이지는 `overscroll-none` 으로 스크롤 고무줄 차단, 외부/내부 컨테이너 중복 `overflow` 를 단일 `<main>` 의 `flex-1 overflow-y-auto` 로 정리. 스크롤 위치(145 px 임계) 에 따라 헤더 배경색을 전환하는 `useScrollHeader` 훅을 만들어, 결과 영역에서는 투명, 위험도 영역에서는 채워진 헤더로 자연스럽게 전환되도록 함 (`transition-colors duration-150`).",
    result:
      "iOS 주소창 토글로 인한 하단 잘림 0 건. 결과 페이지 overscroll bounce 0 건. 헤더 색상 전환으로 어느 스크롤 위치에서도 헤더 텍스트 가독성 유지.",
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
