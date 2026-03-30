import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";

const LanguageToggle = () => {
  const { lang, setLang } = useLanguage();

  return (
    <button
      onClick={() => setLang(lang === "en" ? "ar" : "en")}
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-full hover:bg-muted/50 transition-colors"
      aria-label="Toggle language"
    >
      <Globe className="w-3.5 h-3.5" />
      {lang === "en" ? "العربية" : "English"}
    </button>
  );
};

export default LanguageToggle;
