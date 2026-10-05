type P = { size?: number; className?: string };

export const CameraIcon = ({ size = 17, className }: P) => (
  <svg viewBox="0 0 20 20" width={size} height={size} aria-hidden="true" className={`flex-none ${className ?? ""}`}>
    <path
      d="M3 7.5A1.5 1.5 0 014.5 6H6l1.2-1.6A1 1 0 018 4h4a1 1 0 01.8.4L14 6h1.5A1.5 1.5 0 0117 7.5v7a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 14.5v-7z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <circle cx="10" cy="11" r="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

export const PhoneIcon = ({ size = 16, className }: P) => (
  <svg viewBox="0 0 20 20" width={size} height={size} aria-hidden="true" className={`flex-none ${className ?? ""}`}>
    <path
      d="M6.5 3.5l2 3-1.6 1.6a9 9 0 005 5l1.6-1.6 3 2-1 2.3a1.5 1.5 0 01-1.6.9C8.6 15.9 4.1 11.4 3.3 6.1a1.5 1.5 0 01.9-1.6l2.3-1z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </svg>
);

export const WhatsAppIcon = ({ size = 22, className }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={`flex-none ${className ?? ""}`}>
    <path
      fill="currentColor"
      d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm0 1.8a8.2 8.2 0 1 1-4.2 15.3l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 0 1 12 3.8zm-3 4.4c-.2 0-.5 0-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.2 5 4.4 2.5 1 3 .8 3.5.7.6-.1 1.7-.7 2-1.4.2-.7.2-1.3.1-1.4l-1.9-.9c-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.6.3-.5c.1-.2 0-.4 0-.5l-.9-2c-.2-.5-.4-.5-.6-.5H9z"
    />
  </svg>
);

export const ChevronDown = ({ size = 11, className }: P) => (
  <svg viewBox="0 0 12 12" width={size} height={size} aria-hidden="true" className={className}>
    <path d="M2.5 4.5l3.5 3.5 3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);
export const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="M14 3h3c.3 2.4 1.8 4 4 4.3v3c-1.6 0-3-.5-4-1.3V15a6 6 0 11-6-6v3a3 3 0 103 3V3z" />
  </svg>
);
export const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.2c0-.9.3-1.5 1.5-1.5h1.5V5.1c-.3 0-1.2-.1-2.2-.1-2.2 0-3.8 1.4-3.8 3.9V11H8v3h2.5v7h3z" />
  </svg>
);
export const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="M21.6 7.2a2.5 2.5 0 00-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 002.4 7.2 26 26 0 002 12a26 26 0 00.4 4.8 2.5 2.5 0 001.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 001.8-1.8A26 26 0 0022 12a26 26 0 00-.4-4.8zM10 15V9l5.2 3L10 15z" />
  </svg>
);

const flagBase = "inline-block flex-none rounded-[2px] shadow-[inset_0_0_0_1px_rgba(26,26,26,.12)]";
export const FlagUS = ({ className = "h-[13px] w-[18px]" }: { className?: string }) => (
  <span
    aria-hidden="true"
    className={`${flagBase} ${className}`}
    style={{
      background:
        "linear-gradient(#3C3B6E,#3C3B6E) 0 0/40% 54% no-repeat,repeating-linear-gradient(#B22234 0 7.7%,#fff 7.7% 15.4%)",
    }}
  />
);
export const FlagES = ({ className = "h-[13px] w-[18px]" }: { className?: string }) => (
  <span
    aria-hidden="true"
    className={`${flagBase} ${className}`}
    style={{ background: "linear-gradient(#AA151B 0 25%,#F1BF00 25% 75%,#AA151B 75%)" }}
  />
);

/** Five stars drawn as SVG (sized in em, colored by currentColor) so no fallback glyph font is needed. */
export const Stars = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 20" aria-hidden="true" className={`inline-block h-[1em] w-[5em] flex-none align-[-0.12em] ${className ?? ""}`} fill="currentColor">
    {[0, 1, 2, 3, 4].map((i) => (
      <path key={i} transform={`translate(${i * 20} 0)`} d="M10 1.8l2.5 5.3 5.7.7-4.2 4 1.1 5.7L10 14.7l-5.1 2.8 1.1-5.7-4.2-4 5.7-.7z" />
    ))}
  </svg>
);
