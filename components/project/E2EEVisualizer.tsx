"use client";

import { useState } from "react";

/**
 * E2EEVisualizer — PBKDF2 → HMAC → AES-GCM 3단계 시각화.
 *
 * 클라이언트·서버 경계선을 기준으로, 어떤 값이 서버에 도달하고
 * 어떤 값이 브라우저에만 머무는지를 단계별로 드러낸다.
 *
 * 인쇄본에는 대체 표가 노출되도록 print:hidden 처리.
 */

type Step = {
  label: string;
  op: string;
  /** 좌측 Client 측 보이는 값 */
  clientRows: { key: string; value: string; kind: "plain" | "key" | "ciphertext" | "hash" }[];
  /** 우측 Server 측 보이는 값 */
  serverRows: { key: string; value: string; kind: "empty" | "hash" | "ciphertext" }[];
  /** 이번 단계에서 네트워크로 흘러간 값 (있으면 화살표 라벨로 표시) */
  wire?: string;
  note: string;
};

const STEPS: Step[] = [
  {
    label: "Step 0",
    op: "사용자 입력",
    clientRows: [
      { key: "userId",   value: "dean@example.com", kind: "plain" },
      { key: "password", value: "hunter2-literal",  kind: "plain" },
    ],
    serverRows: [{ key: "(수신 없음)", value: "—", kind: "empty" }],
    note: "이 시점까지 비밀번호는 브라우저 메모리 안에만 존재한다.",
  },
  {
    label: "Step 1",
    op: "PBKDF2-SHA256 · 100k iter · salt = userId",
    clientRows: [
      { key: "userId",    value: "dean@example.com",                 kind: "plain" },
      { key: "MasterKey", value: "ArrayBuffer(32)  [메모리 전용]",   kind: "key"   },
    ],
    serverRows: [{ key: "(수신 없음)", value: "—", kind: "empty" }],
    note: "password는 MasterKey로 유도되는 재료로만 쓰이고, 이후 참조되지 않는다.",
  },
  {
    label: "Step 2",
    op: "HMAC-SHA256(MasterKey, userId) → hashedUserId",
    clientRows: [
      { key: "MasterKey",    value: "ArrayBuffer(32)  [메모리 전용]", kind: "key"  },
      { key: "hashedUserId", value: "a3f1…(64 hex)",                    kind: "hash" },
    ],
    serverRows: [
      { key: "hashedUserId", value: "a3f1…(64 hex)", kind: "hash" },
    ],
    wire: "hashedUserId (64 hex)",
    note: "서버는 고정 길이 HMAC 값만 받아 인덱싱/조회한다. userId 원문은 건너가지 않는다.",
  },
  {
    label: "Step 3",
    op: "PBKDF2-SHA256 · 200k iter · salt = MasterKey → hashedPassword",
    clientRows: [
      { key: "MasterKey",      value: "ArrayBuffer(32)  [메모리 전용]", kind: "key"  },
      { key: "hashedPassword", value: "Base64(32)",                      kind: "hash" },
    ],
    serverRows: [
      { key: "hashedUserId",   value: "a3f1…(64 hex)", kind: "hash" },
      { key: "hashedPassword", value: "Base64(32)",    kind: "hash" },
    ],
    wire: "hashedPassword (Base64)",
    note: "인증 해시는 Step 1의 MasterKey와 다른 iter 수·도메인으로 분리되어, 해시 재사용 공격을 구조적으로 막는다.",
  },
  {
    label: "Step 4",
    op: "AES-GCM(MasterKey, email)  · IV=random(12B)",
    clientRows: [
      { key: "MasterKey",         value: "ArrayBuffer(32)  [메모리 전용]", kind: "key"        },
      { key: "encryptedEmail",    value: "Base64(IV ‖ cipher ‖ tag)",       kind: "ciphertext" },
    ],
    serverRows: [
      { key: "hashedUserId",    value: "a3f1…(64 hex)",               kind: "hash"        },
      { key: "hashedPassword",  value: "Base64(32)",                  kind: "hash"        },
      { key: "encryptedEmail",  value: "Base64(IV ‖ cipher ‖ tag)",   kind: "ciphertext"  },
    ],
    wire: "encryptedEmail (IV‖cipher‖tag)",
    note: "IV가 매 암호화마다 새로 생성되어 AES-GCM의 재사용 취약점을 방지한다. 서버는 복호화 키가 없다.",
  },
  {
    label: "Step 5",
    op: "IndexedDB.put(MasterKey, { extractable: false })",
    clientRows: [
      { key: "MasterKey (IDB)", value: "CryptoKey · extractable=false",  kind: "key" },
    ],
    serverRows: [
      { key: "hashedUserId",   value: "a3f1…(64 hex)",             kind: "hash"       },
      { key: "hashedPassword", value: "Base64(32)",                kind: "hash"       },
      { key: "encryptedEmail", value: "Base64(IV ‖ cipher ‖ tag)", kind: "ciphertext" },
    ],
    note: "MasterKey는 CryptoKey 객체로만 접근 가능 — XSS가 성공해도 raw 바이트를 꺼낼 수 없다.",
  },
];

const KIND_STYLE: Record<string, string> = {
  plain:      "text-foreground",
  key:        "text-amber-700",
  hash:       "text-emerald-700",
  ciphertext: "text-indigo-700",
  empty:      "text-muted",
};

export default function E2EEVisualizer() {
  const [idx, setIdx] = useState(0);
  const step = STEPS[idx];

  return (
    <div className="border border-border bg-white print:hidden">

      {/* ── 컨트롤 바 ── */}
      <div className="flex items-center justify-between gap-3 border-b border-border bg-surface px-4 py-3">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
            {step.label}
          </span>
          <span className="font-mono text-xs text-foreground">{step.op}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIdx((v) => Math.max(0, v - 1))}
            disabled={idx === 0}
            className="border border-border px-2 py-1 font-mono text-[11px] text-muted transition-colors enabled:hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Prev
          </button>
          <span className="font-mono text-[11px] text-muted">
            {idx + 1} / {STEPS.length}
          </span>
          <button
            type="button"
            onClick={() => setIdx((v) => Math.min(STEPS.length - 1, v + 1))}
            disabled={idx === STEPS.length - 1}
            className="border border-border px-2 py-1 font-mono text-[11px] text-muted transition-colors enabled:hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      </div>

      {/* ── 본체: Client ← wire → Server 3-컬럼 ── */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-0">
        {/* Client */}
        <div className="border-r border-border p-5">
          <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
            Client (Browser)
          </p>
          <ul className="space-y-2">
            {step.clientRows.map((row) => (
              <li key={row.key} className="flex items-baseline gap-3 font-mono text-[12px]">
                <span className="w-40 shrink-0 text-muted">{row.key}</span>
                <span className={`truncate ${KIND_STYLE[row.kind]}`}>{row.value}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 네트워크 경계 + 흐르는 값 */}
        <div className="flex w-24 flex-col items-center justify-center bg-surface px-2 py-4">
          <div className="h-px w-full bg-border" />
          <span className="my-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            Network
          </span>
          {step.wire ? (
            <div className="flex flex-col items-center">
              <span className="font-mono text-[10px] text-muted">──▶</span>
              <span className="mt-1 max-w-[9rem] text-center font-mono text-[10px] leading-tight text-foreground">
                {step.wire}
              </span>
            </div>
          ) : (
            <span className="font-mono text-[10px] text-muted">(no transfer)</span>
          )}
        </div>

        {/* Server */}
        <div className="p-5">
          <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
            Server (DB)
          </p>
          <ul className="space-y-2">
            {step.serverRows.map((row) => (
              <li key={row.key} className="flex items-baseline gap-3 font-mono text-[12px]">
                <span className="w-40 shrink-0 text-muted">{row.key}</span>
                <span className={`truncate ${KIND_STYLE[row.kind]}`}>{row.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── 설명 ── */}
      <div className="border-t border-border bg-surface px-5 py-3">
        <p className="text-xs leading-6 text-muted">{step.note}</p>
      </div>

      {/* ── 범례 ── */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border px-5 py-3 font-mono text-[10px]">
        <span className="text-muted">범례:</span>
        <span className="text-foreground">■ 평문</span>
        <span className="text-amber-700">■ 키 (메모리/IDB 전용)</span>
        <span className="text-emerald-700">■ 해시</span>
        <span className="text-indigo-700">■ 암호문</span>
      </div>
    </div>
  );
}
