"use client";

import { useAppContext } from "@/features/app/app-context";

export function useCompare() {
  const { compareIds, toggleCompare, clearCompare } = useAppContext();

  return {
    compareIds,
    toggleCompare,
    clearCompare,
    canAddMore: compareIds.length < 3,
  };
}
