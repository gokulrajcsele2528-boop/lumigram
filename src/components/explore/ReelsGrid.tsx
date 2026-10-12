"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { ReelItem } from "@/lib/mockData";
import { ReelViewerModal } from "./ReelViewerModal";

interface ReelsGridProps {
  reels: ReelItem[];
}

export const ReelsGrid: React.FC<ReelsGridProps> = ({ reels }) => {
  const [activeReelIndex, setActiveReelIndex] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 sm:gap-3">
        {reels.map((reel, index) => (
          <div
            key={reel.id}
            onClick={() => setActiveReelIndex(index)}
            className="relative aspect-[9/16] group cursor-pointer overflow-hidden rounded-md bg-[#121212] border border-[#1f1f1f] hover:border-[#333333] transition-all"
          >
            {/* Thumbnail */}
            <Image
              src={reel.thumbnailUrl}
              alt={reel.caption || "Reel"}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Subtle Gradient Shadow */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

            {/* Top Right Duration Tag */}
            <div className="absolute top-2.5 right-2.5 z-10 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[11px] font-semibold text-white">
              {reel.duration}s
            </div>

            {/* Bottom Info: Views & Author */}
            <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-col gap-1 text-white">
              <div className="flex items-center gap-1.5 text-xs font-semibold drop-shadow">
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{reel.viewsCount.toLocaleString()}</span>
              </div>
              <p className="text-xs text-neutral-300 truncate font-normal">
                @{reel.author.username}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Full-screen Reels Viewer Modal */}
      {activeReelIndex !== null && (
        <ReelViewerModal
          reels={reels}
          initialIndex={activeReelIndex}
          onClose={() => setActiveReelIndex(null)}
        />
      )}
    </>
  );
};

export default ReelsGrid;
