const sourceChips = ["Reviewed", "Cited", "Module-aware"];

export function ProductPreviewPanel() {
  return (
    <div className="relative mx-auto w-full max-w-[520px]">
      <div className="mw-panel bg-[var(--mw-surface-card)] p-[var(--mw-space-lg)]">
        <div className="flex items-center justify-between gap-[var(--mw-space-md)] border-b border-[var(--mw-hairline)] pb-[var(--mw-space-md)]">
          <div>
            <p className="mw-label">Answer workspace</p>
            <h2 className="mw-title-sm mt-[var(--mw-space-xs)]">
              Reviewed study context
            </h2>
          </div>
          <span className="mw-badge-blue shrink-0">Ready</span>
        </div>

        <div className="mt-[var(--mw-space-lg)] grid gap-[var(--mw-space-md)]">
          <div className="mw-panel-muted p-[var(--mw-space-md)]">
            <p className="mw-micro">Student question</p>
            <p className="mt-[var(--mw-space-sm)] text-[length:var(--mw-type-link)] leading-[1.45] text-[var(--mw-ink)]">
              Explain this topic from my reviewed notes.
            </p>
          </div>

          <div className="mw-radius-card border border-[var(--mw-hairline-strong)] bg-white p-[var(--mw-space-lg)]">
            <div className="flex flex-wrap items-center gap-[var(--mw-space-xs)]">
              <span className="mw-badge">Exam-ready</span>
              {sourceChips.map((chip) => (
                <span className="mw-badge-blue" key={chip}>
                  {chip}
                </span>
              ))}
            </div>
            <h3 className="mw-heading-sm mt-[var(--mw-space-lg)]">
              Structured answer with source-backed explanation.
            </h3>
            <div className="mt-[var(--mw-space-lg)] space-y-[var(--mw-space-sm)]">
              <div className="h-px w-full bg-[var(--mw-hairline)]" />
              <div className="h-px w-11/12 bg-[var(--mw-hairline)]" />
              <div className="h-px w-4/5 bg-[var(--mw-hairline)]" />
            </div>
            <p className="mw-meta mt-[var(--mw-space-lg)]">
              Cited answer preview with source chips and controlled answer
              length.
            </p>
          </div>

          <div className="grid grid-cols-3 overflow-hidden mw-radius-card border border-[var(--mw-hairline)]">
            {["Notes", "Sources", "Depth"].map((item) => (
              <div
                className="border-r border-[var(--mw-hairline)] p-[var(--mw-space-sm)] text-center last:border-r-0"
                key={item}
              >
                <p className="mw-micro text-[var(--mw-ink)]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute -bottom-6 right-4 hidden w-[250px] mw-radius-card border border-[var(--mw-hairline-strong)] bg-[var(--mw-accent-blue-soft)] p-[var(--mw-space-md)] lg:block">
        <p className="mw-label text-[var(--mw-navy)]">Scope guard</p>
        <p className="mt-[var(--mw-space-sm)] text-[length:var(--mw-type-link)] leading-[1.45] text-[var(--mw-navy)]">
          Answers stay inside available reviewed notes.
        </p>
      </div>
    </div>
  );
}
