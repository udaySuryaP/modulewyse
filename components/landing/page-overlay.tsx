export function PageOverlay() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-[var(--mw-canvas)]" />
    </div>
  );
}
