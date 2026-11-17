function icsDate(ms: number): string {
  return new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function icsEscape(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

export interface IcsInput {
  title: string;
  startMs: number;
  durationHours: number;
  location: string;
  description?: string;
  url?: string;
}

export function buildIcs({ title, startMs, durationHours, location, description, url }: IcsInput): string {
  const endMs = startMs + durationHours * 3_600_000;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//VOW FILMS//Eternal Love//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${startMs}@vowfilms.invitation`,
    `DTSTAMP:${icsDate(Date.now())}`,
    `DTSTART:${icsDate(startMs)}`,
    `DTEND:${icsDate(endMs)}`,
    `SUMMARY:${icsEscape(title)}`,
    `LOCATION:${icsEscape(location)}`,
    ...(description ? [`DESCRIPTION:${icsEscape(description)}`] : []),
    ...(url ? [`URL:${url}`] : []),
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}

export function downloadIcs(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const href = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(href), 1000);
}
