"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import {
  Settings,
  Bookmark,
  Activity,
  Moon,
  AlertCircle,
  LogOut,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface MoreMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MoreMenu: React.FC<MoreMenuProps> = ({ isOpen, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const menuItems = [
    { label: "Settings", icon: Settings, href: "#settings" },
    { label: "Saved", icon: Bookmark, href: "#saved" },
    { label: "Your activity", icon: Activity, href: "#activity" },
    { label: "Switch appearance", icon: Moon, href: "#appearance" },
    { label: "Report a problem", icon: AlertCircle, href: "#report" },
  ];

  return (
    <div
      ref={menuRef}
      className="absolute bottom-16 left-3 w-64 bg-[#1e1e1e] border border-[#2e2e2e] rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 select-none"
      role="menu"
      aria-label="More options"
    >
      <div className="flex flex-col gap-0.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              role="menuitem"
              className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium text-neutral-200 hover:text-white hover:bg-[#282828] transition-colors"
            >
              <Icon className="w-4 h-4 text-neutral-400" />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <div className="my-1 border-t border-[#2a2a2a]" />

        <button
          onClick={() => {
            alert("Logged out successfully");
            onClose();
          }}
          role="menuitem"
          className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium text-[#ed4956] hover:bg-[#282828] transition-colors w-full text-left"
        >
          <LogOut className="w-4 h-4 text-[#ed4956]" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
};

export default MoreMenu;
