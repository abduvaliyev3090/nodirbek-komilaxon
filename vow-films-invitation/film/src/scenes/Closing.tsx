import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { weddingConfig, type Lang } from "../../../wedding.config";
import { Dust } from "../components/Overlays";
import { GoldLine, Rise } from "../components/Reveal";
import { useLayout } from "../components/useLayout";
import { colors, fonts } from "../theme";

/** 37–40 s · VOW FILMS sign-off. Fades to black on the final frames. */
export function ClosingScene({ lang, duration }: { lang: Lang; duration: number }) {
  const frame = useCurrentFrame();
  const { u } = useLayout();
  const { brand } = weddingConfig;
  const out = interpolate(frame, [duration - 22, duration], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, ${colors.gold}22, transparent 60%)` }} />
      <Dust count={24} opacity={0.6 * out} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center", opacity: out }}>
        <Rise delay={2} duration={30} distance={20}>
          <div style={{ fontFamily: fonts.serif, fontWeight: 300, fontSize: 112 * u, letterSpacing: "0.34em", textIndent: "0.34em", color: colors.ivory }}>{brand.name}</div>
        </Rise>
        <GoldLine delay={22} width={300 * u} style={{ marginTop: 50 * u }} />
        <Rise delay={30} duration={24} style={{ marginTop: 44 * u }}>
          <div style={{ fontFamily: fonts.sans, fontSize: 26 * u, letterSpacing: "0.55em", textIndent: "0.55em", color: colors.gold }}>{brand.collection}</div>
        </Rise>
        <Rise delay={44} duration={24} style={{ marginTop: 36 * u }}>
          <div style={{ fontFamily: fonts.serifItalic, fontStyle: "italic", fontSize: 36 * u, color: "rgba(243,234,216,0.7)" }}>{brand.tagline[lang]}</div>
        </Rise>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
