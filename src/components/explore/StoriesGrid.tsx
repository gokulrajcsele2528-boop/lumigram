"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CircleDashed, Flame, Sparkles } from "lucide-react";
import { StoryItem } from "@/lib/mockData";
import { StoryViewerModal } from "./StoryViewerModal";
import { useLanguage } from "@/context/LanguageContext";

interface StoriesGridProps {
  stories: StoryItem[];
}

export const StoriesGrid: React.FC<StoriesGridProps> = ({ stories }) => {
  const { t } = useLanguage();
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);

  return (
    <>
      <div className="flex flex-col gap-8">
        {/* Top: Horizontal Story Rings */}
        <div>
          <div className="flex items-center gap-2 mb-3 px-1 text-sm font-semibold text-neutral-300">
            <Flame className="w-4 h-4 text-[#fa586a]" />
            <span>{t.storiesForYou}</span>
          </div>

          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-2 px-1">
            {stories.map((story, index) => {
              const isSeen = story.seen;

              return (
                <button
                  key={story.id}
                  onClick={() => setActiveStoryIndex(index)}
                  className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
                >
                  {/* Story Avatar Ring */}
                  <div
                    className={`p-[2.5px] rounded-full transition-transform duration-200 group-hover:scale-105 ${
                      isSeen
                        ? "border-2 border-[#383838]"
                        : "bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]"
                    }`}
                  >
                    <div className="p-0.5 bg-black rounded-full">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden">
                        <Image
                          src={story.author.avatar}
                          alt={story.author.username}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Username */}
                  <span className="text-xs text-neutral-300 group-hover:text-white max-w-[70px] truncate text-center">
                    {story.author.username}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom: Story Highlights Grid */}
        <div>
          <div className="flex items-center gap-2 mb-3 px-1 text-sm font-semibold text-neutral-300">
            <Sparkles className="w-4 h-4 text-[#0095f6]" />
            <span>{t.highlights}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
            {stories.map((story, index) => (
              <div
                key={story.id}
                onClick={() => setActiveStoryIndex(index)}
                className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer bg-[#181818] border border-[#222222]"
              >
                <Image
                  src={story.media.url}
                  alt={story.caption || "Story"}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 text-white">
                  <div className="relative w-6 h-6 rounded-full overflow-hidden border border-white/60 shrink-0">
                    <Image
                      src={story.author.avatar}
                      alt={story.author.username}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-xs font-medium truncate">
                    {story.author.username}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full-screen Story Viewer Modal */}
      {activeStoryIndex !== null && (
        <StoryViewerModal
          stories={stories}
          initialIndex={activeStoryIndex}
          onClose={() => setActiveStoryIndex(null)}
        />
      )}
    </>
  );
};

export default StoriesGrid;
