export function PageOverlay() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-[rgba(16,17,17,0.28)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_42%,rgba(0,0,0,0.55)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_12%,rgba(184,101,63,0.28),transparent_36%),linear-gradient(135deg,rgba(111,51,40,0.28),transparent_55%,rgba(143,75,53,0.24))]" />
      <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:3px_3px]" />
    </div>
  );
}
