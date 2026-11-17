"use client";

import { AnimatePresence, MotionConfig } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { weddingConfig } from "@wedding";
import { LanguageProvider, useLang } from "@/lib/language";
import { useMusic } from "@/lib/useMusic";
import { EnterScreen } from "./EnterScreen";
import { Header } from "./Header";
import { Hero } from "./sections/Hero";
import { Story } from "./sections/Story";
import { Gallery } from "./sections/Gallery";
import { Countdown } from "./sections/Countdown";
import { EventDetails } from "./sections/EventDetails";
import { Rsvp } from "./sections/Rsvp";
import { Closing } from "./sections/Closing";

function Experience() {
  const { t } = useLang();
  const [entered, setEntered] = useState(false);
  const music = useMusic(weddingConfig.music.src, weddingConfig.music.volume);
  const startMusic = music.start;

  // Lock scrolling behind the opening screen.
  useEffect(() => {
    document.body.style.overflow = entered ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [entered]);

  const handleEnter = useCallback(
    (withSound: boolean) => {
      // Must run synchronously inside the click handler so the browser allows audio.
      if (withSound) void startMusic();
      setEntered(true);
      window.scrollTo(0, 0);
    },
    [startMusic],
  );

  return (
    <>
      <a
        href="#content"
        className="focus-ring fixed left-4 top-4 z-[70] -translate-y-24 bg-ink px-4 py-3 text-sm text-gold-soft focus:translate-y-0"
      >
        {t.common.skipToContent}
      </a>

      <Header visible={entered} musicState={music.state} onToggleMusic={music.toggle} />

      <main id="content" inert={!entered ? true : undefined}>
        <Hero entered={entered} />
        <Story />
        <Gallery />
        <Countdown />
        <EventDetails />
        <Rsvp />
        <Closing />
      </main>

      <AnimatePresence>{!entered ? <EnterScreen key="intro" onEnter={handleEnter} /> : null}</AnimatePresence>

      <div className="film-grain" aria-hidden="true" />
    </>
  );
}

export function InvitationExperience() {
  return (
    <LanguageProvider>
      {/* reducedMotion="user" → Framer Motion drops transform animations when the OS asks for less motion */}
      <MotionConfig reducedMotion="user">
        <Experience />
      </MotionConfig>
    </LanguageProvider>
  );
}
