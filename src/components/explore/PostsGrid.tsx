"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Heart, MessageCircle, Copy } from "lucide-react";
import { PostItem } from "@/lib/mockData";
import { PostModal } from "./PostModal";

interface PostsGridProps {
  posts: PostItem[];
}

export const PostsGrid: React.FC<PostsGridProps> = ({ posts }) => {
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-4">
        {posts.map((post) => {
          const firstMedia = post.media[0];
          const isCarousel = post.media.length > 1;

          return (
            <div
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="relative aspect-square group cursor-pointer overflow-hidden bg-[#121212] rounded-none sm:rounded-sm"
            >
              {/* Media Thumbnail */}
              <Image
                src={firstMedia.thumbnailUrl || firstMedia.url}
                alt={post.caption || "Post"}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Carousel Indicator Badge */}
              {isCarousel && (
                <div className="absolute top-2.5 right-2.5 z-10 text-white/90 drop-shadow p-1">
                  <Copy className="w-4 h-4 fill-white/80" />
                </div>
              )}

              {/* Hover Dark Overlay with Likes and Comments */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-6 text-white font-semibold text-sm z-20">
                <div className="flex items-center gap-1.5">
                  <Heart className="w-5 h-5 fill-white" />
                  <span>{post.likesCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span>{post.commentsCount.toLocaleString()}</span>
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
    </>
  );
};

export default PostsGrid;
