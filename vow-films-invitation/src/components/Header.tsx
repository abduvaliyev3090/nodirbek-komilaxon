"use client";

import { motion } from "framer-motion";
import { weddingConfig } from "@wedding";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { MusicToggle } from "@/components/ui/MusicToggle";
import type { MusicState } from "@/lib/useMusic";

export function Header({ visible, musicState, onToggleMusic }: { visible: boolean; musicState: MusicState; onToggleMusic: () => void }) {
  return (
    <motion.header
      className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between bg-gradient-to-b from-ink/80 to-transparent px-4 pb-6 pt-2 sm:px-10"
      initial={false}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -12 }}
      transition={{ duration: 1, delay: visible ? 0.8 : 0 }}
      aria-hidden={!visible}
    >
      <span className="pointer-events-auto font-sans text-[0.62rem] uppercase tracking-cine text-ivory/70">
        {weddingConfig.brand.name}
      </span>
      <div className="pointer-events-auto flex items-center" inert={!visible ? true : undefined}>
        <LanguageSwitcher />
        <MusicToggle state={musicState} onToggle={onToggleMusic} />
      </div>
    </motion.header>
  );
}
