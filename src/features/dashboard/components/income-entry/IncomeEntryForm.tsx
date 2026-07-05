"use client";

import { Icon } from "@iconify/react";
import { useRef } from "react";
import PressButton from "@/src/shared/components/buttons/PressButton";
import { useIncomeEntrySheet } from "@/src/features/dashboard/hooks/useIncomeEntrySheet";
import type {
  IncomeDocumentType,
  IncomeEntryMethod,
  IncomeSourceOption,
} from "@/src/features/dashboard/types/dashboardData";

type IncomeEntryFormProps = {
  onClose: () => void;
  onSuccess: () => Promise<void>;
  sourceOptions: IncomeSourceOption[];
};

const methodOptions: Array<{
  description: string;
  icon: string;
  label: string;
  value: IncomeEntryMethod;
}> = [
  {
    description: "Isi langsung nominal dan sumber pemasukanmu.",
    icon: "solar:pen-2-bold-duotone",
    label: "Input manual",
    value: "manual",
  },
  {
    description: "Upload invoice, slip, bukti transfer, atau gambar dokumen untuk autofill.",
    icon: "solar:gallery-wide-bold-duotone",
    label: "Unggah file",
    value: "document",
  },
];

const documentTypeLabelMap: Record<IncomeDocumentType, string> = {
  "bank-proof": "Bukti transfer",
  invoice: "Invoice",
  "salary-slip": "Slip penghasilan",
  unknown: "Dokumen umum",
};

function getTodayLabel() {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    weekday: "long",
    year: "numeric",
  }).format(new Date());
}

export function IncomeEntryForm({
  onClose,
  onSuccess,
  sourceOptions,
}: IncomeEntryFormProps) {
  const todayLabel = getTodayLabel();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const {
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
    setAmountInput,
    setDescription,
    setMethod,
    setSelectedSourceId,
  } = useIncomeEntrySheet({
    onClose,
    onSuccess,
    sourceOptions,
  });

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <span className="text-sm font-semibold text-secondary">Metode Input</span>
        <div className="grid gap-2">
          {methodOptions.map((option) => {
            const isSelected = option.value === method;

            return (
              <button
                className={`grid gap-1 rounded-[20px] border px-4 py-3 text-left transition-colors ${
                  isSelected ? "border-primary bg-primary/5" : "border-black/10 bg-white"
                }`}
                key={option.value}
                onClick={() => setMethod(option.value)}
                type="button"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${
                      isSelected ? "bg-primary text-white" : "bg-primary/10 text-primary"
                    }`}
                  >
                    <Icon className="h-5 w-5" icon={option.icon} />
                  </span>
                  <span className="text-sm font-semibold text-secondary">{option.label}</span>
                </div>
                <p className="pl-[3.25rem] text-sm leading-6 text-secondary/45">
                  {option.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {method === "document" ? (
        <div className="grid gap-3 rounded-[22px] border border-dashed border-primary/25 bg-primary/[0.03] p-4">
          <input
            accept=".pdf,.png,.jpg,.jpeg,.webp,.heic,application/pdf,image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0] ?? null;
              void handleDocumentSelect(file);
              event.target.value = "";
            }}
            ref={fileInputRef}
            type="file"
          />

          <div className="grid gap-1">
            <p className="text-sm font-semibold text-secondary">Unggah file dokumen</p>
            <p className="text-sm leading-6 text-secondary/48">
              Slip gaji, invoice, atau bukti transfer akan dicoba dibaca otomatis.
            </p>
          </div>

          <button
            className="flex min-h-[58px] items-center justify-between rounded-[18px] border border-primary/15 bg-white px-4 text-left"
            onClick={openFilePicker}
            type="button"
          >
            <span className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" icon="solar:upload-bold-duotone" />
                </span>
                <span className="text-sm font-semibold text-secondary">
                  {documentState.extraction?.fileName || "Pilih file"}
                </span>
              </span>
            <span className="text-sm font-medium text-primary">
              {documentState.extraction ? "Ganti" : "Unggah"}
            </span>
          </button>

          {documentState.isExtracting ? (
            <div className="rounded-[18px] bg-white px-4 py-3 text-sm font-medium text-secondary/55">
              Membaca file dan menyiapkan autofill...
            </div>
          ) : null}

          {documentState.extraction ? (
            <div className="grid gap-2 rounded-[18px] border border-emerald-200 bg-emerald-50 px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-emerald-700">
                  Field diisi dari dokumen
                </p>
                <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
                  {documentState.extraction.confidence}
                </span>
              </div>
              <p className="text-sm text-emerald-700/80">
                {documentTypeLabelMap[documentState.extraction.documentType]}
                {documentState.extraction.sourceHint
                  ? ` - ${documentState.extraction.sourceHint}`
                  : ""}
              </p>
            </div>
          ) : null}
        </div>
      ) : null}

      <section className="rounded-[22px] border border-primary/10 bg-[linear-gradient(180deg,#ffffff_0%,#f7f9ff_100%)] px-4 py-3.5 text-center shadow-[0_12px_28px_rgba(48,102,190,0.06)]">
        <p className="text-sm font-medium text-secondary/32">Nominal Penghasilan</p>
        <input
          className="mt-1 w-full bg-transparent text-center text-[2.35rem] font-bold leading-none tracking-[-0.07em] text-secondary outline-none placeholder:text-secondary/25"
          inputMode="numeric"
          onChange={(event) => setAmountInput(event.target.value)}
          placeholder="Rp 0"
          value={amountInput}
        />
        <span className="mt-2.5 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-600">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Siap dicatat ke ledger
        </span>
      </section>

      <div className="grid gap-3">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-secondary">Sumber Penghasilan</span>
          <div className="grid gap-2">
            {sourceOptions.map((option) => {
              const isSelected = option.id === selectedSourceId;

              return (
                <button
                  className={`flex min-h-[58px] items-center gap-3 rounded-[18px] border px-4 text-left transition-colors ${
                    isSelected ? "border-primary bg-primary/5" : "border-black/10 bg-white"
                  }`}
                  key={option.id}
                  onClick={() => setSelectedSourceId(option.id)}
                  type="button"
                >
                  <span
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${
                      isSelected ? "bg-primary text-white" : "bg-primary/10 text-primary"
                    }`}
                  >
                    <Icon className="h-4 w-4" icon={option.icon} />
                  </span>
                  <span className="text-sm font-semibold text-secondary">{option.label}</span>
                </button>
              );
            })}
          </div>
        </label>

        <label className="grid gap-1.5">
          <span className="text-sm font-semibold text-secondary">Tanggal</span>
          <div className="flex min-h-[58px] items-center justify-between rounded-[18px] border border-black/10 bg-white px-4 text-left shadow-[0_6px_18px_rgba(23,23,56,0.03)]">
            <span className="text-sm font-medium text-secondary">Hari ini - {todayLabel}</span>
            <Icon className="h-4 w-4 text-secondary/35" icon="solar:calendar-linear" />
          </div>
        </label>

        <label className="grid gap-1.5">
          <span className="text-sm font-semibold text-secondary">
            Deskripsi <span className="font-medium text-secondary/35">(Opsional)</span>
          </span>
          <input
            className="min-h-[58px] rounded-[18px] border border-black/10 bg-white px-4 text-sm font-medium text-secondary outline-none shadow-[0_6px_18px_rgba(23,23,56,0.03)] placeholder:text-secondary/28"
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Tambahkan catatan..."
            value={description}
          />
        </label>
      </div>

      <div className="grid gap-2 border-t border-black/6 pt-3.5">
        <PressButton
          className="min-h-[58px] w-full justify-center text-base"
          disabled={!canSubmit || isSubmitting}
          onClick={handleSubmit}
          variant="primary"
        >
          {isSubmitting ? "Menyimpan..." : "Simpan ke Ledger"}
        </PressButton>
        {errorMessage ? (
          <p className="text-center text-xs font-medium text-red-500">{errorMessage}</p>
        ) : (
          <p className="text-center text-xs leading-5 text-secondary/32">
            Entri akan diverifikasi dan diamankan dengan SHA-256
          </p>
        )}
      </div>
    </div>
  );
}
