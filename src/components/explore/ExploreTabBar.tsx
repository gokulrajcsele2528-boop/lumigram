"use client";

import React, { useRef, useEffect } from "react";
import { Sparkles, Grid3X3, Film, CircleDashed } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export type ExploreTabType = "all" | "posts" | "reels" | "stories";

interface ExploreTabBarProps {
  activeTab: ExploreTabType;
  onTabChange: (tab: ExploreTabType) => void;
}

export const ExploreTabBar: React.FC<ExploreTabBarProps> = ({
  activeTab,
  onTabChange,
}) => {
  const { t } = useLanguage();
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const tabs: Array<{
    id: ExploreTabType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: "all", label: t.all, icon: Sparkles },
    { id: "posts", label: t.posts, icon: Grid3X3 },
    { id: "reels", label: t.reels, icon: Film },
    { id: "stories", label: t.stories, icon: CircleDashed },
  ];

  // Keyboard navigation support for tabs (ArrowLeft, ArrowRight)
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index;
    if (e.key === "ArrowRight") {
      nextIndex = (index + 1) % tabs.length;
      e.preventDefault();
    } else if (e.key === "ArrowLeft") {
      nextIndex = (index - 1 + tabs.length) % tabs.length;
      e.preventDefault();
    }

    if (nextIndex !== index) {
      const nextTab = tabs[nextIndex].id;
      onTabChange(nextTab);
      tabsRef.current[nextIndex]?.focus();
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Explore media type filters"
      className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 px-1 select-none scroll-smooth"
    >
      {tabs.map((tab, idx) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            ref={(el) => {
              tabsRef.current[idx] = el;
            }}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onTabChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-200 shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${
              isActive
                ? "bg-[#262626] text-white font-semibold shadow-sm border border-[#383838]"
                : "text-[#a8a8a8] hover:text-white hover:bg-[#181818] border border-transparent"
            }`}
          >
            <Icon
              className={`w-4 h-4 transition-transform duration-200 ${
                isActive ? "text-white scale-110" : "text-[#8e8e8e]"
              }`}
            />
            <span className="capitalize">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ExploreTabBar;
