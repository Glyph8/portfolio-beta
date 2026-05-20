"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "neutral",
  securityLevel: "strict",
  fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui",
  flowchart: {
    // 노드 간 여백을 늘려 한국어 라벨이 줄바꿈된 박스들이 답답해 보이지 않도록 함
    nodeSpacing: 36,
    rankSpacing: 50,
    padding: 12,
    htmlLabels: true,
    useMaxWidth: true,
  },
  themeVariables: {
    // 기존 13px 은 한국어/영문이 섞인 라벨에서 작아 보였음 → 본문(text-sm) 과
    // 거의 동일한 14px 로 통일해 본문↔다이어그램 간 시선 이동이 매끄럽도록 함.
    fontSize: "14px",
    primaryColor: "#ffffff",
    primaryTextColor: "#111827",
    primaryBorderColor: "#111827",
    lineColor: "#374151",
    secondaryColor: "#f9fafb",
    tertiaryColor: "#ffffff",
  },
});

type Props = {
  chart: string;
  /** SSR/인쇄 fallback으로 보여줄 정적 내용 */
  fallback?: React.ReactNode;
  /** 고유 id — 같은 페이지에 여러 개 있을 때 충돌 방지 */
  id?: string;
};

/**
 * Web 전용 mermaid 렌더러.
 * 인쇄 시에는 fallback을 노출하여 PDF에도 동일 정보가 남도록 한다.
 */
type RenderState = { loading: boolean; error: boolean; svg: string };

export default function MermaidDiagram({ chart, fallback, id = "mermaid" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<RenderState>({ loading: true, error: false, svg: "" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { svg } = await mermaid.render(`${id}-svg`, chart);
        if (!cancelled) setState({ loading: false, error: false, svg });
      } catch (err) {
        if (!cancelled) {
          console.error("mermaid render failed:", err);
          setState({ loading: false, error: true, svg: "" });
        }
      }
    })();
    return () => {
      cancelled = true;
      setState({ loading: true, error: false, svg: "" });
    };
  }, [chart, id]);

  const { loading, error, svg } = state;

  return (
    <div className="print:break-inside-avoid">
      {/* 웹 전용 렌더링 영역 — 인쇄 시 숨김 */}
      <div className="print:hidden">
        {loading && (
          <div
            className="flex h-48 animate-pulse items-center justify-center rounded-md border border-border bg-muted"
            aria-label="diagram loading"
            aria-busy="true"
          >
            <div className="h-full w-full rounded-md bg-muted-foreground/10" />
          </div>
        )}

        {error && (
          <div
            className="flex h-48 flex-col items-center justify-center gap-2 rounded-md border border-border bg-muted text-muted-foreground"
            role="alert"
            aria-label="diagram render failed"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 opacity-40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
            <p className="text-sm">다이어그램을 렌더링할 수 없습니다.</p>
          </div>
        )}

        {!loading && !error && (
          <div
            ref={ref}
            className="mermaid-diagram flex justify-center overflow-x-auto border border-border bg-white p-6"
            aria-label="architecture diagram"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        )}
      </div>

      {/* 인쇄 fallback — PDF에도 구조 정보가 남도록 */}
      {fallback && <div className="hidden print:block">{fallback}</div>}
    </div>
  );
}
