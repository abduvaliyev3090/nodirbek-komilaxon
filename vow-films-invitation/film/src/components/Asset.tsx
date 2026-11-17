import { Img, staticFile } from "remotion";
import type { CSSProperties } from "react";

/** Resolves "/images/x.svg" (from the website config) or an https URL into something Remotion can load. */
export function resolveAsset(path: string): string {
  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:")) return path;
  return staticFile(path.replace(/^\/+/, ""));
}

export function Asset({ src, style }: { src: string; style?: CSSProperties }) {
  return <Img src={resolveAsset(src)} style={{ width: "100%", height: "100%", objectFit: "cover", ...style }} />;
}
