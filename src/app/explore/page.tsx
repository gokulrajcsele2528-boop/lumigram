"use client";

import React, { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, RotateCcw } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { ExploreTabBar, ExploreTabType } from "@/components/explore/ExploreTabBar";
import { FilterChips } from "@/components/explore/FilterChips";
import { AllGrid } from "@/components/explore/AllGrid";
import { PostsGrid } from "@/components/explore/PostsGrid";
import { ReelsGrid } from "@/components/explore/ReelsGrid";
import { StoriesGrid } from "@/components/explore/StoriesGrid";
import { SkeletonLoader } from "@/components/shared/SkeletonLoader";
import { EmptyState } from "@/components/shared/EmptyState";
import { ExploreItem, PostItem, ReelItem, StoryItem } from "@/lib/mockData";

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useLanguage();

  // Read URL query parameter "?type=" or default to "all"
  const typeParam = (searchParams.get("type") as ExploreTabType) || "all";
  const [activeTab, setActiveTab] = useState<ExploreTabType>(typeParam);
  const [filter, setFilter] = useState<string>("trending");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");

  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Sync state with URL parameter on load / browser back button
  useEffect(() => {
    if (typeParam && ["all", "posts", "reels", "stories"].includes(typeParam)) {
      setActiveTab(typeParam);
    }
  }, [typeParam]);

  // Debounce search input (350ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Update tab in URL without full page reload
  const handleTabChange = (newTab: ExploreTabType) => {
    setActiveTab(newTab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("type", newTab);
    router.replace(`/explore?${params.toString()}`, { scroll: false });
    localStorage.setItem("ig_explore_tab", newTab);
  };

  // Fetch explore content per tab and filters
  const fetchExploreData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        type: activeTab,
        filter,
        topic: selectedTopic,
        q: debouncedQuery,
        limit: "24",
      });

      const res = await fetch(`/api/explore?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`Failed to load data (HTTP ${res.status})`);
      }
      const data = await res.json();
      if (data.success && data.data?.items) {
        setItems(data.data.items);
      } else {
        setItems([]);
      }
    } catch (err: any) {
      console.error("Explore fetch error:", err);
      setError(err.message || "Failed to load content");
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, filter, selectedTopic, debouncedQuery]);

  useEffect(() => {
    fetchExploreData();
  }, [fetchExploreData]);

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-4 min-h-screen pb-20 md:pb-10">
      {/* 1. STICKY TOP SEARCH BAR */}
      <div className="sticky top-0 z-30 bg-black/95 backdrop-blur-md pt-2 pb-2">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#181818] text-white placeholder-[#737373] text-sm border border-transparent focus:border-[#383838] focus:bg-[#202020] outline-none transition-all"
          />
        </div>

        {/* 2. STICKY SEGMENTED TAB BAR */}
        <div className="mt-3">
          <ExploreTabBar
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>

        {/* 3. FILTER CHIPS & TOPICS */}
        <div className="mt-2 border-b border-[#222222] pb-2">
          <FilterChips
            activeTab={activeTab}
            filter={filter}
            onFilterChange={setFilter}
            selectedTopic={selectedTopic}
            onTopicChange={setSelectedTopic}
          />
        </div>
      </div>

      {/* 4. MAIN CONTENT AREA (UPDATES PER TAB WITH SKELETONS) */}
      <main className="mt-4">
        {isLoading ? (
          <SkeletonLoader type={activeTab} />
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-sm text-neutral-400 mb-4">{error}</p>
            <button
              onClick={fetchExploreData}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#262626] hover:bg-[#333333] text-white text-sm font-semibold transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry</span>
            </button>
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            title={
              activeTab === "reels"
                ? t.noReelsYet
                : activeTab === "stories"
                ? t.noStoriesYet
                : t.noPostsYet
            }
            description="Try exploring another topic or clearing your search."
          />
        ) : activeTab === "posts" ? (
          <PostsGrid posts={items as PostItem[]} />
        ) : activeTab === "reels" ? (
          <ReelsGrid reels={items as ReelItem[]} />
        ) : activeTab === "stories" ? (
          <StoriesGrid stories={items as StoryItem[]} />
        ) : (
          <AllGrid items={items as ExploreItem[]} />
        )}
      </main>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<SkeletonLoader type="all" />}>
      <ExploreContent />
    </Suspense>
  );
}
