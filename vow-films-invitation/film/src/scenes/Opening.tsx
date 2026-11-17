import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { weddingConfig, type Lang } from "../../../wedding.config";
import { KenBurns } from "../components/KenBurns";
import { Dust } from "../components/Overlays";
import { GoldLine, Rise } from "../components/Reveal";
import { useLayout } from "../components/useLayout";
import { colors, fonts } from "../theme";
import { galleryImages } from "../timing";

/** 0–5 s · Atmospheric opening: a dark starry horizon sharpening out of blur, gold dust, the collection title. */
export function Opening({ lang, duration }: { lang: Lang; duration: number }) {
  const frame = useCurrentFrame();
  const { u } = useLayout();
  const { brand } = weddingConfig;
  const blur = interpolate(frame, [0, duration], [26, 5], { extrapolateRight: "clamp" });
  const dim = interpolate(frame, [0, 60], [0.12, 0.42], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ filter: `blur(${blur}px)` }}>
        <KenBurns src={galleryImages().hero} duration={duration} from={1.12} to={1.28} brightness={dim} />
      </AbsoluteFill>
      <Dust count={60} />

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center", padding: 80 * u }}>
        <Rise delay={14} duration={34}>
          <div style={{ fontFamily: fonts.sans, fontWeight: 400, fontSize: 28 * u, letterSpacing: `${0.55}em`, textIndent: "0.55em", color: colors.goldSoft }}>
            {brand.name}
          </div>
        </Rise>
        <Rise delay={44} duration={46} distance={20} style={{ marginTop: 64 * u }}>
          <div style={{ fontFamily: fonts.serif, fontWeight: 300, fontSize: 118 * u, letterSpacing: "0.2em", textIndent: "0.2em", lineHeight: 1.05, color: colors.ivory }}>
            {brand.collection}
          </div>
        </Rise>
        <GoldLine delay={86} width={300 * u} style={{ marginTop: 56 * u }} />
        <Rise delay={104} duration={30} distance={14} style={{ marginTop: 48 * u }}>
          <div style={{ fontFamily: fonts.serifItalic, fontStyle: "italic", fontWeight: 300, fontSize: 40 * u, color: "rgba(243,234,216,0.78)" }}>{brand.tagline[lang]}</div>
        </Rise>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
