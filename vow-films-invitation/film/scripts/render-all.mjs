/**
 * Renders every language × format to film/out/.
 *
 *   npm run render                 → all 3 languages, vertical + landscape (6 files)
 *   npm run render -- uz           → only Uzbek
 *   npm run render -- uz vertical  → only Uzbek, vertical
 *
 * Needs: Node 20+, and `npm install` inside /film (Remotion downloads Chrome on first run).
 */
import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2).map((a) => a.toLowerCase());

const ALL_LANGS = ["uz", "ru", "en"];
const FORMATS = { vertical: "InvitationVertical", landscape: "InvitationLandscape" };

const langs = ALL_LANGS.filter((l) => args.length === 0 || args.includes(l) || !args.some((a) => ALL_LANGS.includes(a)));
const formats = Object.entries(FORMATS).filter(([k]) => !args.some((a) => a in FORMATS) || args.includes(k));

mkdirSync(join(root, "out"), { recursive: true });
let failed = 0;

for (const lang of langs) {
  for (const [format, compositionId] of formats) {
    const out = join("out", `invitation-${lang}-${format}.mp4`);
    // props go through a JSON file so quoting works the same on Windows, macOS and Linux
    const propsFile = join(tmpdir(), `vow-films-props-${lang}.json`);
    writeFileSync(propsFile, JSON.stringify({ lang }));

    console.log(`\n▶ Rendering ${out}`);
    const result = spawnSync(
      "npx",
      ["remotion", "render", "src/index.ts", compositionId, out, `--props=${propsFile}`, "--public-dir=../public", "--codec=h264", "--crf=18", "--pixel-format=yuv420p"],
      { cwd: root, stdio: "inherit", shell: process.platform === "win32" },
    );
    if (result.status !== 0) {
      failed++;
      console.error(`✗ ${out} failed`);
    }
  }
}

console.log(failed ? `\n${failed} render(s) failed.` : "\n✓ All films rendered to film/out/");
process.exit(failed ? 1 : 0);
