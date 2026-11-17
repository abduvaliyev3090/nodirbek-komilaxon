/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  VOW FILMS · ETERNAL LOVE — the ONE file you edit for each wedding.
 * ─────────────────────────────────────────────────────────────────────────────
 *  Both the website (Next.js) and the 40-second film (Remotion, /film) read
 *  this file. Change something here and both products update.
 *
 *  Anything wrapped in [ square brackets ] is an obvious PLACEHOLDER — it is
 *  not real wedding information. Replace it before sending to guests.
 *  Search this file for "REPLACE" to find every item that needs real data.
 *
 *  Keep this file free of framework imports (no React / Next) so that the
 *  Remotion project can import it too.
 */

export type Lang = "uz" | "ru" | "en";
export type Localized<T = string> = Record<Lang, T>;

export interface GalleryImage {
  /** Path inside /public, or an absolute https URL. */
  src: string;
  alt: Localized;
  width: number;
  height: number;
}

export interface WeddingConfig {
  brand: { name: string; collection: string; tagline: Localized };
  couple: { first: string; second: string };
  languages: {
    default: Lang;
    enabled: Lang[];
    labels: Record<Lang, { short: string; native: string }>;
  };
  event: {
    /** ISO 8601 with offset. Drives the countdown, the date text, the calendar file and the film. */
    dateTime: string;
    /** IANA time zone the wedding takes place in. */
    timeZone: string;
    /** true  → shows a small "placeholder date" note. Set to false once the real date is entered. */
    isPlaceholder: boolean;
    /** Used for the "Add to calendar" file. */
    durationHours: number;
    venue: { name: Localized; address: Localized };
    /** Google Maps link (a share link, a /dir/ link or a search link all work). */
    mapUrl: string;
  };
  hero: {
    image: string;
    /** Optional looping background video (muted). Leave "" to use the photograph only. */
    video: string;
    invite: Localized;
  };
  story: {
    lead: Localized;
    chapters: { title: Localized; text: Localized }[];
  };
  gallery: {
    /** true → shows a small "placeholder photo" tag on every image. Set false once real photos are in. */
    arePlaceholders: boolean;
    images: GalleryImage[];
  };
  closing: { message: Localized; signature: string };
  film: {
    /** Short line used in the film's "invitation message" scene (32–37 s). */
    inviteMessage: Localized;
    /** Optional music file inside /public for the film. Leave "" for a silent render. */
    audioSrc: string;
  };
  rsvp: { maxGuests: number };
  music: {
    /** Website background music (inside /public). Starts ONLY after the visitor clicks. */
    src: string;
    volume: number;
  };
  theme: {
    colors: {
      ink: string;
      ivory: string;
      gold: string;
      goldSoft: string;
      mist: string;
    };
    /** 0 – 0.2 : strength of the film-grain overlay. */
    grain: number;
  };
}

export const weddingConfig: WeddingConfig = {
  brand: {
    name: "VOW FILMS",
    collection: "ETERNAL LOVE",
    tagline: {
      uz: "Yulduzlarda yozilgan hikoya.",
      ru: "История, написанная звёздами.",
      en: "A story written in the stars.",
    },
  },

  couple: { first: "Nodirbek", second: "Komilaxon" },

  languages: {
    default: "uz",
    enabled: ["uz", "ru", "en"],
    labels: {
      uz: { short: "UZ", native: "Oʻzbekcha" },
      ru: { short: "RU", native: "Русский" },
      en: { short: "EN", native: "English" },
    },
  },

  event: {
    // REPLACE — placeholder date (Sunday, 20 June 2027, 17:00 Tashkent time).
    dateTime: "2027-06-20T17:00:00+05:00",
    timeZone: "Asia/Tashkent",
    isPlaceholder: true,
    durationHours: 5,
    venue: {
      // REPLACE
      name: {
        uz: "[ To'yxona nomi ]",
        ru: "[ Название площадки ]",
        en: "[ Venue name ]",
      },
      // REPLACE
      address: {
        uz: "[ Manzil: shahar, ko'cha, uy ]",
        ru: "[ Адрес: город, улица, дом ]",
        en: "[ Address: city, street, number ]",
      },
    },
    // REPLACE — placeholder opens Google Maps. Paste the venue's real link here.
    mapUrl: "https://www.google.com/maps",
  },

  hero: {
    image: "/images/placeholder-hero.svg",
    video: "",
    invite: {
      uz: "Sizni to'yimizga taklif etamiz",
      ru: "Приглашаем вас на нашу свадьбу",
      en: "We invite you to our wedding",
    },
  },

  // REPLACE — neutral placeholder story. Write the couple's real story here.
  story: {
    lead: {
      uz: "Ba'zi hikoyalar ikki inson uchrashmasdan oldin boshlanadi — yulduzlar ularni allaqachon bir yo'lga yozib qo'ygan bo'ladi.",
      ru: "Некоторые истории начинаются ещё до встречи двух людей — звёзды уже вписали их в одну дорогу.",
      en: "Some stories begin before two people ever meet — the stars have already written them onto one road.",
    },
    chapters: [
      {
        title: { uz: "Boshlanish", ru: "Начало", en: "The Beginning" },
        text: {
          uz: "Ikki yo'l bir-biriga yaqinlashdi va dunyo sekin-asta o'zgara boshladi.",
          ru: "Две дороги сошлись, и мир медленно стал другим.",
          en: "Two paths drew closer, and the world slowly began to change.",
        },
      },
      {
        title: { uz: "Birgalikda", ru: "Вместе", en: "Together" },
        text: {
          uz: "Kichik lahzalar, samimiy so'zlar va jim tushunish — shulardan bizning uyimiz boshlandi.",
          ru: "Маленькие мгновения, тёплые слова и тихое понимание — так начался наш дом.",
          en: "Small moments, honest words and quiet understanding — this is where our home began.",
        },
      },
      {
        title: { uz: "Abadiylik", ru: "Навсегда", en: "Forever" },
        text: {
          uz: "Endi biz bu hikoyaning eng muhim sahifasini aziz insonlarimiz bilan birga ochmoqchimiz.",
          ru: "Теперь мы хотим открыть самую важную страницу этой истории вместе с самыми близкими.",
          en: "Now we want to open the most important page of this story together with the people we love.",
        },
      },
    ],
  },

  gallery: {
    // REPLACE — swap the SVG placeholders for real photographs (keep 6+ images; the film uses the first six).
    arePlaceholders: true,
    images: [
      {
        src: "/images/placeholder-01.svg",
        width: 1200,
        height: 1600,
        alt: { uz: "Namunaviy kadr: iliq nurli kamar", ru: "Пример кадра: арка с тёплым светом", en: "Placeholder frame: an arch of warm light" },
      },
      {
        src: "/images/placeholder-02.svg",
        width: 1600,
        height: 1200,
        alt: { uz: "Namunaviy kadr: oltin bokeh chiroqlari", ru: "Пример кадра: золотые огни боке", en: "Placeholder frame: golden bokeh lights" },
      },
      {
        src: "/images/placeholder-03.svg",
        width: 1200,
        height: 1500,
        alt: { uz: "Namunaviy kadr: sham yorug'liklari", ru: "Пример кадра: свет свечей", en: "Placeholder frame: candlelight" },
      },
      {
        src: "/images/placeholder-04.svg",
        width: 1200,
        height: 1600,
        alt: { uz: "Namunaviy kadr: mato burmalari", ru: "Пример кадра: складки ткани", en: "Placeholder frame: folds of fabric" },
      },
      {
        src: "/images/placeholder-05.svg",
        width: 1200,
        height: 1200,
        alt: { uz: "Namunaviy kadr: ikki oltin halqa", ru: "Пример кадра: два золотых кольца", en: "Placeholder frame: two golden rings" },
      },
      {
        src: "/images/placeholder-06.svg",
        width: 1600,
        height: 1100,
        alt: { uz: "Namunaviy kadr: yulduzlar turkumi", ru: "Пример кадра: созвездие", en: "Placeholder frame: a constellation" },
      },
      {
        src: "/images/placeholder-07.svg",
        width: 1200,
        height: 1500,
        alt: { uz: "Namunaviy kadr: kechki qumtepalar", ru: "Пример кадра: дюны на закате", en: "Placeholder frame: dunes at dusk" },
      },
      {
        src: "/images/placeholder-08.svg",
        width: 1200,
        height: 1600,
        alt: { uz: "Namunaviy kadr: atirgul rangli bokeh", ru: "Пример кадра: розово-золотое боке", en: "Placeholder frame: rose-gold bokeh" },
      },
    ],
  },

  closing: {
    message: {
      uz: "Hayotimizning eng baxtli kunini siz bilan baham ko'rish biz uchun katta sharaf. Sizni to'yimizda ko'rishdan xursand bo'lamiz.",
      ru: "Для нас большая честь разделить с вами самый счастливый день нашей жизни. Будем счастливы видеть вас на нашей свадьбе.",
      en: "It would be an honour to share the happiest day of our lives with you. We would be delighted to celebrate with you.",
    },
    signature: "Nodirbek & Komilaxon",
  },

  film: {
    inviteMessage: {
      uz: "Sizni hayotimizning eng baxtli kunida ko'rishni orzu qilamiz.",
      ru: "Мы мечтаем увидеть вас в самый счастливый день нашей жизни.",
      en: "We would love to have you with us on the happiest day of our lives.",
    },
    audioSrc: "",
  },

  rsvp: { maxGuests: 6 },

  music: {
    // REPLACE — add a licensed track at public/audio/invitation-theme.mp3. If the file is missing the music button hides itself.
    src: "/audio/invitation-theme.mp3",
    volume: 0.55,
  },

  theme: {
    colors: {
      ink: "#070605",
      ivory: "#f3ead8",
      gold: "#c9a96a",
      goldSoft: "#e6d3a3",
      mist: "#a79f8f",
    },
    grain: 0.07,
  },
};
