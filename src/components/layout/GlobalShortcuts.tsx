"use client";

import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

export const GlobalShortcuts: React.FC = () => {
  useKeyboardShortcuts();
  return null;
};

export default GlobalShortcuts;
