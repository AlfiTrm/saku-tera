"use client";

import { Icon } from "@iconify/react";
import { useMemo, useState } from "react";
import PressButton from "@/src/shared/components/buttons/PressButton";
import { BottomSheet } from "@/src/shared/components/overlays";
import type {
  GrantPassportAccessPayload,
  PassportAccessScope,
  PassportOrganization,
} from "@/src/features/dashboard/types/passportAccess";

type PassportGrantSheetProps = {
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: GrantPassportAccessPayload) => Promise<void>;
  organizations: PassportOrganization[];
};

const scopeOptions: Array<{
  description: string;
  label: string;
  value: PassportAccessScope;
}> = [
  { description: "Estimasi penghasilan bulanan", label: "EMI", value: "emi" },
  { description: "Kestabilan pemasukan", label: "Tren Stabilitas", value: "stability" },
  { description: "Level risiko data", label: "Risiko", value: "risk" },
  { description: "Bagikan semua data passport", label: "Akses penuh", value: "full" },
];

const expiryOptions = [
  { label: "30 hari", value: 30 },
  { label: "90 hari", value: 90 },
  { label: "Tanpa batas", value: 0 },
];

export function PassportGrantSheet({
  isOpen,
  isSubmitting,
  onClose,
  onSubmit,
  organizations,
}: PassportGrantSheetProps) {
  const [organizationId, setOrganizationId] = useState("");
  const [selectedScopes, setSelectedScopes] = useState<PassportAccessScope[]>([
    "emi",
    "stability",
    "risk",
  ]);
  const [expiresInDays, setExpiresInDays] = useState(30);
  const [purpose, setPurpose] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const canSubmit = organizationId !== "" && selectedScopes.length > 0;
  const selectedOrganization = useMemo(
    () => organizations.find((organization) => organization.id === organizationId),
    [organizationId, organizations],
  );

  function toggleScope(scope: PassportAccessScope) {
    setSelectedScopes((currentScopes) => {
      if (scope === "full") {
        return currentScopes.includes("full") ? [] : ["full"];
      }

      const withoutFull = currentScopes.filter(
        (currentScope) => currentScope !== "full",
      );

      if (withoutFull.includes(scope)) {
        return withoutFull.filter((currentScope) => currentScope !== scope);
      }

      return [...withoutFull, scope];
    });
  }

  async function handleSubmit() {
    if (!canSubmit || isSubmitting) {
      return;
    }

    try {
      setErrorMessage("");
      await onSubmit({
        dataScope: selectedScopes,
        expiresInDays,
        organizationId,
        purpose: purpose.trim() || undefined,
      });

      setOrganizationId("");
      setSelectedScopes(["emi", "stability", "risk"]);
      setExpiresInDays(30);
      setPurpose("");
      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Akses belum bisa diberikan.",
      );
    }
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="grid gap-4 px-5 pb-[calc(1.2rem+env(safe-area-inset-bottom))] pt-3">
        <div className="mx-auto h-1.5 w-12 rounded-full bg-secondary/10" />

        <div className="grid gap-1">
          <p className="text-[11px] font-medium text-secondary/30">Passport Access</p>
          <h2 className="text-[1.35rem] font-bold tracking-[-0.04em] text-secondary">
            Bagikan ke Pihak Baru
          </h2>
        </div>

        <section className="grid gap-2">
          <p className="text-sm font-semibold text-secondary">Pilih organisasi</p>
          <div className="grid gap-2">
            {organizations.map((organization) => {
              const isSelected = organization.id === organizationId;

              return (
                <button
                  className={`flex min-h-[58px] items-center justify-between rounded-[18px] border px-4 text-left transition-colors ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-black/10 bg-white"
                  }`}
                  key={organization.id}
                  onClick={() => setOrganizationId(organization.id)}
                  type="button"
                >
                  <div className="grid gap-0.5">
                    <span className="text-sm font-semibold text-secondary">
                      {organization.name}
                    </span>
                    <span className="text-[11px] font-medium text-secondary/38">
                      {organization.type}
                    </span>
                  </div>
                  {isSelected ? (
                    <Icon
                      className="h-5 w-5 text-primary"
                      icon="solar:check-circle-bold"
                    />
                  ) : null}
                </button>
              );
            })}
          </div>
        </section>

        <section className="grid gap-2">
          <p className="text-sm font-semibold text-secondary">Data yang dibagikan</p>
          <div className="grid gap-2">
            {scopeOptions.map((scope) => {
              const isSelected = selectedScopes.includes(scope.value);

              return (
                <button
                  className={`flex min-h-[56px] items-center justify-between rounded-[18px] border px-4 text-left transition-colors ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-black/10 bg-white"
                  }`}
                  key={scope.value}
                  onClick={() => toggleScope(scope.value)}
                  type="button"
                >
                  <div className="grid gap-0.5">
                    <span className="text-sm font-semibold text-secondary">
                      {scope.label}
                    </span>
                    <span className="text-[11px] font-medium text-secondary/38">
                      {scope.description}
                    </span>
                  </div>
                  <span
                    className={`inline-flex h-5 w-5 items-center justify-center rounded-full border ${
                      isSelected
                        ? "border-primary bg-primary text-white"
                        : "border-black/12 bg-white"
                    }`}
                  >
                    {isSelected ? <Icon className="h-3 w-3" icon="solar:check-read-bold" /> : null}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="grid gap-2">
          <p className="text-sm font-semibold text-secondary">Durasi akses</p>
          <div className="grid grid-cols-3 gap-2">
            {expiryOptions.map((option) => (
              <button
                className={`min-h-11 rounded-full border px-3 text-sm font-semibold transition-colors ${
                  expiresInDays === option.value
                    ? "border-secondary bg-secondary text-white"
                    : "border-black/10 bg-white text-secondary/52"
                }`}
                key={option.label}
                onClick={() => setExpiresInDays(option.value)}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-secondary">
            Tujuan <span className="text-secondary/36">(opsional)</span>
          </span>
          <input
            className="min-h-[56px] rounded-[18px] border border-black/10 bg-white px-4 text-sm font-medium text-secondary outline-none placeholder:text-secondary/26"
            onChange={(event) => setPurpose(event.target.value)}
            placeholder="Misal: Penilaian kredit motor"
            value={purpose}
          />
        </label>

        {selectedOrganization ? (
          <div className="rounded-[18px] bg-primary/5 px-4 py-3 text-sm leading-6 text-secondary/58">
            Akses akan diberikan ke <span className="font-semibold text-secondary">{selectedOrganization.name}</span>
            {" "}untuk data passport yang kamu pilih.
          </div>
        ) : null}

        {errorMessage ? (
          <p className="text-center text-sm font-medium text-red-500">{errorMessage}</p>
        ) : null}

        <PressButton
          className="min-h-[58px] w-full justify-center text-base"
          disabled={!canSubmit || isSubmitting}
          onClick={handleSubmit}
          variant="primary"
        >
          {isSubmitting ? "Membagikan..." : "Bagikan Akses"}
        </PressButton>
      </div>
    </BottomSheet>
  );
}
