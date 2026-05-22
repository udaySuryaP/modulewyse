"use client";

import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { cn } from "@/lib/utils";

type AnswerRendererProps = {
  className?: string;
  content: string;
  compact?: boolean;
};

function citationParts(text: string) {
  const parts = text.split(/(\[\d+\])/g);

  return parts.map((part, index) => {
    if (/^\[\d+\]$/.test(part)) {
      return (
        <span
          className="mx-0.5 inline-flex translate-y-[-1px] items-center mw-radius-pill border border-[var(--mw-hairline)] bg-[var(--mw-surface-strong)] px-1.5 py-0.5 text-[0.72em] font-semibold leading-none text-[var(--mw-ink)]"
          key={`${part}-${index}`}
        >
          {part}
        </span>
      );
    }

    return part;
  });
}

function languageFromClassName(className?: string) {
  return className?.match(/language-([\w-]+)/)?.[1]?.toLowerCase() ?? "";
}

function textFromChildren(children: React.ReactNode) {
  return String(children).replace(/\n$/, "");
}

export function AnswerRenderer({
  className,
  compact = false,
  content,
}: AnswerRendererProps) {
  return (
    <div
      className={cn(
        "mw-answer-renderer min-w-0 max-w-full overflow-hidden text-[var(--mw-body)]",
        compact ? "text-[14px] leading-[1.55]" : "text-[15px] leading-[1.65]",
        className,
      )}
    >
      <ReactMarkdown
        rehypePlugins={[rehypeKatex]}
        remarkPlugins={[remarkGfm, remarkMath]}
        components={{
          blockquote({ children }) {
            return (
              <blockquote className="my-4 border-l-2 border-[var(--mw-hairline-strong)] pl-4 text-[var(--mw-muted)]">
                {children}
              </blockquote>
            );
          },
          code({ children, className }) {
            const language = languageFromClassName(className);
            const value = textFromChildren(children);

            if (!language) {
              return (
                <code className="mw-radius-input bg-[var(--mw-surface-strong)] px-1.5 py-0.5 font-mono text-[0.92em] text-[var(--mw-ink)]">
                  {children}
                </code>
              );
            }

            if (language === "mermaid") {
              return (
                <div className="my-4 overflow-hidden mw-radius-card border border-[var(--mw-hairline)] bg-[var(--mw-canvas-soft)]">
                  <div className="border-b border-[var(--mw-hairline)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--mw-muted)]">
                    Diagram preview coming soon
                  </div>
                  <pre className="overflow-x-auto p-4 text-[13px] leading-[1.55] text-[var(--mw-body)]">
                    <code className="font-mono">{value}</code>
                  </pre>
                </div>
              );
            }

            return (
              <div className="my-4 overflow-hidden mw-radius-card border border-[var(--mw-hairline)] bg-[var(--mw-canvas-soft)]">
                <div className="border-b border-[var(--mw-hairline)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--mw-muted)]">
                  {language}
                </div>
                <pre className="overflow-x-auto p-4 text-[13px] leading-[1.55] text-[var(--mw-body)]">
                  <code className="font-mono">{value}</code>
                </pre>
              </div>
            );
          },
          h1({ children }) {
            return (
              <h1 className="mb-3 mt-5 text-[24px] font-semibold leading-[1.2] text-[var(--mw-ink)]">
                {children}
              </h1>
            );
          },
          h2({ children }) {
            return (
              <h2 className="mb-2.5 mt-5 text-[20px] font-semibold leading-[1.25] text-[var(--mw-ink)]">
                {children}
              </h2>
            );
          },
          h3({ children }) {
            return (
              <h3 className="mb-2 mt-4 text-[17px] font-semibold leading-[1.3] text-[var(--mw-ink)]">
                {children}
              </h3>
            );
          },
          li({ children }) {
            return <li className="pl-1">{children}</li>;
          },
          ol({ children }) {
            return (
              <ol className="my-3 list-decimal space-y-1.5 pl-5 marker:text-[var(--mw-muted)]">
                {children}
              </ol>
            );
          },
          p({ children }) {
            return <p className="my-3">{children}</p>;
          },
          table({ children }) {
            return (
              <div className="my-4 overflow-x-auto mw-radius-card border border-[var(--mw-hairline)]">
                <table className="w-full min-w-[520px] border-collapse text-left text-[13px]">
                  {children}
                </table>
              </div>
            );
          },
          td({ children }) {
            return (
              <td className="border-t border-[var(--mw-hairline)] px-3 py-2 align-top">
                {children}
              </td>
            );
          },
          th({ children }) {
            return (
              <th className="bg-[var(--mw-surface-strong)] px-3 py-2 font-semibold text-[var(--mw-ink)]">
                {children}
              </th>
            );
          },
          ul({ children }) {
            return (
              <ul className="my-3 list-disc space-y-1.5 pl-5 marker:text-[var(--mw-muted)]">
                {children}
              </ul>
            );
          },
          text({ children }) {
            return <>{citationParts(String(children))}</>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
