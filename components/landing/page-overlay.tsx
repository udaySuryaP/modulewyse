export function PageOverlay() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 mw-atmosphere opacity-80" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(250,250,250,0.92)_0%,rgba(245,245,245,0.72)_45%,rgba(245,245,245,0.95)_100%)]" />
      <div className="absolute inset-0 opacity-[0.45] [background-image:linear-gradient(rgba(12,10,9,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(12,10,9,0.03)_1px,transparent_1px)] [background-size:24px_24px]" />
    </div>
  );
}
