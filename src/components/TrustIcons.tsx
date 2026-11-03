// Crisp 24px icons for the "Why patients trust us" ledger, one per fact. Drawn at a
// 1.5 stroke so they stay legible at small sizes (the 48-grid LineIcons are made
// for 40px+). Colour comes from `currentColor`, so the parent sets gold or teal.
const paths = {
  // Warranty: shield with a check.
  warranty: (
    <>
      <path d="M12 3.2 5 5.8v5.4c0 4.4 3 7.8 7 9.6 4-1.8 7-5.2 7-9.6V5.8z" />
      <path d="m8.9 12.1 2.1 2.1 4.2-4.4" />
    </>
  ),
  // Google rating: a star with a small sparkle.
  rating: (
    <>
      <path d="m11 4.6 1.9 4 4.4.6-3.2 3 .8 4.4-3.9-2.1-3.9 2.1.8-4.4-3.2-3 4.4-.6z" />
      <path d="M19 2.5v3M17.5 4h3" strokeWidth="1.2" />
    </>
  ),
  // Doctors: graduation cap for the degrees.
  doctors: (
    <>
      <path d="m2.8 9.2 9.2-4 9.2 4-9.2 4z" />
      <path d="M6.6 11v4.2c0 1.5 2.6 2.8 5.4 2.8s5.4-1.3 5.4-2.8V11" />
      <path d="M21.2 9.2v5.4" />
      <circle cx="21.2" cy="16.2" r=".9" fill="currentColor" stroke="none" />
    </>
  ),
  // In-house planning: one building, doctor and lab under the same roof.
  planning: (
    <>
      <path d="M4 20.5V8.6a1 1 0 0 1 .6-.9l6.4-3.2a1 1 0 0 1 1 0l6.4 3.2a1 1 0 0 1 .6.9v11.9" />
      <path d="M2.5 20.5h19" />
      <path d="M8 11h2M13 11h2M8 14.5h2M13 14.5h2" />
      <path d="M10 20.5v-3.2a1.5 1.5 0 0 1 3 0v3.2" />
    </>
  ),
};

export type TrustIconName = keyof typeof paths;

export default function TrustIcon({ name, className = "" }: { name: TrustIconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`block h-full w-full ${className}`}
    >
      {paths[name]}
    </svg>
  );
}

/**
 * Decorative line-art for the trust panel: nested arcs rising from the bottom-left
 * corner, below the link, and a faint dot grid under the ledger. Both fade out with a
 * mask so they never compete with the text.
 */
export function TrustBackdrop() {
  const rings = [90, 150, 210, 270, 330, 390];
  return (
    <>
      <svg
        aria-hidden="true"
        viewBox="0 0 800 800"
        className="pointer-events-none absolute -bottom-[460px] -left-[300px] -z-10 h-[800px] w-[800px] text-gold [mask-composite:intersect] [mask-image:radial-gradient(closest-side,#000_30%,transparent_95%),linear-gradient(to_top,#000_60%,transparent_82%)] max-lg:hidden"
        fill="none"
        stroke="currentColor"
      >
        {rings.map((r, i) => (
          <circle key={r} cx="400" cy="400" r={r} strokeWidth={i === 0 ? 1.2 : 0.8} opacity={0.55 - i * 0.07} />
        ))}
        <circle cx="400" cy="400" r="3" fill="currentColor" stroke="none" opacity=".55" />
        {/* Tick marks on the outer ring, like a dial. */}
        {Array.from({ length: 24 }, (_, i) => {
          const a = (i / 24) * Math.PI * 2;
          const long = i % 6 === 0;
          const r1 = long ? 378 : 384;
          return (
            <line
              key={i}
              x1={400 + Math.cos(a) * r1}
              y1={400 + Math.sin(a) * r1}
              x2={400 + Math.cos(a) * 390}
              y2={400 + Math.sin(a) * 390}
              strokeWidth={long ? 1.2 : 0.8}
              opacity=".45"
            />
          );
        })}
      </svg>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-[62%] bg-[radial-gradient(rgba(247,244,238,.16)_1px,transparent_1.2px)] bg-[size:22px_22px] [mask-image:radial-gradient(ellipse_at_70%_50%,#000_20%,transparent_72%)] max-lg:hidden"
      />
    </>
  );
}
