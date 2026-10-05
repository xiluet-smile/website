// Animated line icons from the design (48×48, drawn with stroke-dash animation).
// `tone="gold"` for dark backgrounds, "teal" (default) for light ones.
import type { ReactNode } from "react";

const tooth =
  "M24 6c-4 0-6 2-9 2s-6-1-7 5c-1 5 2 10 3 17 .6 4 2 12 5 12 3 0 2-9 8-9s5 9 8 9c3 0 4.4-8 5-12 1-7 4-12 3-17-1-6-4-5-7-5s-5-2-9-2z";
const P = (d: string, cls = "d") => <path key={d} d={d} className={cls} />;
const dot = (cx: number, cy: number, r = 1.6) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} className="f" />;

const icons = {
  toothBuild: [P(tooth), P("M18 22c2-2 10-2 12 0", "d d3"), dot(36, 8)],
  hideSmile: [P("M12 26c3 6 21 6 24 0"), P("M10 34c0-8 6-12 14-12s14 4 14 12", "d d2 s")],
  quote: [P("M10 8h28v32l-5-3-5 3-4-3-5 3-4-3-5 3z"), P("M16 18h16M16 24h16M16 30h9", "d d2"), dot(34, 30)],
  fakeNatural: [P(tooth), P("M6 24h6M36 24h6", "d d3"), <path key="h" d="M24 14a3 3 0 0 0 0 20" className="f" />],
  noTime: [<circle key="c" cx={24} cy={24} r={17} className="d" />, P("M24 13v11l7 5", "d d2"), P("M20 5h8", "d d3"), dot(38, 10)],
  needle: [P("M14 30c-4-4 2-14 10-18 3 6 1 14-4 18"), P("M10 38l6-6", "d d2"), P("M26 28c5-4 10-3 14-8", "d d3 s"), <path key="h" d="M18 22c1 1 3 1 4 0" className="f" />],
  chair: [P("M8 20c0-6 6-10 16-10s16 4 16 10c0 3-2 5-4 6H12c-2-1-4-3-4-6z"), P("M12 26v14M36 26v14M12 34h24", "d d2"), P("M16 40l-2 4M32 40l2 4", "d d3"), dot(24, 18)],
  photo: [<rect key="r" x={15} y={5} width={18} height={38} rx={4} className="d" />, P("M19 14h10v14H19z", "d d2"), <circle key="c" cx={24} cy={21} r={3} className="p" />, dot(24, 38, 1.2)],
  estimate: [P("M12 6h18l8 8v28H12z"), P("M30 6v8h8"), P("M18 22h12M18 28h12M18 34h7", "d d2"), P("M29 34h5", "d d4"), dot(36, 34)],
  pay: [<rect key="r" x={6} y={12} width={36} height={24} rx={4} className="d" />, P("M6 20h36", "d d2"), P("M12 29h8", "d d3"), P("M30 29l3 3 6-6", "t")],
  calendar: [
    <rect key="r" x={7} y={9} width={34} height={32} rx={4} className="d" />,
    P("M7 18h34M16 5v8M32 5v8", "d d2"),
    ...[
      [14, 24],
      [21, 24],
      [28, 24],
      [14, 31],
    ].map(([x, y]) => <rect key={`${x}-${y}`} x={x} y={y} width={6} height={5} rx={1} className="f" />),
  ],
  design: [P("M8 30c4-10 28-10 32 0"), P("M12 30c0 6 5 9 12 9s12-3 12-9", "d d2"), P("M16 30v6M22 30v9M26 30v9M32 30v6", "d d3"), P("M8 30h32", "d d3"), dot(40, 12)],
  delivery: [P(tooth), P("M31 35l3 3 8-8", "t")],
  shield: [P("M24 5l15 5v12c0 10-7 17-15 21-8-4-15-11-15-21V10z"), P("M17 24l5 5 10-10", "t"), P("M14 40h20", "d d4")],
  lab: [P("M18 6h12"), P("M20 6v14L9 38c-1 2 0 4 2 4h26c2 0 3-2 2-4L28 20V6", "d d2"), P("M16 30h16", "d d3"), dot(22, 35), dot(28, 37, 1.2)],
  approve: [P("M8 34c6-14 10-14 12-4 1 6 3 6 6-2 2-6 4-6 6 0 1 4 3 4 8 0"), P("M10 40h28", "d d3"), P("M30 12l3 3 7-7", "t")],
  veneer: [P("M17 8c4-2 10-2 14 0v22c0 6-3 10-7 10s-7-4-7-10z"), P("M13 12c3-3 8-4 11-4", "d d3 s"), dot(36, 12)],
  crown: [P("M12 22c0 10 4 20 8 20 3 0 2-8 4-8s1 8 4 8c4 0 8-10 8-20"), P("M12 22c0-6 4-10 12-10s12 4 12 10", "d d2 r"), P("M14 17h20", "d d3")],
  plane: [P("M6 28l14-2 8-14c1-2 4-2 4 1l-4 13 12 2-2 4-12 0-6 8-4 0 2-8-12-2z"), P("M8 40h32", "d d3"), dot(40, 10)],
  car: [P("M8 30v-6l5-10h22l5 10v6z"), P("M8 30v6h5v-4M40 30v6h-5v-4", "d d2"), P("M13 24h22", "d d3"), dot(15, 30, 2), dot(33, 30, 2)],
  bus: [<rect key="r" x={9} y={8} width={30} height={30} rx={4} className="d" />, P("M9 24h30M15 8v16M24 8v16M33 8v16", "d d2"), P("M13 38v4M35 38v4", "d d3"), dot(15, 31, 1.8), dot(33, 31, 1.8)],
  clock: [<circle key="c" cx={24} cy={24} r={17} className="d" />, <g key="g" className="sp">{P("M24 24V13", "d d2")}</g>, P("M24 24l8 5", "d d3"), dot(24, 24, 1.4)],
  fullArch: [P("M6 20c0 14 8 22 18 22s18-8 18-22"), P("M10 20v10M16 20v14M22 20v16M26 20v16M32 20v14M38 20v10", "d d2"), P("M6 20h36", "d d3")],
} satisfies Record<string, ReactNode[]>;

export type LineIconName = keyof typeof icons;

export default function LineIcon({ name, tone = "teal" }: { name: LineIconName; tone?: "teal" | "gold" }) {
  return (
    <svg className={`xi ${tone === "teal" ? "lt" : ""}`} viewBox="0 0 48 48" aria-hidden="true">
      {icons[name]}
    </svg>
  );
}
