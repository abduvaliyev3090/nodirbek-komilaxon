import { Composition } from "remotion";
import { Film, type FilmProps } from "./Film";
import { DURATION_FRAMES, FPS } from "./timing";
import { weddingConfig } from "../../wedding.config";

const defaultProps: FilmProps = { lang: weddingConfig.languages.default };

export const RemotionRoot: React.FC = () => (
  <>
    {/* 9:16 — Instagram / Telegram / WhatsApp Stories, Reels, TikTok */}
    <Composition id="InvitationVertical" component={Film} durationInFrames={DURATION_FRAMES} fps={FPS} width={1080} height={1920} defaultProps={defaultProps} />
    {/* 16:9 — YouTube, projector, website embed */}
    <Composition id="InvitationLandscape" component={Film} durationInFrames={DURATION_FRAMES} fps={FPS} width={1920} height={1080} defaultProps={defaultProps} />
  </>
);
