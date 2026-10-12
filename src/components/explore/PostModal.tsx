"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import { PostItem } from "@/lib/mockData";
import { useLanguage } from "@/context/LanguageContext";

interface PostModalProps {
  post: PostItem;
  onClose: () => void;
}

export const PostModal: React.FC<PostModalProps> = ({ post, onClose }) => {
  const { t } = useLanguage();
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Array<{ id: string; user: string; text: string }>>([
    { id: "c1", user: "jessica_m", text: "Stunning shot! The lighting is incredible ✨" },
    { id: "c2", user: "dev_traveler", text: "Adding this exact spot to my bucket list 📍" },
  ]);

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikesCount((prev) => prev - 1);
    } else {
      setLiked(true);
      setLikesCount((prev) => prev + 1);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setComments((prev) => [
      ...prev,
      { id: Date.now().toString(), user: "you", text: commentText.trim() },
    ]);
    setCommentText("");
  };

  const currentMedia = post.media[activeMediaIndex] || post.media[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-6"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 text-white/80 hover:text-white p-2"
        aria-label="Close modal"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Modal Dialog Content */}
      <div
        className="bg-black border border-[#262626] rounded-xl overflow-hidden max-w-5xl w-full max-h-[90vh] flex flex-col md:flex-row shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Media Column (Left) */}
        <div className="relative md:w-3/5 bg-neutral-950 flex items-center justify-center min-h-[360px] md:min-h-[580px] overflow-hidden">
          {currentMedia.type === "video" ? (
            <video
              src={currentMedia.url}
              controls
              autoPlay
              playsInline
              className="max-h-[85vh] w-full object-contain"
            />
          ) : (
            <div className="relative w-full h-full min-h-[380px] md:min-h-[580px]">
              <Image
                src={currentMedia.url}
                alt={post.caption || "Instagram post"}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-contain"
                priority
              />
            </div>
          )}

          {/* Carousel Arrows */}
          {post.media.length > 1 && (
            <>
              {activeMediaIndex > 0 && (
                <button
                  onClick={() => setActiveMediaIndex((prev) => prev - 1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 text-white p-1.5 rounded-full hover:bg-black/80 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              {activeMediaIndex < post.media.length - 1 && (
                <button
                  onClick={() => setActiveMediaIndex((prev) => prev + 1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 text-white p-1.5 rounded-full hover:bg-black/80 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
              {/* Carousel Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {post.media.map((_, i) => (
                  <span
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      i === activeMediaIndex ? "bg-white w-3" : "bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Post Info & Comments Column (Right) */}
        <div className="md:w-2/5 flex flex-col border-t md:border-t-0 md:border-l border-[#262626] bg-black">
          {/* Author Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#262626]">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#333333]">
                <Image
                  src={post.author.avatar}
                  alt={post.author.username}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-semibold text-sm text-white">
                  <span>{post.author.username}</span>
                  {post.author.isVerified && (
                    <span className="w-3.5 h-3.5 rounded-full bg-[#0095f6] text-[10px] flex items-center justify-center text-white">
                      ✓
                    </span>
                  )}
                </div>
                {post.location && (
                  <span className="text-xs text-[#737373] block truncate">
                    {post.location}
                  </span>
                )}
              </div>
            </div>
            <button className="text-neutral-400 hover:text-white p-1">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Comments and Caption Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[300px] md:max-h-[380px] no-scrollbar">
            {/* Main Caption */}
            {post.caption && (
              <div className="flex gap-3 text-sm">
                <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 mt-0.5">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.username}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <span className="font-semibold text-white mr-2">
                    {post.author.username}
                  </span>
                  <span className="text-neutral-200">{post.caption}</span>
                  <div className="mt-1 flex flex-wrap gap-1 text-xs text-[#0095f6]">
                    {post.hashtags.map((h) => (
                      <span key={h}>#{h}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Comments List */}
            {comments.map((c) => (
              <div key={c.id} className="flex gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-[#262626] flex items-center justify-center font-bold text-xs text-neutral-300 shrink-0">
                  {c.user[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-white mr-2">{c.user}</span>
                  <span className="text-neutral-300">{c.text}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons & Likes Bar */}
          <div className="p-4 border-t border-[#262626] bg-[#0c0c0c] flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLike}
                  className="transition-transform active:scale-125"
                >
                  <Heart
                    className={`w-6 h-6 ${
                      liked
                        ? "fill-[#ed4956] text-[#ed4956]"
                        : "text-white hover:text-[#a8a8a8]"
                    }`}
                  />
                </button>
                <button className="text-white hover:text-[#a8a8a8]">
                  <MessageCircle className="w-6 h-6" />
                </button>
                <button className="text-white hover:text-[#a8a8a8]">
                  <Share2 className="w-6 h-6" />
                </button>
              </div>
              <button className="text-white hover:text-[#a8a8a8]">
                <Bookmark className="w-6 h-6" />
              </button>
            </div>
            <div className="text-sm font-semibold text-white">
              {likesCount.toLocaleString()} {t.likes}
            </div>

            {/* Comment Input */}
            <form onSubmit={handleAddComment} className="flex items-center gap-2 mt-2 pt-2 border-t border-[#222222]">
              <input
                type="text"
                placeholder={t.addComment}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 bg-transparent text-sm text-white placeholder-neutral-500 outline-none"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="text-sm font-semibold text-[#0095f6] hover:text-white disabled:opacity-40 transition-colors"
              >
                {t.post}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
