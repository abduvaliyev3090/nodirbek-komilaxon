"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type MusicState = "idle" | "playing" | "paused" | "unavailable";

/**
 * Background music controller.
 *
 * Nothing is created, loaded or played until `start()` / `toggle()` is called —
 * and those must only be called from a click/tap handler. That is what keeps
 * browsers happy and respects the visitor: music never starts on its own.
 */
export function useMusic(src: string, targetVolume: number) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<number | null>(null);
  const resumeOnVisible = useRef(false);
  const [state, setState] = useState<MusicState>(src ? "idle" : "unavailable");

  const clearFade = () => {
    if (fadeRef.current !== null) {
      window.clearInterval(fadeRef.current);
      fadeRef.current = null;
    }
  };

  const fadeTo = useCallback((audio: HTMLAudioElement, target: number, done?: () => void) => {
    clearFade();
    fadeRef.current = window.setInterval(() => {
      const delta = target - audio.volume;
      if (Math.abs(delta) < 0.03) {
        audio.volume = Math.max(0, Math.min(1, target));
        clearFade();
        done?.();
        return;
      }
      audio.volume = Math.max(0, Math.min(1, audio.volume + Math.sign(delta) * 0.03));
    }, 60);
  }, []);

  const start = useCallback(async (): Promise<boolean> => {
    if (!src) return false;
    try {
      let audio = audioRef.current;
      if (!audio) {
        audio = new Audio(src);
        audio.loop = true;
        audio.preload = "auto";
        audio.volume = 0;
        audio.addEventListener("error", () => setState("unavailable"));
        audioRef.current = audio;
      }
      await audio.play();
      setState("playing");
      fadeTo(audio, targetVolume);
      return true;
    } catch {
      // Missing file, unsupported format or blocked playback → hide the control gracefully.
      setState("unavailable");
      return false;
    }
  }, [src, targetVolume, fadeTo]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setState("paused");
    fadeTo(audio, 0, () => audio.pause());
  }, [fadeTo]);

  const toggle = useCallback(() => {
    if (state === "playing") pause();
    else if (state === "idle" || state === "paused") void start();
  }, [state, pause, start]);

  // Pause while the tab is hidden, resume when it returns (only if it was playing).
  useEffect(() => {
    const onVisibility = () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (document.hidden && !audio.paused) {
        resumeOnVisible.current = true;
        audio.pause();
      } else if (!document.hidden && resumeOnVisible.current) {
        resumeOnVisible.current = false;
        void audio.play().catch(() => undefined);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(
    () => () => {
      clearFade();
      audioRef.current?.pause();
      audioRef.current = null;
    },
    [],
  );

  return { state, start, toggle };
}
