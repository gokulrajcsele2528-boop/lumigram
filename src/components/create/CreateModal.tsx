"use client";

import React, { useState } from "react";
import { X, Image as ImageIcon, Film, CircleDashed, Upload, Sparkles } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export const CreateModal: React.FC = () => {
  const isOpen = useAppStore((s) => s.isCreateOpen);
  const onClose = useAppStore((s) => s.closeCreateModal);

  const [mode, setMode] = useState<"post" | "reel" | "story">("post");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-white/80 hover:text-white p-2 z-50"
        aria-label="Close Create Studio"
      >
        <X className="w-7 h-7" />
      </button>

      <div
        className="bg-[#121212] border border-[#262626] rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#262626]">
          <h2 className="text-base font-semibold text-white">Create new {mode}</h2>
          <div className="flex items-center gap-1 bg-[#1c1c1c] p-1 rounded-lg">
            <button
              onClick={() => setMode("post")}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                mode === "post"
                  ? "bg-[#333333] text-white"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Post
            </button>
            <button
              onClick={() => setMode("reel")}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                mode === "reel"
                  ? "bg-[#333333] text-white"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Reel
            </button>
            <button
              onClick={() => setMode("story")}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                mode === "story"
                  ? "bg-[#333333] text-white"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Story
            </button>
          </div>
        </div>

        {/* Studio Content Area */}
        <div className="p-10 flex flex-col items-center justify-center min-h-[360px] text-center">
          <div className="w-20 h-20 rounded-full bg-[#1c1c1c] border border-[#2a2a2a] flex items-center justify-center mb-5">
            {mode === "post" ? (
              <ImageIcon className="w-10 h-10 text-neutral-400" />
            ) : mode === "reel" ? (
              <Film className="w-10 h-10 text-neutral-400" />
            ) : (
              <CircleDashed className="w-10 h-10 text-neutral-400" />
            )}
          </div>

          <h3 className="text-lg font-semibold text-white mb-2">
            Drag photos and videos here
          </h3>
          <p className="text-xs text-neutral-400 max-w-xs mb-6">
            Supports high-resolution JPG, PNG, WEBP, and MP4 up to 100MB.
          </p>

          <label className="cursor-pointer px-5 py-2.5 rounded-xl bg-[#0095f6] hover:bg-[#1877f2] text-white text-sm font-semibold transition-colors flex items-center gap-2">
            <Upload className="w-4 h-4" />
            <span>Select from computer / device</span>
            <input
              type="file"
              accept={mode === "reel" ? "video/*" : "image/*,video/*"}
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {selectedFile && (
            <div className="mt-4 p-3 bg-[#1c1c1c] rounded-lg border border-[#2c2c2c] text-xs text-green-400">
              Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateModal;
