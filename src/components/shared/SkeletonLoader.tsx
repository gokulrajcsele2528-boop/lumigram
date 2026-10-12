import React from "react";
import { ExploreTabType } from "../explore/ExploreTabBar";

interface SkeletonLoaderProps {
  type: ExploreTabType;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type }) => {
  if (type === "reels") {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[9/16] rounded-md bg-[#181818] animate-pulse relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-2">
              <div className="h-3 w-16 bg-[#262626] rounded" />
              <div className="h-3 w-28 bg-[#262626] rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "stories") {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4 overflow-x-auto py-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 shrink-0">
              <div className="w-18 h-18 rounded-full bg-[#1e1e1e] animate-pulse" />
              <div className="w-12 h-2.5 bg-[#1e1e1e] rounded" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-md bg-[#181818] animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  // "posts" or "all" default 3-column square grid
  return (
    <div className="grid grid-cols-3 gap-1 sm:gap-4">
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className="aspect-square bg-[#181818] rounded-none sm:rounded-sm animate-pulse"
        />
      ))}
    </div>
  );
};

export default SkeletonLoader;
