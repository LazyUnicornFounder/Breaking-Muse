import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type Language = "en" | "ar";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    tagline: "Turn today's news into your next startup idea.",
    searchPlaceholder: "Search ideas...",
    noIdeas: "No ideas found.",
    viewArchive: "View previous days' ideas",
    regenerating: "Regenerating ideas... this may take a few minutes.",
    backToToday: "Back to today",
    ideaArchive: "Idea Archive",
    archiveSubtitle: "Previous days' business ideas from the news",
    archiveEmpty: "Archive will start filling soon.",
    ideas: "ideas",
    previousIdeasToday: "Previous ideas today",
    more: "More",
    source: "Source",
    all: "All",
  },
  ar: {
    tagline: "حوّل أخبار اليوم إلى فكرة شركتك الناشئة القادمة.",
    searchPlaceholder: "ابحث عن أفكار...",
    noIdeas: "لم يتم العثور على أفكار.",
    viewArchive: "عرض أفكار الأيام السابقة",
    regenerating: "جارٍ إعادة توليد الأفكار... قد يستغرق ذلك بضع دقائق.",
    backToToday: "العودة إلى اليوم",
    ideaArchive: "أرشيف الأفكار",
    archiveSubtitle: "أفكار الأعمال من الأخبار للأيام السابقة",
    archiveEmpty: "سيبدأ الأرشيف بالامتلاء قريباً.",
    ideas: "أفكار",
    previousIdeasToday: "أفكار سابقة اليوم",
    more: "المزيد",
    source: "المصدر",
    all: "الكل",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem("bm-lang") as Language) || "en";
  });

  const setLang = (l: Language) => {
    setLangState(l);
    localStorage.setItem("bm-lang", l);
  };

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key: string) => translations[lang]?.[key] || translations.en[key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir: lang === "ar" ? "rtl" : "ltr" }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
