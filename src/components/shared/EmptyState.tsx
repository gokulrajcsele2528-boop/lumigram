"use client";

import React from "react";
import { PlusCircle, SearchX } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center max-w-sm mx-auto">
      <div className="w-16 h-16 rounded-full bg-[#181818] border border-[#262626] flex items-center justify-center mb-4">
        <SearchX className="w-8 h-8 text-[#737373]" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-1">
        {title || t.noPostsYet}
      </h3>
      {description && (
        <p className="text-sm text-[#737373] mb-6">{description}</p>
      )}
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0095f6] hover:bg-[#1877f2] text-white text-sm font-semibold transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;
