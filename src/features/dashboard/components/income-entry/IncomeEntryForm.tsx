"use client";

import { Icon } from "@iconify/react";
import { useRef, useState } from "react";
import PressButton from "@/src/shared/components/buttons/PressButton";
import { useIncomeEntrySheet } from "@/src/features/dashboard/hooks/useIncomeEntrySheet";
import type {
  IncomeDocumentType,
  IncomeSourceOption,
} from "@/src/features/dashboard/types/dashboardData";
import { IncomeSourcePickerSheet } from "./IncomeSourcePickerSheet";

type IncomeEntryFormProps = {
  onClose: () => void;
  onSuccess: () => Promise<void>;
  sourceOptions: IncomeSourceOption[];
};

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
  const [isSourcePickerOpen, setIsSourcePickerOpen] = useState(false);
  const {
    amountInput,
    canSubmit,
    description,
    documentState,
    errorMessage,
    handleDocumentSelect,
    handleSubmit,
    isSubmitting,
    selectedSourceId,
    setAmountInput,
    setDescription,
    setSelectedSourceId,
  } = useIncomeEntrySheet({
    onClose,
    onSuccess,
    sourceOptions,
  });
  const selectedSource = sourceOptions.find(
    (source) => source.id === selectedSourceId,
  );

  function openFilePicker() {
    if (!documentState.isExtracting) {
      fileInputRef.current?.click();
    }
  }

  return (
    <div className="grid gap-4">
      <section className="rounded-[22px] border border-primary/10 bg-[linear-gradient(180deg,#ffffff_0%,#f7f9ff_100%)] px-4 py-4 text-center shadow-[0_12px_28px_rgba(48,102,190,0.06)]">
        <label className="block">
          <span className="text-sm font-medium text-secondary/40">
            Nominal Penghasilan
          </span>
          <input
            autoFocus
            className="mt-1.5 w-full bg-transparent text-center text-[2.4rem] font-bold leading-none tracking-[-0.07em] text-secondary outline-none placeholder:text-secondary/22"
            inputMode="numeric"
            onChange={(event) => setAmountInput(event.target.value)}
            placeholder="Rp 0"
            value={amountInput}
          />
        </label>
        <p className="mt-2.5 text-xs font-medium text-secondary/35">
          Minimum pencatatan Rp 10.000
        </p>
      </section>

      <section className="grid gap-2">
        <div className="flex items-center justify-between px-1">
          <p className="text-sm font-semibold text-secondary">Autofill dari dokumen</p>
          <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-primary/55">
            Opsional
          </span>
        </div>

        <input
          accept=".pdf,.png,.jpg,.jpeg,.webp,.heic,application/pdf,image/jpeg,image/png,image/webp,image/heic"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0] ?? null;
            void handleDocumentSelect(file);
            event.target.value = "";
          }}
          ref={fileInputRef}
          type="file"
        />

        <button
          className="flex min-h-[86px] w-full items-center gap-3 rounded-[20px] border border-dashed border-primary/30 bg-primary/[0.025] px-4 text-left transition-colors hover:border-primary/50 disabled:cursor-wait disabled:opacity-65"
          disabled={documentState.isExtracting}
          onClick={openFilePicker}
          type="button"
        >
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] bg-primary text-white">
            <Icon
              className={`h-5 w-5 ${documentState.isExtracting ? "animate-spin" : ""}`}
              icon={
                documentState.isExtracting
                  ? "solar:refresh-circle-bold"
                  : "solar:upload-bold"
              }
            />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-secondary">
              {documentState.isExtracting
                ? "Membaca dokumen..."
                : documentState.fileName || "Unggah dokumen"}
            </span>
            <span className="mt-1 block text-xs leading-5 text-secondary/42">
              PDF atau gambar slip, invoice, dan bukti transfer.
            </span>
          </span>
          <span className="shrink-0 text-xs font-semibold text-primary">
            {documentState.fileName ? "Ganti" : "Pilih"}
          </span>
        </button>

        {documentState.error ? (
          <div className="flex items-start gap-3 rounded-[17px] border border-amber-200 bg-amber-50 px-3.5 py-3 text-amber-900">
            <Icon
              className="mt-0.5 h-5 w-5 shrink-0"
              icon="solar:danger-triangle-bold"
            />
            <div>
              <p className="text-sm font-semibold">Autofill tidak berhasil</p>
              <p className="mt-0.5 text-xs leading-5 text-amber-900/70">
                {documentState.error}
              </p>
            </div>
          </div>
        ) : null}

        {documentState.extraction ? (
          <div className="flex items-start gap-3 rounded-[17px] border border-emerald-200 bg-emerald-50 px-3.5 py-3">
            <Icon
              className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600"
              icon="solar:check-circle-bold"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-emerald-700">
                Form berhasil diisi otomatis
              </p>
              <p className="mt-0.5 truncate text-xs text-emerald-700/70">
                {documentTypeLabelMap[documentState.extraction.documentType]}
                {documentState.extraction.sourceHint
                  ? ` - ${documentState.extraction.sourceHint}`
                  : ""}
              </p>
            </div>
            <span className="rounded-full bg-white px-2 py-1 text-[9px] font-semibold uppercase text-emerald-700">
              {documentState.extraction.confidence}
            </span>
          </div>
        ) : null}
      </section>

      <div className="grid gap-3">
        <div className="grid gap-1.5">
          <span className="text-sm font-semibold text-secondary">
            Sumber Penghasilan
          </span>
          <button
            aria-expanded={isSourcePickerOpen}
            aria-haspopup="dialog"
            className="flex min-h-[58px] items-center gap-3 rounded-[18px] border border-black/10 bg-white px-4 text-left transition-colors hover:border-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={sourceOptions.length === 0}
            onClick={() => setIsSourcePickerOpen(true)}
            type="button"
          >
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon
                className="h-[18px] w-[18px]"
                icon={selectedSource?.icon || "solar:wallet-money-bold"}
              />
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-semibold text-secondary">
              {selectedSource?.label || "Pilih sumber penghasilan"}
            </span>
            <Icon
              className="h-5 w-5 shrink-0 text-secondary/35"
              icon="solar:alt-arrow-down-linear"
            />
          </button>
        </div>

        <label className="grid gap-1.5">
          <span className="text-sm font-semibold text-secondary">Tanggal</span>
          <div className="flex min-h-[58px] items-center justify-between rounded-[18px] border border-black/10 bg-white px-4 text-left">
            <span className="text-sm font-medium text-secondary">
              Hari ini - {todayLabel}
            </span>
            <Icon className="h-4 w-4 text-secondary/35" icon="solar:calendar-linear" />
          </div>
        </label>

        <label className="grid gap-1.5">
          <span className="text-sm font-semibold text-secondary">
            Deskripsi <span className="font-medium text-secondary/35">(Opsional)</span>
          </span>
          <input
            className="min-h-[58px] rounded-[18px] border border-black/10 bg-white px-4 text-sm font-medium text-secondary outline-none placeholder:text-secondary/28 focus:border-primary/35"
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Tambahkan catatan..."
            value={description}
          />
        </label>
      </div>

      <div className="grid gap-2 border-t border-black/6 pt-3.5">
        <PressButton
          className="min-h-[58px] w-full justify-center text-base"
          disabled={!canSubmit || isSubmitting || documentState.isExtracting}
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

      <IncomeSourcePickerSheet
        isOpen={isSourcePickerOpen}
        onClose={() => setIsSourcePickerOpen(false)}
        onSelect={setSelectedSourceId}
        options={sourceOptions}
        selectedSourceId={selectedSourceId}
      />
    </div>
  );
}
