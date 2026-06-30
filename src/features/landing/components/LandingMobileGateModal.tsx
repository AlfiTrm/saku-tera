"use client";

import { Icon } from "@iconify/react";
import PressButton from "@/src/shared/components/buttons/PressButton";
import { CenterModal } from "@/src/shared/components/overlays";

type LandingMobileGateModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function LandingMobileGateModal({
  isOpen,
  onClose,
}: LandingMobileGateModalProps) {
  return (
    <CenterModal isOpen={isOpen} onClose={onClose}>
      <div className="grid gap-6 p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="grid gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Icon className="h-6 w-6" icon="solar:smartphone-2-bold" />
            </span>
            <div className="grid gap-2">
              <h3 className="text-[1.75rem] font-bold leading-[1] tracking-[-0.04em] text-secondary">
                Akses penuh tersedia di mobile
              </h3>
              <p className="text-sm leading-6 text-secondary/72">
                Sakutera dirancang sebagai web app yang paling nyaman dipakai dari
                ponsel. Buka link ini di mobile untuk install lalu lanjut ke app.
              </p>
            </div>
          </div>

          <button
            aria-label="Tutup modal"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/6 text-secondary transition-colors duration-150 hover:bg-secondary/10"
            onClick={onClose}
            type="button"
          >
            <Icon className="h-5 w-5" icon="solar:close-circle-bold" />
          </button>
        </div>

        <div className="grid gap-3 rounded-[1.5rem] bg-primary/6 p-4 text-sm leading-6 text-secondary/78">
          <p>Pakai browser di ponsel untuk membuka Sakutera.</p>
          <p>Tap Daftar Gratis lalu install app saat prompt muncul.</p>
          <p>Setelah terpasang, kamu langsung masuk ke flow onboarding dan dashboard.</p>
        </div>

        <PressButton className="w-full justify-center py-3" onClick={onClose} variant="primary">
          Mengerti
        </PressButton>
      </div>
    </CenterModal>
  );
}
