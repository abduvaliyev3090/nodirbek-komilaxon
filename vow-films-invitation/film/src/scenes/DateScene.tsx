import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { weddingConfig, type Lang } from "../../../wedding.config";
import { translations } from "../../../src/i18n/translations";
import { MONTHS_NOMINATIVE, WEEKDAYS, getDateParts } from "../../../src/lib/dates";
import { KenBurns } from "../components/KenBurns";
import { Dust } from "../components/Overlays";
import { GoldLine, Rise } from "../components/Reveal";
import { useLayout } from "../components/useLayout";
import { colors, fonts } from "../theme";
import { galleryImages } from "../timing";

/** 25–32 s · The wedding date, driven by event.dateTime in wedding.config.ts. */
export function DateScene({ lang, duration }: { lang: Lang; duration: number }) {
  const frame = useCurrentFrame();
  const { u } = useLayout();
  const { event } = weddingConfig;
  const p = getDateParts(event.dateTime, event.timeZone);
  const t = translations[lang];

  if (!p) {
    return (
      <AbsoluteFill style={{ backgroundColor: "#000", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: fonts.serifItalic, fontSize: 56 * u, color: colors.ivory }}>{t.countdown.unavailable}</div>
      </AbsoluteFill>
    );
  }

  const day = String(p.day).padStart(2, "0");
  const time = `${String(p.hour).padStart(2, "0")}:${String(p.minute).padStart(2, "0")}`;
  const push = interpolate(frame, [0, duration], [1, 1.06]);
  const dayIn = interpolate(frame, [18, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <KenBurns src={galleryImages().hero} duration={duration} from={1.1} to={1.2} brightness={0.22} blur={3} />
      <Dust count={30} opacity={0.7} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center", transform: `scale(${push})` }}>
        <Rise delay={4} duration={26}>
          <div style={{ fontFamily: fonts.sans, fontSize: 26 * u, letterSpacing: "0.55em", textIndent: "0.55em", color: colors.gold, textTransform: "uppercase" }}>
            {WEEKDAYS[lang][p.weekday]}
          </div>
        </Rise>

        <div
          style={{
            fontFamily: fonts.serif,
            fontWeight: 300,
            fontSize: 420 * u,
            lineHeight: 0.9,
            color: colors.ivory,
            marginTop: 26 * u,
            opacity: dayIn,
            transform: `translateY(${(1 - dayIn) * 50}px)`,
            filter: `blur(${(1 - dayIn) * 14}px)`,
          }}
        >
          {day}
        </div>

        <Rise delay={52} duration={30}>
          <div style={{ fontFamily: fonts.serif, fontWeight: 300, fontSize: 84 * u, letterSpacing: "0.28em", textIndent: "0.28em", color: colors.goldSoft, textTransform: "uppercase" }}>
            {MONTHS_NOMINATIVE[lang][p.month - 1]}
          </div>
        </Rise>
        <Rise delay={64} duration={30}>
          <div style={{ fontFamily: fonts.serif, fontWeight: 300, fontSize: 64 * u, letterSpacing: "0.3em", textIndent: "0.3em", color: "rgba(243,234,216,0.75)", marginTop: 12 * u }}>{p.year}</div>
        </Rise>

        <GoldLine delay={84} width={300 * u} style={{ marginTop: 60 * u }} />
        <Rise delay={100} duration={30} style={{ marginTop: 46 * u }}>
          <div style={{ fontFamily: fonts.serifItalic, fontStyle: "italic", fontSize: 58 * u, color: colors.ivory }}>{time}</div>
        </Rise>

        {event.isPlaceholder ? (
          <Rise delay={130} duration={20} style={{ marginTop: 50 * u }}>
            <div style={{ fontFamily: fonts.sans, fontSize: 20 * u, letterSpacing: "0.2em", color: colors.mist, border: `1px dashed ${colors.gold}66`, padding: `${10 * u}px ${22 * u}px` }}>
              {t.hero.placeholderDate}
            </div>
          </Rise>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
