"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "neutral",
  securityLevel: "strict",
  fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui",
  themeVariables: {
    fontSize: "13px",
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
export default function MermaidDiagram({ chart, fallback, id = "mermaid" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { svg } = await mermaid.render(`${id}-svg`, chart);
        if (!cancelled) setSvg(svg);
      } catch (err) {
        console.error("mermaid render failed:", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  return (
    <div className="print:break-inside-avoid">
      {/* 웹 전용 렌더링 영역 — 인쇄 시 숨김 */}
      <div
        ref={ref}
        className="mermaid-diagram flex justify-center overflow-x-auto border border-border bg-white p-6 print:hidden"
        aria-label="architecture diagram"
        dangerouslySetInnerHTML={{ __html: svg }}
      />

      {/* 인쇄 fallback — PDF에도 구조 정보가 남도록 */}
      {fallback && <div className="hidden print:block">{fallback}</div>}
    </div>
  );
}
