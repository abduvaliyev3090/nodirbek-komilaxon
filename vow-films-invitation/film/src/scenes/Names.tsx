import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { weddingConfig, type Lang } from "../../../wedding.config";
import { KenBurns } from "../components/KenBurns";
import { Dust } from "../components/Overlays";
import { GoldLine, Rise } from "../components/Reveal";
import { useLayout } from "../components/useLayout";
import { colors, fonts } from "../theme";
import { galleryImages } from "../timing";

function Name({ text, delay, size }: { text: string; delay: number; size: number }) {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [delay, delay + 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <div
      style={{
        fontFamily: fonts.serif,
        fontWeight: 300,
        fontSize: size,
        lineHeight: 1,
        color: colors.ivory,
        letterSpacing: `${0.5 - 0.42 * t}em`,
        // keeps the word optically centred while letter-spacing animates
        textIndent: `${0.5 - 0.42 * t}em`,
        opacity: t,
        filter: `blur(${(1 - t) * 12}px)`,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
}

/** 18–25 s · The couple's names. */
export function Names({ lang: _lang }: { lang: Lang; duration: number }) {
  const frame = useCurrentFrame();
  const { portrait, u } = useLayout();
  const { couple, brand } = weddingConfig;
  const size = portrait ? 150 * u : 170 * u;
  const amp = interpolate(frame, [70, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.6)) });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <KenBurns src={galleryImages().names} duration={240} from={1.05} to={1.2} brightness={0.3} blur={4} />
      <Dust count={34} opacity={0.8} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0.15), rgba(0,0,0,0.75))" }} />

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <Rise delay={6} duration={30}>
          <div style={{ fontFamily: fonts.sans, fontSize: 26 * u, letterSpacing: "0.55em", textIndent: "0.55em", color: colors.gold, marginBottom: 70 * u }}>
            {brand.collection}
          </div>
        </Rise>

        <div style={{ display: "flex", flexDirection: portrait ? "column" : "row", alignItems: "center", gap: portrait ? 10 * u : 60 * u }}>
          <Name text={couple.first} delay={14} size={size} />
          <div
            style={{
              fontFamily: fonts.serifItalic,
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: size * 0.55,
              lineHeight: 1,
              color: colors.gold,
              opacity: amp,
              transform: `scale(${0.7 + 0.3 * amp})`,
            }}
          >
            &amp;
          </div>
          <Name text={couple.second} delay={40} size={size} />
        </div>

        <GoldLine delay={120} width={320 * u} style={{ marginTop: 80 * u }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
