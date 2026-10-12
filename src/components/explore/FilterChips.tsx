"use client";

import React from "react";
import { TrendingUp, Clock, Image as ImageIcon, Video as VideoIcon, Users } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { ExploreTabType } from "./ExploreTabBar";

interface FilterChipsProps {
  activeTab: ExploreTabType;
  filter: string;
  onFilterChange: (f: string) => void;
  selectedTopic: string;
  onTopicChange: (topic: string) => void;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  activeTab,
  filter,
  onFilterChange,
  selectedTopic,
  onTopicChange,
}) => {
  const { t } = useLanguage();

  const filterOptions = [
    { id: "trending", label: t.trending, icon: TrendingUp },
    { id: "latest", label: t.latest, icon: Clock },
    ...(activeTab === "all" || activeTab === "posts"
      ? [
          { id: "photos", label: t.photos, icon: ImageIcon },
          { id: "videos", label: t.videos, icon: VideoIcon },
        ]
      : []),
    { id: "following", label: t.following, icon: Users },
  ];

  const topics = [
    "All",
    "Food",
    "Travel",
    "Tech",
    "Music",
    "Sports",
    "Art",
    "Fashion",
    "Memes",
  ];

  return (
    <div className="flex flex-col gap-2.5 py-1">
      {/* Primary Filter Options */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        {filterOptions.map((opt) => {
          const Icon = opt.icon;
          const isActive = filter === opt.id;

          return (
            <button
              key={opt.id}
              onClick={() => onFilterChange(opt.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                isActive
                  ? "bg-white text-black font-semibold"
                  : "bg-[#181818] text-[#a8a8a8] hover:text-white hover:bg-[#222222]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>

      {/* Topic Category Row */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {topics.map((tpc) => {
          const isTopicActive =
            (selectedTopic === "" && tpc === "All") || selectedTopic === tpc;
          const displayLabel =
            t.topics[tpc as keyof typeof t.topics] || tpc;

          return (
            <button
              key={tpc}
              onClick={() => onTopicChange(tpc === "All" ? "" : tpc)}
              className={`px-3 py-1 rounded-full text-xs transition-colors shrink-0 ${
                isTopicActive
                  ? "bg-[#333333] text-white font-medium border border-[#444444]"
                  : "bg-transparent text-[#8e8e8e] hover:text-white hover:bg-[#141414] border border-[#222222]"
              }`}
            >
              {displayLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FilterChips;
