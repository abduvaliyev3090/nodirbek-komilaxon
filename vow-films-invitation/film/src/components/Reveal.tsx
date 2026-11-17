import { Easing, interpolate, useCurrentFrame } from "remotion";
import type { CSSProperties, ReactNode } from "react";

/** Fade + rise + de-blur text in, starting `delay` frames into the current Sequence. */
export function Rise({
  delay = 0,
  duration = 28,
  distance = 36,
  children,
  style,
}: {
  delay?: number;
  duration?: number;
  distance?: number;
  children: ReactNode;
  style?: CSSProperties;
}) {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div style={{ opacity: t, transform: `translateY(${(1 - t) * distance}px)`, filter: `blur(${(1 - t) * 10}px)`, ...style }}>{children}</div>
  );
}

/** A hairline that draws itself from the centre. */
export function GoldLine({ delay = 0, duration = 36, width = 260, style }: { delay?: number; duration?: number; width?: number; style?: CSSProperties }) {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return <div style={{ height: 2, width, transform: `scaleX(${t})`, background: "linear-gradient(90deg, transparent, #c9a96a, transparent)", ...style }} />;
}
