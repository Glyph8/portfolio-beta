import PrintButton from "./PrintButton";

export default function Hero() {
  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-20 print:py-5">

      {/* ── 레이블: 12px + 자간 0.25em + 대문자 → '이름' 앞의 계층 선언 ── */}
      <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.25em] text-muted">
        Full-stack Developer
      </p>

      {/* ── 이름: font-black + tracking-tight → 최대 굵기 × 좁은 자간 ── */}
      <h1 className="text-6xl font-black tracking-tight text-foreground sm:text-7xl">
        강동윤
      </h1>

      {/* ── 구분선: 여백을 구조화하는 단일 1px 선 ── */}
      <div className="my-8 border-t border-border print:my-3" />

      {/* ── 핵심 메시지: 본문은 muted, 키워드만 foreground/semibold ── */}
      <p className="max-w-xl text-base leading-8 text-muted">
        어떤 도메인이든 호기심과 책임감을 가지고 깊이 파고드는 것을 즐기는 엔지니어입니다.
        어느새 프론트엔드, 백엔드, 인프라, 보안까지 폭넓게 경험하며, 기술적 깊이와 넓이를 동시에 갖춘 T자형 풀스택 개발자로 거듭나고자 합니다.
      </p>

      {/* ── 연락처 + 액션 ── */}
      <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-3 text-sm print:mt-4">

        {/* 이메일 — 웹: 클릭 가능 / 인쇄: mailto라 텍스트 자체가 주소 */}
        <a
          href="mailto:newdy0808@gmail.com"
          className="text-muted transition-colors hover:text-foreground"
        >
          newdy0808@gmail.com
        </a>

        <span className="select-none text-border" aria-hidden>·</span>

        {/*
          GitHub — 웹: 클릭 가능
          인쇄: globals.css의 a[href^="https"]::after 로 URL 병기되나,
          링크 텍스트가 이미 URL이므로 no-print-url 클래스로 중복 억제
        */}
        <a
          href="https://github.com/glyph8"
          target="_blank"
          rel="noopener noreferrer"
          className="no-print-url text-muted transition-colors hover:text-foreground"
        >
          github.com/glyph8
        </a>

        {/* PDF 버튼 구분선 — 인쇄 시 버튼과 함께 숨김 */}
        <span className="print:hidden select-none text-border" aria-hidden>·</span>

        {/* PDF 버튼 — Client Component, print:hidden 적용됨 */}
        <PrintButton />
      </div>
    </section>
  );
}
