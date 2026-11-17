import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../theme";

/** Drifting gold dust. Deterministic (seeded) so every render is identical. */
export function Dust({ count = 46, opacity = 1 }: { count?: number; opacity?: number }) {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity }}>
      {Array.from({ length: count }, (_, i) => {
        const x0 = random(`dx-${i}`) * width;
        const y0 = random(`dy-${i}`) * height;
        const size = 2 + random(`ds-${i}`) * 7;
        const speed = 0.25 + random(`dv-${i}`) * 0.9;
        const sway = Math.sin(frame / (40 + random(`dw-${i}`) * 50) + i) * 24;
        const y = (((y0 - frame * speed) % height) + height) % height;
        const twinkle = 0.35 + 0.65 * Math.abs(Math.sin(frame / (18 + random(`dt-${i}`) * 30) + i));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x0 + sway,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              background: colors.goldSoft,
              opacity: twinkle * (0.25 + random(`do-${i}`) * 0.55),
              filter: `blur(${size > 6 ? 2.5 : 0.6}px)`,
              boxShadow: `0 0 ${size * 3}px ${colors.gold}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
}

/** Vignette + animated film grain, drawn over the entire film. */
export function FilmFinish({ grain = 0.09 }: { grain?: number }) {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,0.65) 100%)" }} />
      <svg width={width} height={height} viewBox={`0 0 ${width / 2} ${height / 2}`} style={{ position: "absolute", inset: 0, mixBlendMode: "overlay", opacity: grain }}>
        <filter id="g">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={frame % 9} stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#g)" />
      </svg>
    </AbsoluteFill>
  );
}

/** Fade the enclosing scene in over `inFrames` and out over `outFrames` (the last frames of its Sequence). */
export function useSceneOpacity(durationInFrames: number, inFrames: number, outFrames: number, fadeOut = true): number {
  const frame = useCurrentFrame();
  const fadeIn = inFrames > 0 ? interpolate(frame, [0, inFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  const out =
    fadeOut && outFrames > 0
      ? interpolate(frame, [durationInFrames - outFrames, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
      : 1;
  return Math.min(fadeIn, out);
}
