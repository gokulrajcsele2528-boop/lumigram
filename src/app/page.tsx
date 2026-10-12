"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Compass,
} from "lucide-react";
import { SEED_USERS, SEED_POSTS, SEED_STORIES } from "@/lib/mockData";
import { useLanguage } from "@/context/LanguageContext";
import { StoryViewerModal } from "@/components/explore/StoryViewerModal";

export default function HomePage() {
  const { t } = useLanguage();
  const [activeStoryIdx, setActiveStoryIdx] = useState<number | null>(null);
  const [likesState, setLikesState] = useState<Record<string, boolean>>({});

  const toggleLike = (postId: string) => {
    setLikesState((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 py-6 flex gap-8 justify-center min-h-screen pb-20 md:pb-10">
      {/* Feed Column (~470px - 600px) */}
      <div className="w-full max-w-[470px] sm:max-w-[500px] flex flex-col gap-6">
        {/* Top Story Tray */}
        <div className="bg-[#121212]/50 border border-[#262626] rounded-xl p-3 flex items-center gap-3.5 overflow-x-auto no-scrollbar">
          {SEED_STORIES.map((story, i) => (
            <button
              key={story.id}
              onClick={() => setActiveStoryIdx(i)}
              className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
            >
              <div className="p-[2px] rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] group-hover:scale-105 transition-transform">
                <div className="p-0.5 bg-black rounded-full">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden">
                    <Image
                      src={story.author.avatar}
                      alt={story.author.username}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
              <span className="text-[11px] text-neutral-300 max-w-[64px] truncate">
                {story.author.username}
              </span>
            </button>
          ))}
        </div>

        {/* Feed Posts */}
        {SEED_POSTS.slice(0, 5).map((post) => {
          const isLiked = !!likesState[post.id];
          const likesCount = post.likesCount + (isLiked ? 1 : 0);

          return (
            <article
              key={post.id}
              className="bg-black border border-[#262626] rounded-xl overflow-hidden shadow-sm"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden">
                    <Image
                      src={post.author.avatar}
                      alt={post.author.username}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1 font-semibold text-sm text-white">
                      <span>{post.author.username}</span>
                      {post.author.isVerified && (
                        <span className="w-3 h-3 rounded-full bg-[#0095f6] text-[8px] flex items-center justify-center text-white">
                          ✓
                        </span>
                      )}
                    </div>
                    {post.location && (
                      <span className="text-xs text-neutral-400">
                        {post.location}
                      </span>
                    )}
                  </div>
                </div>
                <button className="text-neutral-400 hover:text-white">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              {/* Media Image */}
              <div className="relative aspect-square w-full bg-neutral-900">
                <Image
                  src={post.media[0].url}
                  alt={post.caption}
                  fill
                  sizes="(max-width: 600px) 100vw, 500px"
                  className="object-cover"
                />
              </div>

              {/* Actions */}
              <div className="p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className="transition-transform active:scale-125"
                    >
                      <Heart
                        className={`w-6 h-6 ${
                          isLiked
                            ? "fill-[#ed4956] text-[#ed4956]"
                            : "text-white hover:text-neutral-400"
                        }`}
                      />
                    </button>
                    <button className="text-white hover:text-neutral-400">
                      <MessageCircle className="w-6 h-6" />
                    </button>
                    <button className="text-white hover:text-neutral-400">
                      <Share2 className="w-6 h-6" />
                    </button>
                  </div>
                  <button className="text-white hover:text-neutral-400">
                    <Bookmark className="w-6 h-6" />
                  </button>
                </div>

                {/* Likes count */}
                <div className="text-sm font-semibold text-white">
                  {likesCount.toLocaleString()} {t.likes}
                </div>

                {/* Caption */}
                <div className="text-sm">
                  <span className="font-semibold text-white mr-2">
                    {post.author.username}
                  </span>
                  <span className="text-neutral-200">{post.caption}</span>
                </div>

                {/* View comments link */}
                <Link
                  href="/explore"
                  className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  {t.viewAllComments} ({post.commentsCount})
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {/* Right Suggestions Column (Large Desktop) */}
      <aside className="hidden lg:flex flex-col w-72 shrink-0 gap-6 pt-2">
        {/* User Card */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border border-[#333333]">
              <Image
                src={SEED_USERS[0].avatar}
                alt="You"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <span className="font-semibold text-sm text-white block">
                {SEED_USERS[0].username}
              </span>
              <span className="text-xs text-neutral-400">
                {SEED_USERS[0].fullName}
              </span>
            </div>
          </div>
          <button className="text-xs font-semibold text-[#0095f6] hover:text-white">
            Switch
          </button>
        </div>

        {/* Explore CTA Box */}
        <div className="bg-[#121212] border border-[#262626] rounded-xl p-4 flex flex-col gap-2.5">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <Compass className="w-4 h-4 text-[#0095f6]" />
            <span>Discover on Explore</span>
          </div>
          <p className="text-xs text-neutral-400">
            Check out trending posts, vertical reels, and active 24h stories with the upgraded media selector.
          </p>
          <Link
            href="/explore"
            className="mt-1 text-center py-2 px-3 rounded-lg bg-[#262626] hover:bg-[#333333] text-xs font-semibold text-white transition-colors"
          >
            Go to Explore →
          </Link>
        </div>

        {/* Suggested Creators */}
        <div>
          <div className="flex items-center justify-between mb-3 text-xs font-semibold text-neutral-400">
            <span>Suggested for you</span>
            <span className="text-white hover:underline cursor-pointer">
              See All
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {SEED_USERS.slice(1, 5).map((u) => (
              <div key={u.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden">
                    <Image
                      src={u.avatar}
                      alt={u.username}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-white block">
                      {u.username}
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      Followed by friends
                    </span>
                  </div>
                </div>
                <button className="text-xs font-semibold text-[#0095f6] hover:text-white">
                  Follow
                </button>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Story Viewer Modal */}
      {activeStoryIdx !== null && (
        <StoryViewerModal
          stories={SEED_STORIES}
          initialIndex={activeStoryIdx}
          onClose={() => setActiveStoryIdx(null)}
        />
      )}
    </div>
  );
}
