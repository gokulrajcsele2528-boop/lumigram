"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Send, Search, Phone, Video, Info, Smile, Image as ImageIcon } from "lucide-react";
import { SEED_USERS } from "@/lib/mockData";
import { useLanguage } from "@/context/LanguageContext";

export default function MessagesPage() {
  const { t } = useLanguage();
  const [selectedUser, setSelectedUser] = useState(SEED_USERS[1]);
  const [messages, setMessages] = useState<Array<{ id: string; sender: "me" | "them"; text: string; time: string }>>([
    { id: "m1", sender: "them", text: "Hey! Loved your latest post from the Alps!", time: "10:30 AM" },
    { id: "m2", sender: "me", text: "Thank you so much Marina! Are you still in Italy?", time: "10:32 AM" },
    { id: "m3", sender: "them", text: "Yes! Testing new sourdough recipes this week 🥖🍕", time: "10:33 AM" },
  ]);
  const [inputText, setInputText] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: "me",
        text: inputText.trim(),
        time: "Just now",
      },
    ]);
    setInputText("");
  };

  return (
    <div className="w-full h-[calc(100vh-56px)] md:h-screen flex bg-black border-l border-[#262626]">
      {/* Left Column: Conversations List */}
      <div className="w-full sm:w-80 md:w-96 border-r border-[#262626] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[#262626] flex items-center justify-between">
          <h1 className="text-lg font-bold text-white tracking-tight">
            {t.messages}
          </h1>
          <button className="text-xs font-semibold text-[#0095f6] hover:text-white">
            New Message
          </button>
        </div>

        {/* Search */}
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search chats..."
              className="w-full h-9 pl-9 pr-4 rounded-xl bg-[#181818] text-xs text-white placeholder-neutral-500 outline-none focus:ring-1 focus:ring-neutral-400"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#1e1e1e] no-scrollbar">
          {SEED_USERS.slice(1, 6).map((u) => {
            const isSelected = selectedUser.id === u.id;
            return (
              <button
                key={u.id}
                onClick={() => setSelectedUser(u)}
                className={`w-full flex items-center gap-3 p-3.5 transition-colors text-left ${
                  isSelected ? "bg-[#181818]" : "hover:bg-[#121212]"
                }`}
              >
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#333333] shrink-0">
                  <Image src={u.avatar} alt={u.username} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-semibold text-sm text-white truncate">
                      {u.fullName || u.username}
                    </span>
                    <span className="text-[11px] text-neutral-500">2h</span>
                  </div>
                  <p className="text-xs text-neutral-400 truncate">
                    Active today • Say hi!
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Column: Chat Box */}
      <div className="hidden sm:flex flex-1 flex-col bg-black">
        {/* Chat Header */}
        <div className="p-3.5 border-b border-[#262626] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#333333]">
              <Image
                src={selectedUser.avatar}
                alt={selectedUser.username}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <span className="font-semibold text-sm text-white block">
                {selectedUser.fullName || selectedUser.username}
              </span>
              <span className="text-xs text-[#0095f6]">Active now</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-white">
            <button className="hover:text-neutral-400"><Phone className="w-5 h-5" /></button>
            <button className="hover:text-neutral-400"><Video className="w-5 h-5" /></button>
            <button className="hover:text-neutral-400"><Info className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col justify-end no-scrollbar">
          {messages.map((m) => {
            const isMe = m.sender === "me";
            return (
              <div
                key={m.id}
                className={`flex flex-col max-w-[70%] ${
                  isMe ? "self-end items-end" : "self-start items-start"
                }`}
              >
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm ${
                    isMe
                      ? "bg-[#0095f6] text-white rounded-br-xs"
                      : "bg-[#262626] text-neutral-100 rounded-bl-xs"
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-neutral-500 mt-1 px-1">
                  {m.time}
                </span>
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 border-t border-[#262626] flex items-center gap-3"
        >
          <div className="flex-1 flex items-center bg-[#181818] rounded-full px-4 py-2 border border-[#2e2e2e]">
            <input
              type="text"
              placeholder="Message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="bg-transparent text-sm text-white w-full outline-none placeholder-neutral-500"
            />
            <button type="button" className="text-neutral-400 hover:text-white mr-2">
              <Smile className="w-5 h-5" />
            </button>
            <button type="button" className="text-neutral-400 hover:text-white">
              <ImageIcon className="w-5 h-5" />
            </button>
          </div>
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-full bg-[#0095f6] hover:bg-[#1877f2] disabled:opacity-40 text-white transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
