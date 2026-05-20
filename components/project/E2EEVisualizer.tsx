"use client";

import { useState } from "react";

/**
 * E2EEVisualizer — 클라이언트 사이드 종단간 암호화의 핵심 흐름 3가지를
 * "브라우저 안에 머문 값" 과 "서버에 도달한 값" 으로 나란히 비교하는 인터랙티브.
 *
 * 시나리오 (상단 탭으로 전환)
 * 1. 로그인 & 회원가입 — 사용자 키 유도와 개인정보 암호화 (6단계)
 * 2. 그룹 생성 & 초대 — 그룹 키 생성, 이중 암호화 멤버 식별자, 초대 토큰 (4단계)
 * 3. 약속 생성        — 약속 키 생성, 약속 식별자·멤버 식별자 암호화 (4단계)
 *
 * 디자인 원칙
 * - 데스크톱은 좌(브라우저) · 중앙(송신) · 우(서버) 가로 흐름, 모바일은 세로 흐름.
 *   고정폭 중앙 컬럼이 깨지지 않도록 grid 대신 flex-col md:flex-row 로 재구성.
 * - 진행 표시 점(stepper) 으로 현재 위치를 즉시 인지하고, 점 자체를 눌러
 *   임의 단계로 점프할 수 있도록 함 (시각적 상호작용을 과하지 않게 핵심에 집중).
 * - 이번 단계에서 새로 등장한 값은 옅은 강조 색상 + ring 으로 자연스럽게 부각.
 * - 송신 값은 중앙 화살표 위 pill 로 표시해 "이번에 무엇이 서버를 건너갔는지" 가
 *   한눈에 들어오도록 함.
 *
 * 인쇄본에는 빈 박스가 노출되지 않도록 print:hidden.
 */

type Kind = "plain" | "key" | "ciphertext" | "hash" | "empty";

type Row = { key: string; value: string; kind: Kind };

type Step = {
  label: string;
  op: string;
  clientRows: Row[];
  serverRows: Row[];
  /** 이번 단계에서 네트워크로 흘러간 값 (있을 때만 화살표 위 pill 로 표시) */
  wire?: string;
  /** 이번 단계에 송신은 없지만 다른 경로(예: 초대 토큰)로 전달되는 값 */
  sideChannel?: { value: string; note: string };
  note: string;
};

type Scenario = {
  id: string;
  title: string;
  summary: string;
  steps: Step[];
};

/* ─────────────────────────────────────────────────────────────────
 * 시나리오 1 — 로그인 & 회원가입
 * 사용자 키(MasterKey) 유도와 개인정보 암호화의 6단계.
 * ──────────────────────────────────────────────────────────────── */
const LOGIN_STEPS: Step[] = [
  {
    label: "1단계",
    op: "사용자 입력 — 브라우저 메모리에만 존재",
    clientRows: [
      { key: "사용자 ID", value: "dean@example.com", kind: "plain" },
      { key: "비밀번호",  value: "hunter2-literal",  kind: "plain" },
    ],
    serverRows: [{ key: "(수신 없음)", value: "—", kind: "empty" }],
    note: "로그인 폼에 입력한 시점. 어떤 네트워크 호출도 일어나지 않았고, ID·비밀번호는 입력 필드 메모리에만 존재한다.",
  },
  {
    label: "2단계",
    op: "비밀번호로부터 사용자 키 유도 (PBKDF2 · 10만 회 반복)",
    clientRows: [
      { key: "사용자 ID", value: "dean@example.com",            kind: "plain" },
      { key: "사용자 키", value: "32바이트  [브라우저 내부 전용]", kind: "key"   },
    ],
    serverRows: [{ key: "(수신 없음)", value: "—", kind: "empty" }],
    note: "비밀번호는 사용자 키를 만드는 재료로만 한 번 사용되고, 이후 코드 어디서도 다시 참조되지 않는다.",
  },
  {
    label: "3단계",
    op: "사용자 ID 의 해시값 생성 (HMAC-SHA256)",
    clientRows: [
      { key: "사용자 키",       value: "32바이트  [브라우저 내부 전용]", kind: "key"  },
      { key: "사용자 ID 해시",  value: "a3f1…(64자리)",                  kind: "hash" },
    ],
    serverRows: [
      { key: "사용자 ID 해시", value: "a3f1…(64자리)", kind: "hash" },
    ],
    wire: "사용자 ID 해시 (64자리)",
    note: "서버는 고정 길이 해시값만 받아 인덱싱한다. 원본 ID 자체는 네트워크를 건너지 않는다.",
  },
  {
    label: "4단계",
    op: "인증용 비밀번호 해시 생성 (PBKDF2 · 20만 회 반복)",
    clientRows: [
      { key: "사용자 키",      value: "32바이트  [브라우저 내부 전용]", kind: "key"  },
      { key: "비밀번호 해시",  value: "Base64(32바이트)",                kind: "hash" },
    ],
    serverRows: [
      { key: "사용자 ID 해시", value: "a3f1…(64자리)",   kind: "hash" },
      { key: "비밀번호 해시",  value: "Base64(32바이트)", kind: "hash" },
    ],
    wire: "비밀번호 해시 (Base64)",
    note: "키 유도와 인증 해시를 서로 다른 반복 횟수·재료로 분리. 한쪽 해시가 노출되어도 다른 쪽 복원이 불가능하다.",
  },
  {
    label: "5단계",
    op: "이메일 등 개인정보 암호화 (AES-GCM · 매번 새 IV)",
    clientRows: [
      { key: "사용자 키",         value: "32바이트  [브라우저 내부 전용]", kind: "key"        },
      { key: "암호화된 이메일",   value: "Base64(IV + 암호문 + 인증태그)",  kind: "ciphertext" },
    ],
    serverRows: [
      { key: "사용자 ID 해시",   value: "a3f1…(64자리)",                  kind: "hash"       },
      { key: "비밀번호 해시",     value: "Base64(32바이트)",               kind: "hash"       },
      { key: "암호화된 이메일",   value: "Base64(IV + 암호문 + 인증태그)", kind: "ciphertext" },
    ],
    wire: "암호화된 이메일",
    note: "매 암호화마다 IV(초기화 벡터)를 새로 생성해 동일 평문도 매번 다른 암호문으로 저장된다. 서버는 복호화 키를 가지고 있지 않다.",
  },
  {
    label: "6단계",
    op: "사용자 키를 IndexedDB 에 추출 불가 형태로 보관",
    clientRows: [
      { key: "사용자 키 (보관)", value: "CryptoKey · 추출 불가", kind: "key" },
    ],
    serverRows: [
      { key: "사용자 ID 해시",   value: "a3f1…(64자리)",                  kind: "hash"       },
      { key: "비밀번호 해시",     value: "Base64(32바이트)",               kind: "hash"       },
      { key: "암호화된 이메일",   value: "Base64(IV + 암호문 + 인증태그)", kind: "ciphertext" },
    ],
    note: "사용자 키는 CryptoKey 객체로만 접근 가능 — XSS 가 성공하더라도 키 바이트 자체를 꺼낼 수 없다. 새로고침 시 이 보관소에서 즉시 복원.",
  },
];

/* ─────────────────────────────────────────────────────────────────
 * 시나리오 2 — 그룹 생성 & 초대
 * 이미 로그인되어 사용자 키를 보유한 상태에서, 그룹 키를 만들고
 * 그룹 키와 멤버 식별자를 사용자 키로 한 번 더 감싸 서버에 등록한다.
 * 초대 토큰은 서버를 거치지 않고 그룹원에게만 직접 전달.
 * ──────────────────────────────────────────────────────────────── */
const GROUP_STEPS: Step[] = [
  {
    label: "1단계",
    op: "새 그룹 키 생성 (AES-GCM 256비트)",
    clientRows: [
      { key: "사용자 키", value: "CryptoKey  [보관 중]", kind: "key" },
      { key: "그룹 키",   value: "32바이트  [방금 생성]", kind: "key" },
    ],
    serverRows: [{ key: "(수신 없음)", value: "—", kind: "empty" }],
    note: "그룹원들끼리만 공유될 새 대칭 키를 브라우저에서 직접 생성. 이 키가 평문으로 서버에 도달하는 일은 없다.",
  },
  {
    label: "2단계",
    op: "그룹 키를 사용자 키로 한 번 감싸기",
    clientRows: [
      { key: "사용자 키",          value: "CryptoKey  [보관 중]",   kind: "key"        },
      { key: "그룹 키",            value: "32바이트  [메모리]",      kind: "key"        },
      { key: "암호화된 그룹 키",   value: "Base64(IV + 암호문 + 태그)", kind: "ciphertext" },
    ],
    serverRows: [{ key: "(수신 없음)", value: "—", kind: "empty" }],
    note: "그룹 키 자체는 본인의 사용자 키로 감싼다. 다른 기기에서 로그인할 때 같은 사용자 키로 다시 풀어 복구 가능.",
  },
  {
    label: "3단계",
    op: "내 사용자 ID 를 그룹 키 → 사용자 키 순으로 두 번 감싸기",
    clientRows: [
      { key: "그룹 키",                  value: "32바이트  [메모리]",         kind: "key"        },
      { key: "암호화된 그룹 키",         value: "Base64(…)",                   kind: "ciphertext" },
      { key: "그룹 내 멤버 식별자",      value: "Enc(그룹 키, 사용자 ID)",     kind: "ciphertext" },
      { key: "이중 암호화된 멤버 식별자", value: "Enc(사용자 키, 위 암호문)", kind: "ciphertext" },
    ],
    serverRows: [{ key: "(수신 없음)", value: "—", kind: "empty" }],
    note: "그룹 안에서의 내 신원도 그룹 키로 한 번, 다시 사용자 키로 또 한 번 감싸 같은 그룹에 들어온 다른 사람이 아닌 본인만 풀 수 있도록 함.",
  },
  {
    label: "4단계",
    op: "서버 등록 — 두 암호문만 송신",
    clientRows: [
      { key: "사용자 키",                value: "CryptoKey  [보관 중]", kind: "key"        },
      { key: "그룹 키",                  value: "32바이트  [메모리]",    kind: "key"        },
      { key: "암호화된 그룹 키",         value: "Base64(…)",             kind: "ciphertext" },
      { key: "이중 암호화된 멤버 식별자", value: "Base64(…)",             kind: "ciphertext" },
    ],
    serverRows: [
      { key: "암호화된 그룹 키",         value: "Base64(IV + 암호문 + 태그)", kind: "ciphertext" },
      { key: "이중 암호화된 멤버 식별자", value: "Base64(IV + 암호문 + 태그)", kind: "ciphertext" },
    ],
    wire: "암호화된 그룹 키 + 이중 암호화된 멤버 식별자",
    note: "서버는 그룹 키 자체도, 그룹원 ID 도 평문으로 보지 못한다. DB 가 통째로 유출되어도 평문 멤버 그래프를 재구성할 수 없는 상태.",
  },
  {
    label: "5단계",
    op: "초대 토큰 생성 — 그룹원과만 직접 공유",
    clientRows: [
      { key: "그룹 키",     value: "32바이트  [메모리]",                 kind: "key" },
      { key: "초대 토큰",   value: "{그룹 키} & {그룹 ID} & {UUID}",     kind: "key" },
    ],
    serverRows: [
      { key: "암호화된 그룹 키",         value: "Base64(…)", kind: "ciphertext" },
      { key: "이중 암호화된 멤버 식별자", value: "Base64(…)", kind: "ciphertext" },
    ],
    sideChannel: {
      value: "초대 토큰",
      note: "메신저·링크 등으로 그룹원에게만 직접 전달 — 서버 미경유",
    },
    note: "초대받은 사용자는 토큰에서 그룹 키를 꺼내 본인의 사용자 키로 다시 감싼 뒤 서버에 등록한다. 같은 그룹의 모든 멤버는 같은 그룹 키를 공유하지만, 서버에는 각자의 사용자 키로 감싼 암호문만 저장된다.",
  },
];

/* ─────────────────────────────────────────────────────────────────
 * 시나리오 3 — 약속 생성
 * 그룹 안에서 약속(promise) 을 새로 만들 때, 약속 단위의 별도 키를
 * 추가로 생성해 약속별로 암호화 컨텍스트를 분리한다.
 * ──────────────────────────────────────────────────────────────── */
const PROMISE_STEPS: Step[] = [
  {
    label: "1단계",
    op: "새 약속 키 생성 (AES-GCM 256비트)",
    clientRows: [
      { key: "사용자 키", value: "CryptoKey  [보관 중]", kind: "key" },
      { key: "그룹 키",   value: "CryptoKey  [그룹 진입 시 복원]", kind: "key" },
      { key: "약속 키",   value: "32바이트  [방금 생성]", kind: "key" },
    ],
    serverRows: [{ key: "(수신 없음)", value: "—", kind: "empty" }],
    note: "약속마다 별도의 키를 둬서, 같은 그룹이라도 약속별로 암호화 컨텍스트를 분리한다.",
  },
  {
    label: "2단계",
    op: "약속 키를 사용자 키로 감싸기",
    clientRows: [
      { key: "사용자 키",        value: "CryptoKey  [보관 중]",       kind: "key"        },
      { key: "약속 키",          value: "32바이트  [메모리]",          kind: "key"        },
      { key: "암호화된 약속 키", value: "Base64(IV + 암호문 + 태그)",  kind: "ciphertext" },
    ],
    serverRows: [{ key: "(수신 없음)", value: "—", kind: "empty" }],
    note: "약속 키 자체도 본인의 사용자 키로 감싼다. 다른 기기에서 다시 로그인해도 본인은 약속 키를 복원할 수 있다.",
  },
  {
    label: "3단계",
    op: "약속 ID 와 약속 내 멤버 식별자를 사용자 키로 암호화",
    clientRows: [
      { key: "사용자 키",                value: "CryptoKey  [보관 중]",    kind: "key"        },
      { key: "약속 키",                  value: "32바이트  [메모리]",       kind: "key"        },
      { key: "암호화된 약속 키",         value: "Base64(…)",                kind: "ciphertext" },
      { key: "암호화된 약속 ID",         value: "Enc(사용자 키, 약속 ID)",  kind: "ciphertext" },
      { key: "암호화된 약속 멤버 식별자", value: "Enc(사용자 키, 사용자 ID)", kind: "ciphertext" },
    ],
    serverRows: [{ key: "(수신 없음)", value: "—", kind: "empty" }],
    note: "약속 ID 도, 약속 내에서의 내 신원도 모두 본인 사용자 키로 감싸 본인만 어느 약속에 속해 있는지 알 수 있도록 한다.",
  },
  {
    label: "4단계",
    op: "서버 등록 — 세 암호문만 송신",
    clientRows: [
      { key: "사용자 키",                value: "CryptoKey  [보관 중]", kind: "key"        },
      { key: "약속 키",                  value: "32바이트  [메모리]",    kind: "key"        },
      { key: "암호화된 약속 키",         value: "Base64(…)",             kind: "ciphertext" },
      { key: "암호화된 약속 ID",         value: "Base64(…)",             kind: "ciphertext" },
      { key: "암호화된 약속 멤버 식별자", value: "Base64(…)",             kind: "ciphertext" },
    ],
    serverRows: [
      { key: "암호화된 약속 키",         value: "Base64(IV + 암호문 + 태그)", kind: "ciphertext" },
      { key: "암호화된 약속 ID",         value: "Base64(IV + 암호문 + 태그)", kind: "ciphertext" },
      { key: "암호화된 약속 멤버 식별자", value: "Base64(IV + 암호문 + 태그)", kind: "ciphertext" },
    ],
    wire: "암호화된 약속 키 + 약속 ID + 멤버 식별자",
    note: "서버는 약속 키 · 약속 식별자 · 멤버 식별자 어느 것도 평문으로 보지 못한다. 같은 약속에 참여한 다른 멤버 역시 본인만의 사용자 키로 별도로 등록한다.",
  },
];

const SCENARIOS: Scenario[] = [
  {
    id: "login",
    title: "로그인 & 회원가입",
    summary: "비밀번호 입력부터 사용자 키 안전 보관까지",
    steps: LOGIN_STEPS,
  },
  {
    id: "group",
    title: "그룹 생성 & 초대",
    summary: "그룹 키 생성과 이중 암호화된 멤버 식별자",
    steps: GROUP_STEPS,
  },
  {
    id: "promise",
    title: "약속 생성",
    summary: "약속 단위 별도 키와 식별자 암호화",
    steps: PROMISE_STEPS,
  },
];

/* ── 색상 토큰 — kind 별로 의미를 고정 ───────────────────────────── */
const KIND_STYLE: Record<Kind, { text: string; pill: string; label: string }> = {
  plain:      { text: "text-rose-700",    pill: "bg-rose-50 ring-rose-200",       label: "민감" },
  key:        { text: "text-amber-800",   pill: "bg-amber-50 ring-amber-200",     label: "키"   },
  hash:       { text: "text-emerald-800", pill: "bg-emerald-50 ring-emerald-200", label: "해시" },
  ciphertext: { text: "text-indigo-800",  pill: "bg-indigo-50 ring-indigo-200",   label: "암호문" },
  empty:      { text: "text-muted",       pill: "",                                label: "" },
};

/* ── 아이콘 ────────────────────────────────────────────────────── */
function BrowserIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className} aria-hidden>
      <rect x="2.5" y="4" width="19" height="15" rx="1.5" />
      <path d="M2.5 8h19" />
      <circle cx="5.5" cy="6" r="0.6" fill="currentColor" />
      <circle cx="7.5" cy="6" r="0.6" fill="currentColor" />
      <circle cx="9.5" cy="6" r="0.6" fill="currentColor" />
    </svg>
  );
}

function ServerIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className} aria-hidden>
      <ellipse cx="12" cy="5.5" rx="8" ry="2.5" />
      <path d="M4 5.5v6c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5v-6" />
      <path d="M4 11.5v6c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5v-6" />
    </svg>
  );
}

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/* ── 한 행(필드) 렌더 ──────────────────────────────────────────── */
function FieldRow({ row, isNew }: { row: Row; isNew: boolean }) {
  const style = KIND_STYLE[row.kind];

  return (
    <li
      className={[
        "flex flex-col gap-0.5 rounded-sm px-2.5 py-2 transition-all duration-300",
        // 이번 단계에서 새로 등장한 행만 옅은 배경 + ring 으로 부각
        isNew && row.kind !== "empty"
          ? `${style.pill} ring-1`
          : "ring-1 ring-transparent",
      ].join(" ")}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[12px] font-medium text-foreground">{row.key}</span>
        {row.kind !== "empty" && (
          <span className={`shrink-0 font-mono text-[10px] uppercase tracking-wide ${style.text}`}>
            {style.label}
            {isNew && <span className="ml-1.5 font-sans text-[10px] font-semibold">NEW</span>}
          </span>
        )}
      </div>
      <code className={`break-all font-mono text-[11px] leading-snug ${style.text}`}>
        {row.value}
      </code>
    </li>
  );
}

/* ── 한 쪽(브라우저/서버) 패널 ─────────────────────────────────── */
function Panel({
  title,
  subtitle,
  icon,
  rows,
  newKeys,
  tone,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  rows: Row[];
  newKeys: Set<string>;
  tone: "client" | "server";
}) {
  return (
    <div className="flex-1 border border-border bg-white">
      <div className="flex items-center gap-2.5 border-b border-border bg-surface px-3.5 py-2.5">
        <span
          className={[
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-sm",
            tone === "client"
              ? "bg-foreground/5 text-foreground"
              : "bg-foreground/5 text-muted",
          ].join(" ")}
        >
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
            {subtitle}
          </p>
        </div>
      </div>
      <ul className="space-y-1.5 p-3">
        {rows.map((row) => (
          <FieldRow key={row.key} row={row} isNew={newKeys.has(row.key)} />
        ))}
      </ul>
    </div>
  );
}

/* ── 송신 화살표 (가로/세로 양쪽 레이아웃 모두 한 컴포넌트로) ────── */
function WireArrow({
  wire,
  sideChannel,
}: {
  wire?: string;
  sideChannel?: { value: string; note: string };
}) {
  const hasWire = Boolean(wire);
  const hasSide = Boolean(sideChannel);

  return (
    <div className="flex flex-col items-center justify-center gap-2 px-2 py-3 md:py-0">
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
        네트워크
      </span>

      {hasWire ? (
        <>
          {/* 모바일: 아래쪽 화살표 / 데스크톱: 오른쪽 화살표 */}
          <ArrowIcon className="h-5 w-5 rotate-90 text-foreground md:rotate-0" />
          <span className="max-w-[12rem] rounded-full border border-foreground/20 bg-foreground/5 px-2.5 py-1 text-center text-[11px] font-medium text-foreground">
            {wire}
          </span>
          <span className="text-[10px] text-muted">이번 단계에 송신됨</span>
        </>
      ) : (
        <>
          <ArrowIcon className="h-5 w-5 rotate-90 text-border md:rotate-0" />
          <span className="text-[10px] text-muted">(이번 단계는 송신 없음)</span>
        </>
      )}

      {/* 곁가지 경로(예: 초대 토큰 — 그룹원에게만 직접 공유) */}
      {hasSide && (
        <div className="mt-1 flex flex-col items-center gap-1 border-t border-dashed border-border pt-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
            곁가지
          </span>
          <span className="max-w-[12rem] rounded-full border border-amber-300/60 bg-amber-50 px-2.5 py-1 text-center text-[11px] font-medium text-amber-800">
            {sideChannel!.value}
          </span>
          <span className="max-w-[12rem] text-center text-[10px] leading-tight text-muted">
            {sideChannel!.note}
          </span>
        </div>
      )}
    </div>
  );
}

/* ── 메인 컴포넌트 ─────────────────────────────────────────────── */
export default function E2EEVisualizer() {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);

  const scenario = SCENARIOS[scenarioIdx];
  const steps = scenario.steps;
  const step = steps[stepIdx];

  // 직전 단계와 비교해 "이번 단계에서 새로 등장한 키" 를 집합으로 산출.
  // — 1단계는 비교 대상이 없으므로 모든 키를 신규로 취급해 첫 등장을 부드럽게 강조.
  const prevStep = stepIdx === 0 ? null : steps[stepIdx - 1];
  const clientNew = new Set(
    step.clientRows
      .filter((r) => r.kind !== "empty" && (!prevStep || !prevStep.clientRows.some((p) => p.key === r.key)))
      .map((r) => r.key),
  );
  const serverNew = new Set(
    step.serverRows
      .filter((r) => r.kind !== "empty" && (!prevStep || !prevStep.serverRows.some((p) => p.key === r.key)))
      .map((r) => r.key),
  );

  const onSwitchScenario = (next: number) => {
    setScenarioIdx(next);
    setStepIdx(0);
  };

  return (
    <div className="border border-border bg-white print:hidden">

      {/* ── 시나리오 선택 탭 ── */}
      <div className="border-b border-border bg-surface px-4 py-3">
        <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">
          시나리오
        </p>
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="시나리오 선택">
          {SCENARIOS.map((s, i) => {
            const isActive = i === scenarioIdx;
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onSwitchScenario(i)}
                className={[
                  "border px-3 py-1.5 text-xs font-medium transition-colors",
                  isActive
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-white text-muted hover:border-foreground/40 hover:text-foreground",
                ].join(" ")}
              >
                {s.title}
              </button>
            );
          })}
        </div>
        <p className="mt-2.5 text-xs text-muted">{scenario.summary}</p>
      </div>

      {/* ── 컨트롤 바: 진행 점 + 카운터 + Prev/Next ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface/50 px-4 py-3">
        {/* 클릭 가능한 진행 점 */}
        <div className="flex items-center gap-1.5" role="tablist" aria-label="단계 이동">
          {steps.map((s, i) => {
            const isActive = i === stepIdx;
            const isDone = i < stepIdx;
            return (
              <button
                key={s.label}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={s.label}
                onClick={() => setStepIdx(i)}
                className={[
                  "h-2.5 w-2.5 rounded-full border transition-all duration-200",
                  isActive
                    ? "scale-125 border-foreground bg-foreground"
                    : isDone
                      ? "border-foreground/40 bg-foreground/40 hover:bg-foreground/70"
                      : "border-border bg-white hover:border-foreground/50",
                ].join(" ")}
              />
            );
          })}
          <span className="ml-2 font-mono text-[11px] text-muted">
            {stepIdx + 1} / {steps.length}
          </span>
        </div>

        {/* Prev / Next */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setStepIdx((v) => Math.max(0, v - 1))}
            disabled={stepIdx === 0}
            className="border border-border px-2.5 py-1 font-mono text-[11px] text-muted transition-colors enabled:hover:border-foreground/40 enabled:hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
          >
            ← 이전
          </button>
          <button
            type="button"
            onClick={() => setStepIdx((v) => Math.min(steps.length - 1, v + 1))}
            disabled={stepIdx === steps.length - 1}
            className="border border-foreground bg-foreground px-2.5 py-1 font-mono text-[11px] text-background transition-colors enabled:hover:bg-foreground/85 disabled:cursor-not-allowed disabled:opacity-30"
          >
            다음 →
          </button>
        </div>
      </div>

      {/* ── 현재 단계 헤딩 ── */}
      <div className="border-b border-border px-4 py-4">
        <p className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">
          {step.label}
        </p>
        <p className="text-base font-semibold leading-snug text-foreground">
          {step.op}
        </p>
      </div>

      {/* ── 본체: 브라우저 ← 송신 → 서버 ── */}
      <div className="flex flex-col items-stretch gap-0 p-4 md:flex-row">
        <Panel
          title="브라우저"
          subtitle="Client"
          icon={<BrowserIcon className="h-4 w-4" />}
          rows={step.clientRows}
          newKeys={clientNew}
          tone="client"
        />
        <WireArrow wire={step.wire} sideChannel={step.sideChannel} />
        <Panel
          title="서버 · DB"
          subtitle="Server"
          icon={<ServerIcon className="h-4 w-4" />}
          rows={step.serverRows}
          newKeys={serverNew}
          tone="server"
        />
      </div>

      {/* ── 설명 ── */}
      <div className="border-t border-border bg-surface px-4 py-3">
        <p className="text-[12px] leading-6 text-muted">{step.note}</p>
      </div>

      {/* ── 범례 ── */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-border px-4 py-2.5 text-[10px] font-mono">
        <span className="text-muted">범례</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-400" />민감 (평문)</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-400" />키 (메모리/IDB 전용)</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-400" />해시</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-indigo-400" />암호문</span>
      </div>
    </div>
  );
}
