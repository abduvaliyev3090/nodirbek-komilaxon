import { AbsoluteFill, Audio, Sequence, interpolate, useCurrentFrame } from "remotion";
import { weddingConfig, type Lang } from "../../wedding.config";
import { resolveAsset } from "./components/Asset";
import { FilmFinish, useSceneOpacity } from "./components/Overlays";
import { ClosingScene } from "./scenes/Closing";
import { DateScene } from "./scenes/DateScene";
import { Message } from "./scenes/Message";
import { Names } from "./scenes/Names";
import { Opening } from "./scenes/Opening";
import { PhotoScene } from "./scenes/PhotoScene";
import { CROSSFADE, DURATION_FRAMES, SCENES, galleryImages, sec } from "./timing";

export type FilmProps = { lang: Lang };

/** Wraps a scene in a Sequence with a cross-dissolve into/out of its neighbours. */
function Scene({
  from,
  to,
  isFirst = false,
  isLast = false,
  children,
}: {
  from: number;
  to: number;
  isFirst?: boolean;
  isLast?: boolean;
  children: (duration: number) => React.ReactNode;
}) {
  const start = sec(from);
  // every scene except the last runs CROSSFADE frames into the next one
  const duration = sec(to - from) + (isLast ? 0 : CROSSFADE);
  return (
    <Sequence from={start} durationInFrames={duration}>
      <Faded duration={duration} fadeIn={isFirst ? 0 : CROSSFADE} fadeOut={isLast ? 0 : CROSSFADE}>
        {children(duration)}
      </Faded>
    </Sequence>
  );
}

function Faded({ duration, fadeIn, fadeOut, children }: { duration: number; fadeIn: number; fadeOut: number; children: React.ReactNode }) {
  const opacity = useSceneOpacity(duration, fadeIn, fadeOut);
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
}

/**
 * The 40-second film.  Everything on screen comes from ../wedding.config.ts:
 * names, date, time, venue, address, images and the invitation message.
 */
export const Film: React.FC<FilmProps> = ({ lang }) => {
  const frame = useCurrentFrame();
  const imgs = galleryImages();
  const audioSrc = weddingConfig.film.audioSrc;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {audioSrc ? (
        <Audio
          src={resolveAsset(audioSrc)}
          volume={interpolate(frame, [0, 30, DURATION_FRAMES - 60, DURATION_FRAMES], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        />
      ) : null}

      <Scene {...SCENES.opening} isFirst>
        {(d) => <Opening lang={lang} duration={d} />}
      </Scene>
      <Scene {...SCENES.couple}>{(d) => <PhotoScene images={imgs.couple} duration={d} variant="couple" />}</Scene>
      <Scene {...SCENES.details}>{(d) => <PhotoScene images={imgs.details} duration={d} variant="details" />}</Scene>
      <Scene {...SCENES.names}>{(d) => <Names lang={lang} duration={d} />}</Scene>
      <Scene {...SCENES.date}>{(d) => <DateScene lang={lang} duration={d} />}</Scene>
      <Scene {...SCENES.message}>{(d) => <Message lang={lang} duration={d} />}</Scene>
      <Scene {...SCENES.closing} isLast>
        {(d) => <ClosingScene lang={lang} duration={d} />}
      </Scene>

      <FilmFinish grain={weddingConfig.theme.grain + 0.02} />
    </AbsoluteFill>
  );
};
