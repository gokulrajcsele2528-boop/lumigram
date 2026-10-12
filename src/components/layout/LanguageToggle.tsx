"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Languages } from "lucide-react";

export const LanguageToggle: React.FC = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-[#1f1f1f] hover:bg-[#2e2e2e] text-neutral-200 border border-[#333333] transition-colors"
      title="Switch Language / மொழியை மாற்றுக"
    >
      <Languages className="w-3.5 h-3.5 text-[#0095f6]" />
      <span>{language === "en" ? "தமிழ்" : "English"}</span>
    </button>
  );
};

export default LanguageToggle;
