import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Asset } from "./Asset";

/** A photograph with a slow cinematic push/drift over `duration` frames (relative to the enclosing Sequence). */
export function KenBurns({
  src,
  duration,
  from = 1.06,
  to = 1.22,
  driftX = -24,
  driftY = -14,
  brightness = 0.78,
  blur = 0,
}: {
  src: string;
  duration: number;
  from?: number;
  to?: number;
  driftX?: number;
  driftY?: number;
  brightness?: number;
  blur?: number;
}) {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const scale = from + (to - from) * t;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      <AbsoluteFill
        style={{
          transform: `scale(${scale}) translate(${driftX * t}px, ${driftY * t}px)`,
          filter: `brightness(${brightness}) contrast(1.05) saturate(0.95)${blur ? ` blur(${blur}px)` : ""}`,
        }}
      >
        <Asset src={src} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
