"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  X,
  Heart,
  MessageCircle,
  Share2,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown,
  Music,
} from "lucide-react";
import { ReelItem } from "@/lib/mockData";
import { useLanguage } from "@/context/LanguageContext";

interface ReelViewerModalProps {
  reels: ReelItem[];
  initialIndex?: number;
  onClose: () => void;
}

export const ReelViewerModal: React.FC<ReelViewerModalProps> = ({
  reels,
  initialIndex = 0,
  onClose,
}) => {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isMuted, setIsMuted] = useState(true);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentReel = reels[currentIndex] || reels[0];
  const isLiked = !!likedMap[currentReel.id];

  const handleNext = () => {
    if (currentIndex < reels.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const toggleLike = () => {
    setLikedMap((prev) => ({
      ...prev,
      [currentReel.id]: !prev[currentReel.id],
    }));
  };

  // Keyboard navigation (ArrowUp, ArrowDown, Escape, Space)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "Escape") {
        onClose();
      } else if (e.key === "m" || e.key === "M") {
        setIsMuted((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, reels.length]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md"
      onClick={onClose}
    >
      {/* Top Close Button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-50 text-white/80 hover:text-white p-2"
        aria-label="Close reels viewer"
      >
        <X className="w-7 h-7" />
      </button>

      {/* Vertical Navigation Chevrons */}
      <div className="hidden md:flex flex-col gap-4 absolute right-10 top-1/2 -translate-y-1/2 z-40">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          disabled={currentIndex === 0}
          className="p-3 rounded-full bg-[#1e1e1e] hover:bg-[#2e2e2e] text-white disabled:opacity-30 transition-colors"
          title="Previous reel"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          disabled={currentIndex === reels.length - 1}
          className="p-3 rounded-full bg-[#1e1e1e] hover:bg-[#2e2e2e] text-white disabled:opacity-30 transition-colors"
          title="Next reel"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      </div>

      {/* Main Reel Card Container (9:16 aspect ratio) */}
      <div
        className="relative w-full max-w-[420px] h-[92vh] max-h-[840px] bg-black rounded-2xl overflow-hidden shadow-2xl border border-[#222222] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Video Player */}
        <video
          ref={videoRef}
          src={currentReel.videoUrl}
          autoPlay
          loop
          playsInline
          muted={isMuted}
          className="w-full h-full object-cover"
        />

        {/* Volume Toggle */}
        <button
          onClick={() => setIsMuted((prev) => !prev)}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm transition-colors"
          title={isMuted ? t.unmute : t.mute}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>

        {/* Bottom Overlay Info */}
        <div className="absolute bottom-4 left-4 right-16 z-20 flex flex-col gap-2 text-white drop-shadow-md">
          {/* Author */}
          <div className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-white/80">
              <Image
                src={currentReel.author.avatar}
                alt={currentReel.author.username}
                fill
                className="object-cover"
              />
            </div>
            <span className="font-semibold text-sm">
              {currentReel.author.username}
            </span>
            <button className="px-2.5 py-1 rounded-md text-xs font-semibold bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white transition-colors">
              {t.follow}
            </button>
          </div>

          {/* Caption */}
          <p className="text-sm line-clamp-2 text-neutral-100 font-normal">
            {currentReel.caption}
          </p>

          {/* Audio Title */}
          <div className="flex items-center gap-2 text-xs text-neutral-300">
            <Music className="w-3.5 h-3.5" />
            <span className="truncate">{currentReel.audioTitle}</span>
          </div>
        </div>

        {/* Right Vertical Action Bar */}
        <div className="absolute bottom-6 right-3 z-30 flex flex-col items-center gap-5">
          {/* Like */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={toggleLike}
              className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-transform active:scale-125"
            >
              <Heart
                className={`w-6 h-6 ${
                  isLiked
                    ? "fill-[#ed4956] text-[#ed4956]"
                    : "text-white"
                }`}
              />
            </button>
            <span className="text-xs font-semibold text-white drop-shadow">
              {(currentReel.likesCount + (isLiked ? 1 : 0)).toLocaleString()}
            </span>
          </div>

          {/* Comment */}
          <div className="flex flex-col items-center gap-1">
            <button className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-colors">
              <MessageCircle className="w-6 h-6" />
            </button>
            <span className="text-xs font-semibold text-white drop-shadow">
              {currentReel.commentsCount.toLocaleString()}
            </span>
          </div>

          {/* Share */}
          <div className="flex flex-col items-center gap-1">
            <button className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-colors">
              <Share2 className="w-6 h-6" />
            </button>
            <span className="text-xs font-semibold text-white drop-shadow">
              {t.share}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReelViewerModal;
