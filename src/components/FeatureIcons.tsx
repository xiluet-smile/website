// Line icons for the clinic feature cards. Keys match the `icon` field in clinic.json.
type P = { className?: string };

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const Svg = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <svg
    viewBox="0 0 24 24"
    width={24}
    height={24}
    aria-hidden="true"
    className={`block ${className ?? ""}`}
    {...base}
  >
    {children}
  </svg>
);

const icons: Record<string, (p: P) => React.JSX.Element> = {
  /** Tooth with a ceramist's brush: in-house lab. */
  lab: (p) => (
    <Svg {...p}>
      <path d="M8.2 4.5c-2.6 0-4 2-3.8 4.3.2 2.1 1.2 3.6 1.7 5.2.5 1.7.6 4 1.6 5.2.8.9 1.7.2 2-.8.4-1.3.6-3 2.3-3s1.9 1.7 2.3 3c.3 1 1.2 1.7 2 .8 1-1.2 1.1-3.5 1.6-5.2.5-1.6 1.5-3.1 1.7-5.2.2-2.3-1.2-4.3-3.8-4.3-1.6 0-2.4.8-3.8.8s-2.2-.8-3.8-.8z" />
      <path d="M17.5 2.5l3 3M15.8 4.2l3 3" />
    </Svg>
  ),
  /** Scan frame around a face profile: 3D scanning and digital design. */
  scan: (p) => (
    <Svg {...p}>
      <path d="M4 8V5.5A1.5 1.5 0 015.5 4H8M16 4h2.5A1.5 1.5 0 0120 5.5V8M20 16v2.5a1.5 1.5 0 01-1.5 1.5H16M8 20H5.5A1.5 1.5 0 014 18.5V16" />
      <path d="M9.5 7.5c2.4-.6 4.8.6 5.3 2.8.3 1.3-.2 2-.2 2.8 0 .5.6.8.6 1.3s-.7.6-.8 1.2c-.1.7.3 1.6-.5 2-1 .5-2.3 0-3.3.6" />
      <path d="M9.5 7.5c-1.8 1.4-2.3 4-1.3 6.2" />
    </Svg>
  ),
  /** Door with a window: private treatment rooms. */
  room: (p) => (
    <Svg {...p}>
      <path d="M6 20V5.5A1.5 1.5 0 017.5 4h9A1.5 1.5 0 0118 5.5V20M3.5 20h17" />
      <path d="M9.5 7.5h5v4h-5zM12 7.5v4M9.5 9.5h5" />
      <circle cx="14.8" cy="14.5" r=".8" fill="currentColor" stroke="none" />
    </Svg>
  ),
  /** Tooth with low-dose rays: digital X-rays and CT. */
  xray: (p) => (
    <Svg {...p}>
      <path d="M10.2 7.5c-2 0-3.1 1.5-2.9 3.3.2 1.6.9 2.8 1.3 4 .4 1.3.5 3 1.2 3.9.6.7 1.3.2 1.5-.6.3-1 .5-2.3 1.7-2.3s1.4 1.3 1.7 2.3c.2.8.9 1.3 1.5.6.7-.9.8-2.6 1.2-3.9.4-1.2 1.1-2.4 1.3-4 .2-1.8-.9-3.3-2.9-3.3-1.2 0-1.8.6-2.8.6s-1.6-.6-2.8-.6z" />
      <path d="M12 2.5v2M6.3 4.3l1.4 1.4M17.7 4.3l-1.4 1.4M3.5 9.5h2M18.5 9.5h2" />
    </Svg>
  ),
  /** Shield with a check: sterilization you can see. */
  sterile: (p) => (
    <Svg {...p}>
      <path d="M12 3.5l7 2.6v5.4c0 4.3-2.9 7.6-7 9-4.1-1.4-7-4.7-7-9V6.1l7-2.6z" />
      <path d="M8.8 12.2l2.2 2.2 4.4-4.6" />
    </Svg>
  ),
  /** Phone taking a smile photo: the from-home step. */
  photo: (p) => (
    <Svg {...p}>
      <rect x="7" y="2.5" width="10" height="19" rx="2" />
      <path d="M10.5 5h3" />
      <circle cx="12" cy="13" r="3" />
      <path d="M10.6 10.2l.6-1.1h1.6l.6 1.1" />
    </Svg>
  ),
  /** Tooth under an X-ray frame: exam, scans and bite analysis. */
  exam: (p) => (
    <Svg {...p}>
      <path d="M4 8V5.5A1.5 1.5 0 015.5 4H8M16 4h2.5A1.5 1.5 0 0120 5.5V8M20 16v2.5a1.5 1.5 0 01-1.5 1.5H16M8 20H5.5A1.5 1.5 0 014 18.5V16" />
      <path d="M10.3 8c-1.5 0-2.3 1.1-2.1 2.4.1 1.1.6 2 .9 2.9.3.9.4 2.1.9 2.8.4.5.9.1 1.1-.4.2-.7.4-1.6 1.2-1.6s1 .9 1.2 1.6c.2.5.7.9 1.1.4.5-.7.6-1.9.9-2.8.3-.9.8-1.8.9-2.9.2-1.3-.6-2.4-2.1-2.4-.9 0-1.3.4-2 .4s-1.1-.4-2-.4z" />
    </Svg>
  ),
  /** Tooth with a temporary shell: preparation and temporaries. */
  prep: (p) => (
    <Svg {...p}>
      <path d="M9.4 5.5c-2.2 0-3.4 1.6-3.2 3.6.2 1.7 1 3 1.4 4.4.4 1.4.5 3.3 1.3 4.3.7.8 1.4.2 1.7-.6.3-1.1.5-2.5 1.9-2.5s1.6 1.4 1.9 2.5c.3.8 1 1.4 1.7.6.8-1 .9-2.9 1.3-4.3.4-1.4 1.2-2.7 1.4-4.4.2-2-1-3.6-3.2-3.6-1.3 0-2 .6-3.1.6S10.7 5.5 9.4 5.5z" />
      <path d="M7.5 10.5h9" strokeDasharray="2 2" />
      <path d="M18.5 3.5l2 2M17 5l2 2" />
    </Svg>
  ),
  /** Tooth with a check mark: try-in and delivery. */
  delivery: (p) => (
    <Svg {...p}>
      <path d="M9.4 5.5c-2.2 0-3.4 1.6-3.2 3.6.2 1.7 1 3 1.4 4.4.4 1.4.5 3.3 1.3 4.3.7.8 1.4.2 1.7-.6.3-1.1.5-2.5 1.9-2.5s1.6 1.4 1.9 2.5c.3.8 1 1.4 1.7.6.8-1 .9-2.9 1.3-4.3.4-1.4 1.2-2.7 1.4-4.4.2-2-1-3.6-3.2-3.6-1.3 0-2 .6-3.1.6S10.7 5.5 9.4 5.5z" />
      <path d="M9.6 11.6l1.7 1.7 3.4-3.6" />
    </Svg>
  ),
  /** Two speech bubbles: bilingual team. */
  bilingual: (p) => (
    <Svg {...p}>
      <path d="M3.5 6.5A1.5 1.5 0 015 5h8a1.5 1.5 0 011.5 1.5v4.8a1.5 1.5 0 01-1.5 1.5H8.2L5.5 15v-2.2H5a1.5 1.5 0 01-1.5-1.5V6.5z" />
      <path d="M16.5 9.5H19a1.5 1.5 0 011.5 1.5v4.3a1.5 1.5 0 01-1.5 1.5h-.5V19l-2.6-2.2H11a1.5 1.5 0 01-1.5-1.5v-.8" />
      <path d="M7 10.2c1.2-.4 2.4-1.5 2.8-3.2M6.3 7.8h3.8" />
    </Svg>
  ),
};

/** Renders the icon for a feature key inside a soft gold disc; nothing when the key is unknown. */
export default function FeatureIcon({
  name,
  className,
  plain = false,
}: {
  name?: string;
  className?: string;
  plain?: boolean;
}) {
  const Icon = name ? icons[name] : undefined;
  if (!Icon) return null;
  if (plain) return <Icon className={className} />;
  return (
    <span
      className={`grid h-11 w-11 flex-none place-items-center rounded-full bg-[rgba(205,177,128,.18)] text-teal ${className ?? ""}`}
    >
      <Icon />
    </span>
  );
}
