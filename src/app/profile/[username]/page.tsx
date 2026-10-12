"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Grid3X3, Film, Bookmark, UserCheck, Settings, Heart, MessageCircle } from "lucide-react";
import { SEED_USERS, SEED_POSTS, SEED_REELS } from "@/lib/mockData";
import { useLanguage } from "@/context/LanguageContext";
import { useAppStore } from "@/store/useAppStore";

export default function ProfilePage({ params }: { params: { username: string } }) {
  const { t } = useLanguage();
  const currentUser = useAppStore((s) => s.user);
  const [activeTab, setActiveTab] = useState<"posts" | "reels" | "saved" | "tagged">("posts");

  const username = decodeURIComponent(params.username || currentUser.username);
  const matchedUser = SEED_USERS.find((u) => u.username.toLowerCase() === username.toLowerCase()) || currentUser;
  const userPosts = SEED_POSTS.filter((p) => p.author.username === matchedUser.username || p.author.id === matchedUser.id);
  const userReels = SEED_REELS.filter((r) => r.author.username === matchedUser.username || r.author.id === matchedUser.id);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 min-h-screen pb-20 md:pb-10">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-10 pb-8 border-b border-[#262626]">
        {/* Avatar with Gradient Story Ring */}
        <div className="p-1 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shrink-0">
          <div className="p-1 bg-black rounded-full">
            <div className="relative w-24 h-24 sm:w-36 sm:h-36 rounded-full overflow-hidden">
              <Image
                src={matchedUser.avatar}
                alt={matchedUser.username}
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* User Details */}
        <div className="flex-1 flex flex-col gap-4 text-center sm:text-left">
          {/* Row 1: Username & Action Buttons */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
            <h1 className="text-xl font-bold text-white tracking-tight">
              {matchedUser.username}
            </h1>
            {matchedUser.isVerified && (
              <span className="w-4 h-4 rounded-full bg-[#0095f6] text-[10px] flex items-center justify-center text-white">
                ✓
              </span>
            )}
            <div className="flex items-center gap-2">
              <button className="px-4 py-1.5 rounded-lg bg-[#262626] hover:bg-[#333333] text-sm font-semibold text-white transition-colors">
                Edit profile
              </button>
              <button className="px-4 py-1.5 rounded-lg bg-[#262626] hover:bg-[#333333] text-sm font-semibold text-white transition-colors">
                Share profile
              </button>
              <button className="p-2 rounded-lg bg-[#262626] hover:bg-[#333333] text-white">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Row 2: Counts */}
          <div className="flex items-center justify-center sm:justify-start gap-8 text-sm">
            <div>
              <span className="font-bold text-white">54</span>{" "}
              <span className="text-neutral-400">posts</span>
            </div>
            <div>
              <span className="font-bold text-white">24.8K</span>{" "}
              <span className="text-neutral-400">followers</span>
            </div>
            <div>
              <span className="font-bold text-white">412</span>{" "}
              <span className="text-neutral-400">following</span>
            </div>
          </div>

          {/* Row 3: Full Name & Bio */}
          <div>
            <div className="font-semibold text-sm text-white">
              {matchedUser.fullName}
            </div>
            <p className="text-sm text-neutral-300 mt-1 whitespace-pre-line">
              Visual storyteller & alpine traveler 🏔️✨ Living between summits and stories.
            </p>
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="flex items-center justify-center gap-12 border-b border-[#262626] text-xs font-semibold uppercase tracking-wider mb-4">
        <button
          onClick={() => setActiveTab("posts")}
          className={`flex items-center gap-2 py-3 border-t-2 -mt-[1px] transition-colors ${
            activeTab === "posts"
              ? "border-white text-white"
              : "border-transparent text-neutral-500 hover:text-neutral-300"
          }`}
        >
          <Grid3X3 className="w-4 h-4" />
          <span>Posts</span>
        </button>
        <button
          onClick={() => setActiveTab("reels")}
          className={`flex items-center gap-2 py-3 border-t-2 -mt-[1px] transition-colors ${
            activeTab === "reels"
              ? "border-white text-white"
              : "border-transparent text-neutral-500 hover:text-neutral-300"
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Reels</span>
        </button>
        <button
          onClick={() => setActiveTab("saved")}
          className={`flex items-center gap-2 py-3 border-t-2 -mt-[1px] transition-colors ${
            activeTab === "saved"
              ? "border-white text-white"
              : "border-transparent text-neutral-500 hover:text-neutral-300"
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved</span>
        </button>
        <button
          onClick={() => setActiveTab("tagged")}
          className={`flex items-center gap-2 py-3 border-t-2 -mt-[1px] transition-colors ${
            activeTab === "tagged"
              ? "border-white text-white"
              : "border-transparent text-neutral-500 hover:text-neutral-300"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Tagged</span>
        </button>
      </div>

      {/* Tab Content Grid */}
      {activeTab === "posts" ? (
        <div className="grid grid-cols-3 gap-1 sm:gap-4">
          {SEED_POSTS.slice(0, 6).map((p) => (
            <div
              key={p.id}
              className="relative aspect-square group cursor-pointer overflow-hidden bg-[#181818]"
            >
              <Image
                src={p.media[0].url}
                alt={p.caption}
                fill
                sizes="(max-width: 640px) 33vw, 300px"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-semibold text-sm">
                <div className="flex items-center gap-1.5">
                  <Heart className="w-5 h-5 fill-white" />
                  <span>{p.likesCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span>{p.commentsCount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : activeTab === "reels" ? (
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {SEED_REELS.slice(0, 3).map((r) => (
            <div
              key={r.id}
              className="relative aspect-[9/16] group cursor-pointer overflow-hidden rounded-md bg-[#181818]"
            >
              <Image
                src={r.thumbnailUrl}
                alt={r.caption}
                fill
                sizes="(max-width: 640px) 33vw, 250px"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-2 left-2 text-white text-xs font-semibold flex items-center gap-1 drop-shadow">
                <Film className="w-3.5 h-3.5" />
                <span>{r.viewsCount.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-sm text-neutral-500">
          No items here yet.
        </div>
      )}
    </div>
  );
}
