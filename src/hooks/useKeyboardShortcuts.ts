"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";

export function useKeyboardShortcuts() {
  const router = useRouter();
  const openCreateModal = useAppStore((s) => s.openCreateModal);
  const lastKeyRef = useRef<string | null>(null);
  const lastKeyTimeRef = useRef<number>(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if focus is inside an input, textarea, or contentEditable
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        if (e.key === "Escape") {
          target.blur();
        }
        return;
      }

      const now = Date.now();
      const lastKey = lastKeyRef.current;
      const isSequence = now - lastKeyTimeRef.current < 800; // 800ms sequence window

      // "g" sequence shortcuts
      if (isSequence && lastKey === "g") {
        if (e.key === "h" || e.key === "H") {
          e.preventDefault();
          router.push("/");
        } else if (e.key === "e" || e.key === "E") {
          e.preventDefault();
          router.push("/explore");
        } else if (e.key === "r" || e.key === "R") {
          e.preventDefault();
          router.push("/reels");
        } else if (e.key === "m" || e.key === "M") {
          e.preventDefault();
          router.push("/messages");
        }
        lastKeyRef.current = null;
        return;
      }

      // Single-key shortcuts
      if (e.key === "c" || e.key === "C") {
        e.preventDefault();
        openCreateModal();
      } else if (e.key === "/") {
        e.preventDefault();
        const searchInput = document.querySelector<HTMLInputElement>(
          'input[placeholder*="Search"], input[type="text"]'
        );
        searchInput?.focus();
      }

      lastKeyRef.current = e.key.toLowerCase();
      lastKeyTimeRef.current = now;
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router, openCreateModal]);
}

export default useKeyboardShortcuts;
