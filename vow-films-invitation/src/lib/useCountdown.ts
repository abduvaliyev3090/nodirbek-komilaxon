"use client";

import { useEffect, useState } from "react";

export interface CountdownState {
  /** false until mounted on the client (avoids a server/client mismatch). */
  ready: boolean;
  valid: boolean;
  arrived: boolean;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const INITIAL: CountdownState = { ready: false, valid: true, arrived: false, days: 0, hours: 0, minutes: 0, seconds: 0 };

function compute(targetMs: number): CountdownState {
  if (Number.isNaN(targetMs)) return { ...INITIAL, ready: true, valid: false };
  const diff = targetMs - Date.now();
  if (diff <= 0) return { ...INITIAL, ready: true, arrived: true };
  const total = Math.floor(diff / 1000);
  return {
    ready: true,
    valid: true,
    arrived: false,
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

export function useCountdown(iso: string): CountdownState {
  const [state, setState] = useState<CountdownState>(INITIAL);

  useEffect(() => {
    const target = Date.parse(iso);
    setState(compute(target));
    const id = window.setInterval(() => setState(compute(target)), 1000);
    return () => window.clearInterval(id);
  }, [iso]);

  return state;
}
