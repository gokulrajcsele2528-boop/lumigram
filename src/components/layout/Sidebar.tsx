"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  Compass,
  Film,
  Send,
  Heart,
  PlusSquare,
  Sparkles,
  Menu,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAppStore } from "@/store/useAppStore";
import { LanguageToggle } from "./LanguageToggle";
import { MoreMenu } from "./MoreMenu";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const user = useAppStore((s) => s.user);
  const unreadMessages = useAppStore((s) => s.unreadMessages);
  const unreadNotifications = useAppStore((s) => s.unreadNotifications);
  const openCreateModal = useAppStore((s) => s.openCreateModal);

  const formatBadge = (count: number) => (count > 99 ? "99+" : count.toString());

  // Determine active item based solely on current pathname
  const isHomeActive = pathname === "/";
  const isExploreActive = pathname.startsWith("/explore");
  const isReelsActive = pathname.startsWith("/reels");
  const isMessagesActive = pathname.startsWith("/messages");
  const isNotificationsActive = pathname.startsWith("/notifications");
  const isProfileActive = pathname.startsWith(`/profile/${user.username}`);

  return (
    <>
      {/* ============================================================ */}
      {/* 1. DESKTOP & TABLET SIDEBAR */}
      {/* ============================================================ */}
      <aside
        className="hidden md:flex flex-col fixed top-0 left-0 h-screen w-18 xl:w-60 border-r border-[#262626] bg-black px-3 py-6 z-40 select-none transition-all duration-200"
        role="navigation"
        aria-label="Main Navigation"
      >
        {/* Brand / Logo */}
        <div className="mb-8 px-3 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 group focus-visible:ring-2 focus-visible:ring-neutral-400 rounded-lg p-1 outline-none"
            aria-label="Lumigram Home"
          >
            <Sparkles className="w-6 h-6 text-white shrink-0 transition-transform duration-300 group-hover:rotate-12" />
            <span className="hidden xl:inline text-xl font-bold tracking-tight text-white font-serif italic">
              Lumigram
            </span>
          </Link>
        </div>

        {/* Navigation Items List */}
        <nav className="flex-1 flex flex-col gap-1.5" role="menubar">
          {/* Home */}
          <Link
            href="/"
            role="menuitem"
            aria-current={isHomeActive ? "page" : undefined}
            title={t.home}
            className={`flex items-center gap-4 px-3 py-3 rounded-xl text-sm font-medium transition-all group outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${
              isHomeActive
                ? "text-white font-bold bg-[#181818]"
                : "text-neutral-400 hover:text-white hover:bg-[#121212]"
            }`}
          >
            <Home
              className={`w-6 h-6 shrink-0 transition-transform duration-150 group-hover:scale-105 ${
                isHomeActive ? "text-white stroke-[2.5] fill-white" : "stroke-[1.8]"
              }`}
            />
            <span className="hidden xl:inline tracking-tight text-[15px]">
              {t.home}
            </span>
          </Link>

          {/* Explore */}
          <Link
            href="/explore"
            role="menuitem"
            aria-current={isExploreActive ? "page" : undefined}
            title={t.explore}
            className={`flex items-center gap-4 px-3 py-3 rounded-xl text-sm font-medium transition-all group outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${
              isExploreActive
                ? "text-white font-bold bg-[#181818]"
                : "text-neutral-400 hover:text-white hover:bg-[#121212]"
            }`}
          >
            <Compass
              className={`w-6 h-6 shrink-0 transition-transform duration-150 group-hover:scale-105 ${
                isExploreActive ? "text-white stroke-[2.5] fill-white/20" : "stroke-[1.8]"
              }`}
            />
            <span className="hidden xl:inline tracking-tight text-[15px]">
              {t.explore}
            </span>
          </Link>

          {/* Reels */}
          <Link
            href="/reels"
            role="menuitem"
            aria-current={isReelsActive ? "page" : undefined}
            title={t.reels}
            className={`flex items-center gap-4 px-3 py-3 rounded-xl text-sm font-medium transition-all group outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${
              isReelsActive
                ? "text-white font-bold bg-[#181818]"
                : "text-neutral-400 hover:text-white hover:bg-[#121212]"
            }`}
          >
            <Film
              className={`w-6 h-6 shrink-0 transition-transform duration-150 group-hover:scale-105 ${
                isReelsActive ? "text-white stroke-[2.5] fill-white" : "stroke-[1.8]"
              }`}
            />
            <span className="hidden xl:inline tracking-tight text-[15px]">
              {t.reels}
            </span>
          </Link>

          {/* Messages (with live unread badge) */}
          <Link
            href="/messages"
            role="menuitem"
            aria-current={isMessagesActive ? "page" : undefined}
            title={t.messages}
            className={`relative flex items-center gap-4 px-3 py-3 rounded-xl text-sm font-medium transition-all group outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${
              isMessagesActive
                ? "text-white font-bold bg-[#181818]"
                : "text-neutral-400 hover:text-white hover:bg-[#121212]"
            }`}
          >
            <div className="relative shrink-0">
              <Send
                className={`w-6 h-6 transition-transform duration-150 group-hover:scale-105 -rotate-12 ${
                  isMessagesActive ? "text-white stroke-[2.5] fill-white" : "stroke-[1.8]"
                }`}
              />
              {unreadMessages > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#ed4956] text-white text-[10px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center border-2 border-black">
                  {formatBadge(unreadMessages)}
                </span>
              )}
            </div>
            <span className="hidden xl:inline tracking-tight text-[15px]">
              {t.messages}
            </span>
          </Link>

          {/* Notifications (with live unread badge) */}
          <Link
            href="/notifications"
            role="menuitem"
            aria-current={isNotificationsActive ? "page" : undefined}
            title={t.notifications}
            className={`relative flex items-center gap-4 px-3 py-3 rounded-xl text-sm font-medium transition-all group outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${
              isNotificationsActive
                ? "text-white font-bold bg-[#181818]"
                : "text-neutral-400 hover:text-white hover:bg-[#121212]"
            }`}
          >
            <div className="relative shrink-0">
              <Heart
                className={`w-6 h-6 transition-transform duration-150 group-hover:scale-105 ${
                  isNotificationsActive ? "text-white stroke-[2.5] fill-white" : "stroke-[1.8]"
                }`}
              />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#ed4956] text-white text-[10px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center border-2 border-black">
                  {formatBadge(unreadNotifications)}
                </span>
              )}
            </div>
            <span className="hidden xl:inline tracking-tight text-[15px]">
              {t.notifications}
            </span>
          </Link>

          {/* Create (Action Button -> opens modal, never highlights as a page) */}
          <button
            onClick={openCreateModal}
            role="menuitem"
            title={t.create}
            className="flex items-center gap-4 px-3 py-3 rounded-xl text-sm font-medium text-neutral-400 hover:text-white hover:bg-[#121212] transition-all group outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 text-left"
          >
            <PlusSquare className="w-6 h-6 shrink-0 transition-transform duration-150 group-hover:scale-105 stroke-[1.8]" />
            <span className="hidden xl:inline tracking-tight text-[15px]">
              {t.create}
            </span>
          </button>

          {/* Profile */}
          <Link
            href={`/profile/${user.username}`}
            role="menuitem"
            aria-current={isProfileActive ? "page" : undefined}
            title={t.profile}
            className={`flex items-center gap-4 px-3 py-3 rounded-xl text-sm font-medium transition-all group outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${
              isProfileActive
                ? "text-white font-bold bg-[#181818]"
                : "text-neutral-400 hover:text-white hover:bg-[#121212]"
            }`}
          >
            <div
              className={`relative w-6 h-6 rounded-full overflow-hidden shrink-0 border transition-transform duration-150 group-hover:scale-105 ${
                isProfileActive ? "border-white border-2" : "border-[#404040]"
              }`}
            >
              <Image
                src={user.avatar}
                alt={user.username}
                fill
                className="object-cover"
              />
            </div>
            <span className="hidden xl:inline tracking-tight text-[15px]">
              {t.profile}
            </span>
          </Link>
        </nav>

        {/* Bottom Options / Language Switcher & More Menu */}
        <div className="pt-4 border-t border-[#262626] flex flex-col gap-3 px-1 relative">
          <div className="hidden xl:block">
            <LanguageToggle />
          </div>

          <button
            onClick={() => setIsMoreOpen((prev) => !prev)}
            aria-expanded={isMoreOpen}
            aria-haspopup="menu"
            title={t.more}
            className={`flex items-center gap-4 px-3 py-2.5 rounded-xl text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${
              isMoreOpen
                ? "bg-[#181818] text-white font-semibold"
                : "text-neutral-400 hover:text-white hover:bg-[#121212]"
            }`}
          >
            <Menu className="w-6 h-6 shrink-0" />
            <span className="hidden xl:inline text-[15px]">{t.more}</span>
          </button>

          {/* More Dropdown Menu */}
          <MoreMenu isOpen={isMoreOpen} onClose={() => setIsMoreOpen(false)} />
        </div>
      </aside>

      {/* ============================================================ */}
      {/* 2. MOBILE BOTTOM NAVIGATION BAR */}
      {/* ============================================================ */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-black/95 backdrop-blur-md border-t border-[#262626] flex items-center justify-around px-2 z-40 select-none"
        role="navigation"
        aria-label="Mobile Navigation"
      >
        {/* Home */}
        <Link
          href="/"
          className={`p-2 transition-colors ${
            isHomeActive ? "text-white" : "text-neutral-400 hover:text-white"
          }`}
          aria-label={t.home}
        >
          <Home
            className={`w-6 h-6 ${
              isHomeActive ? "fill-white stroke-[2.5]" : "stroke-[1.8]"
            }`}
          />
        </Link>

        {/* Explore */}
        <Link
          href="/explore"
          className={`p-2 transition-colors ${
            isExploreActive ? "text-white" : "text-neutral-400 hover:text-white"
          }`}
          aria-label={t.explore}
        >
          <Compass
            className={`w-6 h-6 ${
              isExploreActive ? "stroke-[2.5]" : "stroke-[1.8]"
            }`}
          />
        </Link>

        {/* Create Action (+) */}
        <button
          onClick={openCreateModal}
          className="p-2 text-neutral-400 hover:text-white transition-colors"
          aria-label={t.create}
        >
          <PlusSquare className="w-6 h-6 stroke-[1.8]" />
        </button>

        {/* Reels */}
        <Link
          href="/reels"
          className={`p-2 transition-colors ${
            isReelsActive ? "text-white" : "text-neutral-400 hover:text-white"
          }`}
          aria-label={t.reels}
        >
          <Film
            className={`w-6 h-6 ${
              isReelsActive ? "fill-white stroke-[2.5]" : "stroke-[1.8]"
            }`}
          />
        </Link>

        {/* Profile */}
        <Link
          href={`/profile/${user.username}`}
          className="p-2 transition-colors"
          aria-label={t.profile}
        >
          <div
            className={`relative w-6 h-6 rounded-full overflow-hidden border ${
              isProfileActive ? "border-white border-2" : "border-[#404040]"
            }`}
          >
            <Image
              src={user.avatar}
              alt={user.username}
              fill
              className="object-cover"
            />
          </div>
        </Link>
      </nav>
    </>
  );
};

export default Sidebar;
