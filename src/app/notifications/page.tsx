"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, UserPlus, MessageCircle, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAppStore } from "@/store/useAppStore";

export default function NotificationsPage() {
  const { t } = useLanguage();
  const unreadNotifications = useAppStore((s) => s.unreadNotifications);

  const notifications = [
    {
      id: "n1",
      user: "chef_marina",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      text: "liked your post.",
      time: "15m",
      type: "like",
      mediaUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=200&auto=format&fit=crop&q=80",
      isUnread: true,
    },
    {
      id: "n2",
      user: "tech_insider",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      text: "started following you.",
      time: "1h",
      type: "follow",
      isUnread: true,
    },
    {
      id: "n3",
      user: "art_by_priya",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      text: 'commented: "Incredible perspective!"',
      time: "3h",
      type: "comment",
      mediaUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=200&auto=format&fit=crop&q=80",
      isUnread: true,
    },
    {
      id: "n4",
      user: "urban_fashion",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      text: "liked your reel.",
      time: "1d",
      type: "like",
      mediaUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=200&auto=format&fit=crop&q=80",
      isUnread: false,
    },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 min-h-screen pb-20 md:pb-10">
      <div className="flex items-center justify-between pb-4 border-b border-[#262626] mb-4">
        <h1 className="text-xl font-bold text-white tracking-tight">
          {t.notifications}
        </h1>
        {unreadNotifications > 0 && (
          <span className="text-xs font-semibold px-2.5 py-1 bg-[#ed4956] text-white rounded-full">
            {unreadNotifications} new
          </span>
        )}
      </div>

      <div className="flex flex-col divide-y divide-[#1e1e1e]">
        {notifications.map((item) => (
          <div
            key={item.id}
            className={`flex items-center justify-between py-3.5 px-2 rounded-xl transition-colors ${
              item.isUnread ? "bg-[#141414]/80" : "hover:bg-[#121212]"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-full overflow-hidden border border-[#333333]">
                <Image
                  src={item.avatar}
                  alt={item.user}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-sm">
                <span className="font-semibold text-white mr-1.5">
                  {item.user}
                </span>
                <span className="text-neutral-300">{item.text}</span>
                <span className="text-xs text-neutral-500 ml-2">{item.time}</span>
              </div>
            </div>

            {item.mediaUrl ? (
              <div className="relative w-11 h-11 rounded-md overflow-hidden bg-neutral-900 border border-[#262626] shrink-0">
                <Image
                  src={item.mediaUrl}
                  alt="Post thumbnail"
                  fill
                  className="object-cover"
                />
              </div>
            ) : item.type === "follow" ? (
              <button className="px-3.5 py-1.5 rounded-lg bg-[#0095f6] hover:bg-[#1877f2] text-xs font-semibold text-white shrink-0 transition-colors">
                {t.follow}
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
