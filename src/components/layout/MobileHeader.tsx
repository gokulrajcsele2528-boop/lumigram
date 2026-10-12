"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Heart, Send } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export const MobileHeader: React.FC = () => {
  const unreadMessages = useAppStore((s) => s.unreadMessages);
  const unreadNotifications = useAppStore((s) => s.unreadNotifications);

  const formatBadge = (count: number) => (count > 99 ? "99+" : count.toString());

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-black/95 backdrop-blur-md border-b border-[#262626] z-40 px-4 flex items-center justify-between select-none">
      {/* Brand */}
      <Link href="/" className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-white" />
        <span className="text-xl font-bold tracking-tight text-white font-serif italic">
          Lumigram
        </span>
      </Link>

      {/* Action Icons with Live Unread Badges */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Link
          href="/notifications"
          className="relative p-1 text-white hover:text-neutral-300 transition-colors"
          aria-label="Notifications"
        >
          <Heart className="w-6 h-6 stroke-[1.8]" />
          {unreadNotifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#ed4956] text-white text-[10px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center border-2 border-black">
              {formatBadge(unreadNotifications)}
            </span>
          )}
        </Link>

        {/* Messages */}
        <Link
          href="/messages"
          className="relative p-1 text-white hover:text-neutral-300 transition-colors"
          aria-label="Direct Messages"
        >
          <Send className="w-6 h-6 stroke-[1.8] -rotate-12" />
          {unreadMessages > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#ed4956] text-white text-[10px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center border-2 border-black">
              {formatBadge(unreadMessages)}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
};

export default MobileHeader;
