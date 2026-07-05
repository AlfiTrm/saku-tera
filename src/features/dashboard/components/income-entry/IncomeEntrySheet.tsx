"use client";

import { BottomSheet } from "@/src/shared/components/overlays";
import type { IncomeSourceOption } from "@/src/features/dashboard/types/dashboardData";
import { IncomeEntryForm } from "./IncomeEntryForm";

type IncomeEntrySheetProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => Promise<void>;
  sourceOptions: IncomeSourceOption[];
};

export function IncomeEntrySheet({
  isOpen,
  onClose,
  onSuccess,
  sourceOptions,
}: IncomeEntrySheetProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="grid gap-4 px-5 pb-[calc(1.1rem+env(safe-area-inset-bottom))] pt-3">
        <div className="mx-auto h-1.5 w-12 rounded-full bg-secondary/10" />
        <IncomeEntryForm
          onClose={onClose}
          onSuccess={onSuccess}
          sourceOptions={sourceOptions}
        />
      </div>
    </BottomSheet>
  );
}
