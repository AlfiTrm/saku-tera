"use client";

import { useState } from "react";
import { notifyDashboardTransactionsUpdated } from "@/src/features/dashboard/lib/dashboard-events";
import {
  extractIncomeDocument,
  submitIncomeEntry,
} from "@/src/features/dashboard/services/dashboardService";
import type {
  IncomeDocumentExtraction,
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
    return sourceOptions[0]?.id ?? "";
  }

  const normalizedHint = sourceHint.toLowerCase();
  const matchedSource = sourceOptions.find((option) =>
    option.label.toLowerCase().includes(normalizedHint),
  );

  return matchedSource?.id ?? sourceOptions[0]?.id ?? "";
}

export function useIncomeEntrySheet({
  onClose,
  onSuccess,
  sourceOptions,
}: UseIncomeEntrySheetParams) {
  const [amountInput, setAmountInput] = useState("");
  const [selectedSourceId, setSelectedSourceId] = useState(
    sourceOptions[0]?.id ?? "",
  );
  const [description, setDescription] = useState("");
  const [documentState, setDocumentState] = useState<{
    error: string | null;
    extraction: IncomeDocumentExtraction | null;
    fileName: string;
    isExtracting: boolean;
  }>({
    error: null,
    extraction: null,
    fileName: "",
    isExtracting: false,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const amount = parseAmount(amountInput);
  const canSubmit =
    amount >= 10000 &&
    sourceOptions.some((source) => source.id === selectedSourceId);

  function resetForm() {
    setAmountInput("");
    setDescription("");
    setSelectedSourceId(sourceOptions[0]?.id ?? "");
    setDocumentState({
      error: null,
      extraction: null,
      fileName: "",
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
      setErrorMessage("");
      setDocumentState({
        error: null,
        extraction: null,
        fileName: file.name,
        isExtracting: true,
      });

      const extraction = await extractIncomeDocument(file);

      if (!extraction.amount) {
        setDocumentState({
          error: "OCR belum menemukan nominal yang yakin. Kamu bisa lanjut isi manual.",
          extraction: null,
          fileName: file.name,
          isExtracting: false,
        });
        return;
      }

      setDocumentState({
        error: null,
        extraction,
        fileName: file.name,
        isExtracting: false,
      });
      setAmountInput(formatRupiahInput(String(extraction.amount)));
      setDescription(extraction.description ?? "");
      setSelectedSourceId(
        mapSourceHintToSourceId(extraction.sourceHint, sourceOptions),
      );
    } catch (error) {
      setDocumentState({
        error:
          error instanceof Error && error.message === "invalid-file-type"
            ? "Format file belum didukung. Gunakan PDF, JPG, PNG, WEBP, atau HEIC."
            : "Dokumen belum bisa dibaca. Kamu tetap bisa isi manual.",
        extraction: null,
        fileName: file.name,
        isExtracting: false,
      });
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
    selectedSourceId,
    setAmountInput: (value: string) => setAmountInput(formatRupiahInput(value)),
    setDescription,
    setSelectedSourceId,
  };
}
