"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Play, Copy, Heart, MessageCircle } from "lucide-react";
import { ExploreItem, PostItem, ReelItem } from "@/lib/mockData";
import { PostModal } from "./PostModal";
import { ReelViewerModal } from "./ReelViewerModal";

interface AllGridProps {
  items: ExploreItem[];
}

export const AllGrid: React.FC<AllGridProps> = ({ items }) => {
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);
  const [selectedReelIndex, setSelectedReelIndex] = useState<number | null>(null);

  const reels = items.filter((item): item is ReelItem => item.type === "reel");

  const handleItemClick = (item: ExploreItem) => {
    if (item.type === "post") {
      setSelectedPost(item);
    } else if (item.type === "reel") {
      const idx = reels.findIndex((r) => r.id === item.id);
      setSelectedReelIndex(idx >= 0 ? idx : 0);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-4">
        {items.map((item) => {
          const isReel = item.type === "reel";
          const isPost = item.type === "post";
          const isCarousel = isPost && item.media.length > 1;
          const thumbnailUrl = isReel
            ? item.thumbnailUrl
            : item.media[0]?.thumbnailUrl || item.media[0]?.url;

          return (
            <div
              key={item.id}
              onClick={() => handleItemClick(item)}
              className="relative aspect-square group cursor-pointer overflow-hidden bg-[#121212] rounded-none sm:rounded-sm"
            >
              {/* Media Thumbnail */}
              <Image
                src={thumbnailUrl}
                alt={item.caption || "Explore media"}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Badges */}
              {isReel && (
                <div className="absolute top-2.5 right-2.5 z-10 text-white/90 drop-shadow p-1">
                  <Play className="w-4 h-4 fill-white" />
                </div>
              )}
              {isCarousel && (
                <div className="absolute top-2.5 right-2.5 z-10 text-white/90 drop-shadow p-1">
                  <Copy className="w-4 h-4 fill-white/80" />
                </div>
              )}

              {/* Hover Dark Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-6 text-white font-semibold text-sm z-20">
                <div className="flex items-center gap-1.5">
                  <Heart className="w-5 h-5 fill-white" />
                  <span>{item.likesCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span>{item.commentsCount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Post Modal */}
      {selectedPost && (
        <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}

      {/* Reel Viewer Modal */}
      {selectedReelIndex !== null && reels.length > 0 && (
        <ReelViewerModal
          reels={reels}
          initialIndex={selectedReelIndex}
          onClose={() => setSelectedReelIndex(null)}
        />
      )}
    </>
  );
};

export default AllGrid;
