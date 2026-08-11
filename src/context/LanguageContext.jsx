import { createContext, useContext, useEffect, useMemo, useState } from "react";

const LanguageContext = createContext(null);

const copy = {
  en: {
    catalogue: "Catalogue",
    projects: "Projects",
    discover: "Shop by craft",
    gallery: "Gallery",
    about: "About",
    guides: "Guides",
    contact: "Contact",
    search: "Search materials",
    searchHint: "Yarn, macrame, project, shade or craft",
    wishlist: "Wishlist",
    enquiry: "Enquiry list",
    whatsapp: "WhatsApp",
    menu: "Menu",
    close: "Close",
    allIndia: "All-India delivery",
    wholesale: "Wholesale enquiries welcome",
    shades: "Shade cards on WhatsApp",
  },
  hi: {
    catalogue: "कैटलॉग",
    projects: "प्रोजेक्ट्स",
    discover: "क्राफ्ट से खोजें",
    gallery: "गैलरी",
    about: "हमारे बारे में",
    guides: "गाइड",
    contact: "संपर्क",
    search: "सामग्री खोजें",
    searchHint: "यार्न, मैक्रेमे, प्रोजेक्ट, शेड या क्राफ्ट",
    wishlist: "पसंद",
    enquiry: "पूछताछ सूची",
    whatsapp: "व्हाट्सऐप",
    menu: "मेन्यू",
    close: "बंद करें",
    allIndia: "पूरे भारत में डिलीवरी",
    wholesale: "थोक पूछताछ का स्वागत है",
    shades: "व्हाट्सऐप पर शेड कार्ड",
  },
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    if (typeof window === "undefined") return "en";
    return window.localStorage.getItem("fakhri-language") === "hi" ? "hi" : "en";
  });

  useEffect(() => {
    window.localStorage.setItem("fakhri-language", language);
    document.documentElement.lang = language === "hi" ? "hi" : "en";
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: (key) => copy[language][key] || copy.en[key] || key,
    }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
