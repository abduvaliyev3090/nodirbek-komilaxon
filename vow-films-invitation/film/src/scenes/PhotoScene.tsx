import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { KenBurns } from "../components/KenBurns";
import { useLayout } from "../components/useLayout";
import { Dust } from "../components/Overlays";
import { colors, fonts } from "../theme";
import { weddingConfig } from "../../../wedding.config";

/** Fades its children in over `fade` frames at the start of the enclosing Sequence. */
function FadeIn({ fade, children }: { fade: number; children: React.ReactNode }) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, fade], [0, 1], { extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
}

/**
 * Shared engine for the two photo scenes.
 *  - "couple"  (5–12 s): wide, slow pushes, full frame
 *  - "details" (12–18 s): tighter "macro" crops, a travelling light leak and cinema bars
 */
export function PhotoScene({
  images,
  duration,
  variant,
}: {
  images: string[];
  duration: number;
  variant: "couple" | "details";
}) {
  const frame = useCurrentFrame();
  const { height, u } = useLayout();
  const per = Math.ceil(duration / images.length);
  const overlap = 12;
  const macro = variant === "details";

  const bars = macro ? interpolate(frame, [0, 24], [0, height * 0.075], { extrapolateRight: "clamp" }) : 0;
  const leak = interpolate(frame, [0, duration], [-20, 120]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {images.map((src, i) => (
        <Sequence key={`${src}-${i}`} from={i * per} durationInFrames={per + overlap} layout="none">
          <FadeIn fade={overlap}>
            <KenBurns
              src={src}
              duration={per + overlap}
              from={macro ? 1.25 : 1.05}
              to={macro ? 1.5 : 1.2}
              driftX={(i % 2 === 0 ? -1 : 1) * (macro ? 40 : 26)}
              driftY={(i % 3 === 0 ? -1 : 1) * 16}
              brightness={macro ? 0.9 : 0.8}
            />
          </FadeIn>
        </Sequence>
      ))}

      {macro ? (
        <AbsoluteFill
          style={{
            mixBlendMode: "screen",
            opacity: 0.45,
            background: `radial-gradient(circle at ${leak}% 40%, ${colors.gold}66, transparent 42%)`,
          }}
        />
      ) : null}

      <Dust count={macro ? 26 : 18} opacity={0.7} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 26%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.7) 100%)" }} />

      {macro ? (
        <>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: bars, background: "#000" }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: bars, background: "#000" }} />
        </>
      ) : null}

      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 110 * u }}>
        <div
          style={{
            fontFamily: fonts.sans,
            fontSize: 22 * u,
            letterSpacing: "0.5em",
            textIndent: "0.5em",
            color: colors.goldSoft,
            opacity: interpolate(frame, [20, 50, duration - 20, duration], [0, 0.85, 0.85, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          {weddingConfig.brand.collection}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
