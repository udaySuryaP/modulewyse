export function VideoBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-20 bg-[#101111] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/bgImage.png')" }}
    />
  );
}
