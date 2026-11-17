import { AbsoluteFill } from "remotion";
import { weddingConfig, type Lang } from "../../../wedding.config";
import { translations } from "../../../src/i18n/translations";
import { KenBurns } from "../components/KenBurns";
import { Dust } from "../components/Overlays";
import { GoldLine, Rise } from "../components/Reveal";
import { useLayout } from "../components/useLayout";
import { colors, fonts } from "../theme";
import { galleryImages } from "../timing";

const isPlaceholder = (s: string) => /^\s*\[.*\]\s*$/.test(s);

/** 32–37 s · The invitation message and the venue (both from wedding.config.ts). */
export function Message({ lang, duration }: { lang: Lang; duration: number }) {
  const { portrait, u } = useLayout();
  const { film, hero, event } = weddingConfig;
  const t = translations[lang];
  const venue = event.venue.name[lang];
  const address = event.venue.address[lang];

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <KenBurns src={galleryImages().couple[1]} duration={duration} from={1.08} to={1.18} brightness={0.2} blur={6} />
      <Dust count={22} opacity={0.6} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0.2), rgba(0,0,0,0.8))" }} />

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center", padding: `0 ${portrait ? 110 : 360}px` }}>
        <Rise delay={4} duration={26}>
          <div style={{ fontFamily: fonts.sans, fontSize: 24 * u, letterSpacing: "0.5em", textIndent: "0.5em", color: colors.gold }}>{hero.invite[lang]}</div>
        </Rise>

        <Rise delay={20} duration={34} style={{ marginTop: 60 * u }}>
          <div style={{ fontFamily: fonts.serifItalic, fontStyle: "italic", fontWeight: 300, fontSize: (portrait ? 78 : 76) * u, lineHeight: 1.22, color: colors.ivory }}>
            {film.inviteMessage[lang]}
          </div>
        </Rise>

        <GoldLine delay={62} width={280 * u} style={{ marginTop: 70 * u }} />

        <Rise delay={78} duration={28} style={{ marginTop: 56 * u }}>
          <div style={{ fontFamily: fonts.sans, fontSize: 22 * u, letterSpacing: "0.45em", textIndent: "0.45em", color: colors.gold, textTransform: "uppercase" }}>{t.film.venue}</div>
          <div
            style={{
              fontFamily: fonts.serif,
              fontWeight: 400,
              fontSize: 54 * u,
              marginTop: 18 * u,
              color: isPlaceholder(venue) ? colors.mist : colors.ivory,
              fontStyle: isPlaceholder(venue) ? "italic" : "normal",
            }}
          >
            {venue}
          </div>
          <div style={{ fontFamily: fonts.serifItalic, fontStyle: "italic", fontSize: 36 * u, marginTop: 10 * u, color: isPlaceholder(address) ? colors.mist : "rgba(243,234,216,0.7)" }}>{address}</div>
        </Rise>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
