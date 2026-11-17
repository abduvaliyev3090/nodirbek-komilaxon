import { loadFont as loadSerif } from "@remotion/google-fonts/CormorantGaramond";
import { loadFont as loadSans } from "@remotion/google-fonts/Manrope";
import { weddingConfig } from "../../wedding.config";

// Same families as the website, with Cyrillic + Latin-extended so Russian and Uzbek render correctly.
const serif = loadSerif("normal", { weights: ["300", "400", "500"], subsets: ["latin", "latin-ext", "cyrillic"] });
const serifItalic = loadSerif("italic", { weights: ["300", "400"], subsets: ["latin", "latin-ext", "cyrillic"] });
const sans = loadSans("normal", { weights: ["300", "400", "500"], subsets: ["latin", "latin-ext", "cyrillic"] });

export const fonts = {
  serif: serif.fontFamily,
  serifItalic: serifItalic.fontFamily,
  sans: sans.fontFamily,
};

export const colors = weddingConfig.theme.colors;
