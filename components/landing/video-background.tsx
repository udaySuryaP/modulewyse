export function VideoBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 -z-20 h-[100lvh] min-h-dvh w-screen bg-[#101111] bg-cover bg-center bg-no-repeat will-change-transform"
      style={{ backgroundImage: "url('/images/bgImage.png')" }}
    />
  );
}
