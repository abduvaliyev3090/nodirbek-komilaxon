import { weddingConfig } from "../../wedding.config";

export const FPS = 30;
export const DURATION_SECONDS = 40;
export const DURATION_FRAMES = FPS * DURATION_SECONDS; // 1200

/** The brief's structure, in seconds. Change a number here and the whole film re-times. */
export const SCENES = {
  opening: { from: 0, to: 5 }, //   atmospheric opening
  couple: { from: 5, to: 12 }, //   cinematic couple visuals
  details: { from: 12, to: 18 }, // romantic detail shots
  names: { from: 18, to: 25 }, //   couple names
  date: { from: 25, to: 32 }, //    wedding date
  message: { from: 32, to: 37 }, // invitation message
  closing: { from: 37, to: 40 }, // VOW FILMS closing
} as const;

/** Frames each scene overlaps the next one, so scenes cross-dissolve instead of cutting. */
export const CROSSFADE = 15;

export const sec = (s: number) => Math.round(s * FPS);

/** Images for the two photo scenes, taken from the website gallery (index 0-2 and 3-5). */
export function galleryImages() {
  const imgs = weddingConfig.gallery.images;
  const at = (i: number) => imgs[i % imgs.length].src;
  return {
    couple: [at(0), at(1), at(2)],
    details: [at(3), at(4), at(5)],
    hero: weddingConfig.hero.image,
    names: imgs.length > 6 ? imgs[6].src : weddingConfig.hero.image,
  };
}
