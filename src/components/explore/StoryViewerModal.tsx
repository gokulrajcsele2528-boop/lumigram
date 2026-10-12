"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { X, Heart, Send, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { StoryItem } from "@/lib/mockData";
import { useLanguage } from "@/context/LanguageContext";

interface StoryViewerModalProps {
  stories: StoryItem[];
  initialIndex?: number;
  onClose: () => void;
}

const STORY_DURATION_MS = 5000;

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  stories,
  initialIndex = 0,
  onClose,
}) => {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [liked, setLiked] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentStory = stories[currentIndex] || stories[0];

  // Story Timer & Progress Bar
  useEffect(() => {
    setProgress(0);
    setLiked(false);
  }, [currentIndex]);

  useEffect(() => {
    if (isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    const stepMs = 50;
    const increment = (stepMs / STORY_DURATION_MS) * 100;

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex((i) => i + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + increment;
      });
    }, stepMs);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentIndex, isPaused, stories.length, onClose]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Escape") onClose();
      if (e.key === " ") setIsPaused((p) => !p);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md"
      onClick={onClose}
    >
      {/* Top Close Button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-50 text-white/80 hover:text-white p-2"
        aria-label="Close story viewer"
      >
        <X className="w-7 h-7" />
      </button>

      {/* Prev Story Arrow */}
      {currentIndex > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors"
          title="Previous story"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Next Story Arrow */}
      {currentIndex < stories.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors"
          title="Next story"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Story Phone Card Container */}
      <div
        className="relative w-full max-w-[420px] h-[92vh] max-h-[840px] bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between select-none"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Top Progress Bars */}
        <div className="absolute top-3 left-3 right-3 z-30 flex gap-1.5">
          {stories.map((s, idx) => (
            <div
              key={s.id}
              className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-white transition-all duration-75"
                style={{
                  width:
                    idx < currentIndex
                      ? "100%"
                      : idx === currentIndex
                      ? `${progress}%`
                      : "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* Author Header */}
        <div className="absolute top-6 left-3 right-3 z-30 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-white/80">
              <Image
                src={currentStory.author.avatar}
                alt={currentStory.author.username}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <span className="font-semibold text-sm drop-shadow">
                {currentStory.author.username}
              </span>
              <span className="text-xs text-white/70 ml-2 drop-shadow">
                2h
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsPaused((p) => !p)}
            className="p-1 rounded text-white/70 hover:text-white"
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
        </div>

        {/* Media Background */}
        <div className="relative w-full h-full bg-black flex items-center justify-center">
          <Image
            src={currentStory.media.url}
            alt={currentStory.caption || "Story"}
            fill
            className="object-cover"
            priority
          />
          {/* Tap Zones for Left/Right Navigation */}
          <div
            className="absolute top-0 bottom-16 left-0 w-1/3 z-20 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
          />
          <div
            className="absolute top-0 bottom-16 right-0 w-2/3 z-20 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
          />
        </div>

        {/* Story Caption (if any) */}
        {currentStory.caption && (
          <div className="absolute bottom-20 left-4 right-4 z-30 text-white text-center font-medium drop-shadow-md bg-black/40 backdrop-blur-sm py-2 px-3 rounded-lg">
            {currentStory.caption}
          </div>
        )}

        {/* Bottom Interactive Bar */}
        <div className="absolute bottom-3 left-3 right-3 z-30 flex items-center gap-3">
          <div className="flex-1 flex items-center bg-black/40 border border-white/30 backdrop-blur-md rounded-full px-4 py-2 text-white">
            <input
              type="text"
              placeholder={`Reply to ${currentStory.author.username}...`}
              className="bg-transparent text-sm w-full outline-none placeholder-white/60 text-white"
            />
            <button className="text-white/80 hover:text-white">
              <Send className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => setLiked((l) => !l)}
            className="p-2.5 rounded-full bg-black/40 border border-white/30 backdrop-blur-md text-white hover:scale-110 active:scale-125 transition-transform"
          >
            <Heart
              className={`w-5 h-5 ${
                liked ? "fill-[#ed4956] text-[#ed4956]" : "text-white"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryViewerModal;
