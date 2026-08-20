// Subtle dotted grid on the paper background (neo-brutalist texture).
export default function BackgroundGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 [background-image:radial-gradient(#15131218_1.5px,transparent_1.6px)] [background-size:24px_24px]"
    />
  );
}
