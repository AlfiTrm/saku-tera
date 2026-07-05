"use client";

import { useState } from "react";
import { notifyDashboardTransactionsUpdated } from "@/src/features/dashboard/lib/dashboard-events";
import {
  extractIncomeDocument,
  submitIncomeEntry,
} from "@/src/features/dashboard/services/dashboardService";
import type {
  IncomeDocumentExtraction,
  IncomeEntryMethod,
  IncomeSourceOption,
} from "@/src/features/dashboard/types/dashboardData";

type UseIncomeEntrySheetParams = {
  onClose: () => void;
  onSuccess: () => Promise<void>;
  sourceOptions: IncomeSourceOption[];
};

function formatRupiahInput(value: string) {
  const numericValue = value.replace(/[^\d]/g, "");

  if (!numericValue) {
    return "";
  }

  return `Rp ${Number(numericValue).toLocaleString("id-ID")}`;
}

function parseAmount(value: string) {
  return Number(value.replace(/[^\d]/g, "")) || 0;
}

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

function mapSourceHintToSourceId(
  sourceHint: string | undefined,
  sourceOptions: IncomeSourceOption[],
) {
  if (!sourceHint) {
    return sourceOptions[0]?.id ?? "manual";
  }

  const normalizedHint = sourceHint.toLowerCase();
  const matchedSource = sourceOptions.find((option) =>
    option.label.toLowerCase().includes(normalizedHint),
  );

  return matchedSource?.id ?? sourceOptions[0]?.id ?? "manual";
}

export function useIncomeEntrySheet({
  onClose,
  onSuccess,
  sourceOptions,
}: UseIncomeEntrySheetParams) {
  const [method, setMethod] = useState<IncomeEntryMethod>("manual");
  const [amountInput, setAmountInput] = useState("");
  const [selectedSourceId, setSelectedSourceId] = useState(
    sourceOptions[0]?.id ?? "manual",
  );
  const [description, setDescription] = useState("");
  const [documentState, setDocumentState] = useState<{
    extraction: IncomeDocumentExtraction | null;
    isExtracting: boolean;
  }>({
    extraction: null,
    isExtracting: false,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const amount = parseAmount(amountInput);
  const canSubmit = amount >= 10000;

  function resetForm() {
    setMethod("manual");
    setAmountInput("");
    setDescription("");
    setSelectedSourceId(sourceOptions[0]?.id ?? "manual");
    setDocumentState({
      extraction: null,
      isExtracting: false,
    });
    setErrorMessage("");
    setIsSubmitting(false);
  }

  async function handleDocumentSelect(file: File | null) {
    if (!file) {
      return;
    }

    try {
      setMethod("document");
      setErrorMessage("");
      setDocumentState({
        extraction: null,
        isExtracting: true,
      });

      const extraction = await extractIncomeDocument(file);

      setDocumentState({
        extraction,
        isExtracting: false,
      });
      setAmountInput(extraction.amount ? formatRupiahInput(String(extraction.amount)) : "");
      setDescription(extraction.description ?? "");
      setSelectedSourceId(
        mapSourceHintToSourceId(extraction.sourceHint, sourceOptions),
      );
    } catch {
      setDocumentState({
        extraction: null,
        isExtracting: false,
      });
      setErrorMessage("Dokumen belum bisa dibaca. Kamu tetap bisa isi manual.");
    }
  }

  async function handleSubmit() {
    if (!canSubmit || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      await submitIncomeEntry({
        amount,
        description: description.trim() || undefined,
        sourceId: selectedSourceId,
        transactionDate: getTodayDate(),
      });

      notifyDashboardTransactionsUpdated();
      await onSuccess();
      resetForm();
      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Entri belum bisa disimpan. Coba lagi sebentar.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    amountInput,
    canSubmit,
    description,
    documentState,
    errorMessage,
    handleDocumentSelect,
    handleSubmit,
    isSubmitting,
    method,
    selectedSourceId,
    setAmountInput: (value: string) => setAmountInput(formatRupiahInput(value)),
    setDescription,
    setMethod,
    setSelectedSourceId,
  };
}
