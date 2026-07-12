"use client";

import { Icon } from "@iconify/react";
import { useMemo, useRef, useState } from "react";
import { BottomSheet } from "@/src/shared/components/overlays";
import { getTransactionSourceOptions } from "@/src/features/dashboard/services/dashboardService";
import type { IncomeSourceOption } from "@/src/features/dashboard/types/dashboardData";

type IncomeSourcePickerSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (sourceId: string) => void;
  options: IncomeSourceOption[];
  selectedSourceId: string;
};

export function IncomeSourcePickerSheet({
  isOpen,
  onClose,
  onSelect,
  options,
  selectedSourceId,
}: IncomeSourcePickerSheetProps) {
  const [query, setQuery] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [providerOptions, setProviderOptions] = useState<IncomeSourceOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const providerCacheRef = useRef(new Map<string, IncomeSourceOption[]>());
  const requestIdRef = useRef(0);
  const providers = useMemo(
    () => Array.from(new Set(options.map((option) => option.provider))).filter(Boolean),
    [options],
  );
  const activeOptions = selectedProvider ? providerOptions : options;
  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("id");

    if (!normalizedQuery) {
      return activeOptions;
    }

    return activeOptions.filter((option) =>
      `${option.name} ${option.provider}`
        .toLocaleLowerCase("id")
        .includes(normalizedQuery),
    );
  }, [activeOptions, query]);

  function closeSheet() {
    requestIdRef.current += 1;
    setQuery("");
    setSelectedProvider("");
    setProviderOptions([]);
    setIsLoading(false);
    setLoadError("");
    onClose();
  }

  function selectSource(sourceId: string) {
    onSelect(sourceId);
    closeSheet();
  }

  async function selectProvider(provider: string) {
    if (provider === selectedProvider || isLoading) {
      return;
    }

    setSelectedProvider(provider);
    setQuery("");
    setLoadError("");

    if (!provider) {
      requestIdRef.current += 1;
      setProviderOptions([]);
      return;
    }

    const cachedOptions = providerCacheRef.current.get(provider);

    if (cachedOptions) {
      setProviderOptions(cachedOptions);
      return;
    }

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setIsLoading(true);

    try {
      const nextOptions = await getTransactionSourceOptions(provider);

      if (requestIdRef.current !== requestId) {
        return;
      }

      providerCacheRef.current.set(provider, nextOptions);
      setProviderOptions(nextOptions);
    } catch (error) {
      if (requestIdRef.current !== requestId) {
        return;
      }

      setProviderOptions([]);
      setLoadError(
        error instanceof Error
          ? error.message
          : "Sumber penghasilan belum bisa dimuat.",
      );
    } finally {
      if (requestIdRef.current === requestId) {
        setIsLoading(false);
      }
    }
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={closeSheet}>
      <div className="flex max-h-[78dvh] flex-col px-5 pb-[calc(1.2rem+env(safe-area-inset-bottom))] pt-3">
        <div className="mx-auto h-1.5 w-12 shrink-0 rounded-full bg-secondary/10" />

        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[1.35rem] font-bold tracking-[-0.04em] text-secondary">
              Pilih sumber
            </h2>
            <p className="mt-1 text-sm text-secondary/45">
              Dari mana penghasilan ini berasal?
            </p>
          </div>
          <button
            aria-label="Tutup pilihan sumber"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-secondary/55 hover:bg-secondary/5"
            onClick={closeSheet}
            type="button"
          >
            <Icon className="h-5 w-5" icon="solar:close-circle-linear" />
          </button>
        </div>

        <div className="mt-4">
          <p className="mb-2 text-[11px] font-semibold text-secondary/42">
            Kategori provider
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {["", ...providers].map((provider) => {
              const isSelected = provider === selectedProvider;

              return (
                <button
                  aria-pressed={isSelected}
                  className={`min-h-9 shrink-0 rounded-full border px-3.5 text-xs font-semibold transition-colors ${
                    isSelected
                      ? "border-secondary bg-secondary text-white"
                      : "border-black/10 bg-white text-secondary/52"
                  }`}
                  disabled={isLoading}
                  key={provider || "all"}
                  onClick={() => void selectProvider(provider)}
                  type="button"
                >
                  {provider || "Semua"}
                </button>
              );
            })}
          </div>
        </div>

        <label className="mt-4 flex min-h-12 items-center gap-2 rounded-[16px] border border-black/8 bg-white px-3 focus-within:border-primary/45 focus-within:ring-2 focus-within:ring-primary/10">
          <Icon className="h-5 w-5 shrink-0 text-secondary/35" icon="solar:magnifer-linear" />
          <input
            autoFocus
            className="min-w-0 flex-1 bg-transparent text-sm font-medium text-secondary outline-none placeholder:text-secondary/35"
            disabled={isLoading}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari sumber penghasilan..."
            value={query}
          />
        </label>

        <div className="mt-3 min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {isLoading ? (
            <div className="grid justify-items-center gap-2 py-8 text-center">
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary/20 border-r-primary" />
              <p className="text-sm font-medium text-secondary/42">
                Memuat sumber {selectedProvider}...
              </p>
            </div>
          ) : loadError ? (
            <div className="grid justify-items-center gap-2 rounded-[16px] bg-red-50 px-4 py-6 text-center text-red-600">
              <Icon className="h-6 w-6" icon="solar:danger-circle-bold" />
              <p className="text-sm font-medium">{loadError}</p>
            </div>
          ) : filteredOptions.map((option) => {
            const isSelected = option.id === selectedSourceId;

            return (
              <button
                aria-pressed={isSelected}
                className={`flex min-h-14 w-full items-center gap-3 rounded-[16px] px-3 text-left transition-colors ${
                  isSelected
                    ? "bg-primary/8 text-secondary"
                    : "text-secondary/68 hover:bg-secondary/[0.035]"
                }`}
                key={option.id}
                onClick={() => selectSource(option.id)}
                type="button"
              >
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" icon={option.icon} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">
                    {option.name}
                  </span>
                  <span className="mt-0.5 block text-[11px] font-medium text-secondary/38">
                    {option.provider}
                  </span>
                </span>
                <Icon
                  className={`h-5 w-5 text-primary ${isSelected ? "opacity-100" : "opacity-0"}`}
                  icon="solar:check-circle-bold"
                />
              </button>
            );
          })}

          {!isLoading && !loadError && filteredOptions.length === 0 ? (
            <div className="grid justify-items-center gap-2 py-8 text-center">
              <Icon className="h-7 w-7 text-secondary/25" icon="solar:magnifer-linear" />
              <p className="text-sm font-medium text-secondary/42">
                Sumber tidak ditemukan.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </BottomSheet>
  );
}
