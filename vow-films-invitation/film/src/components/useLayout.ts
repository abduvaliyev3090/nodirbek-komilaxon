import { useVideoConfig } from "remotion";

/** One place to decide how big things are, for both 1080×1920 (vertical) and 1920×1080 (landscape). */
export function useLayout() {
  const { width, height } = useVideoConfig();
  const portrait = height > width;
  /** 1 unit = 1px on a 1080-wide design; scales type and spacing together. */
  const u = Math.min(width, height) / 1080;
  return { width, height, portrait, u };
}
