"use client";

import PressButton from "@/src/shared/components/buttons/PressButton";
import { CenterModal } from "@/src/shared/components/overlays";

type InstallInstructionsProps = {
  isInstalled: boolean;
  onClose: () => void;
  platform: "ios" | "android" | "desktop";
  mode?: "platform" | "ios-open-safari";
  variant?: "popover" | "modal";
};

const instructionsByPlatform = {
  ios: [
    "Buka menu Share di Safari.",
    "Pilih Tambah ke Layar Utama.",
    "Simpan SakuTera lalu buka dari home screen.",
  ],
  android: [
    "Buka menu browser di kanan atas.",
    "Pilih Install app atau Tambahkan ke layar utama.",
    "Setelah terpasang, buka SakuTera dari home screen.",
  ],
  desktop: [
    "Buka menu browser atau ikon install di address bar.",
    "Pilih Install app untuk menyimpan SakuTera.",
    "Setelah terpasang, buka dari shortcut aplikasi browser.",
  ],
} as const;

export function InstallInstructions({
  isInstalled,
  mode = "platform",
  onClose,
  platform,
  variant = "popover",
}: InstallInstructionsProps) {
  const title =
    mode === "ios-open-safari"
      ? "Buka di Safari"
      : isInstalled
        ? "Buka App"
        : "Install SakuTera";
  const description =
    mode === "ios-open-safari"
      ? "Di iPhone dan iPad, instalasi PWA hanya bisa dilakukan dari Safari."
      : isInstalled
        ? "Aplikasi sudah terpasang. Buka SakuTera dari home screen atau daftar aplikasi perangkatmu."
        : "Browser ini tidak menampilkan prompt install otomatis, jadi pakai langkah manual berikut.";
  const instructions =
    mode === "ios-open-safari"
      ? [
          "Buka halaman ini dengan Safari.",
          "Tap Share di bagian bawah browser.",
          "Pilih Tambah ke Layar Utama untuk memasang SakuTera.",
        ]
      : instructionsByPlatform[platform];

  const content = (
    <div className="grid gap-3">
      <div className="grid gap-1">
        <p className="text-sm font-semibold text-secondary">{title}</p>
        <p className="text-sm leading-6 text-secondary/70">{description}</p>
      </div>

      <ol className="grid gap-2 text-sm leading-6 text-secondary/80">
        {instructions.map((step) => (
          <li className="rounded-xl bg-black/3 px-3 py-2" key={step}>
            {step}
          </li>
        ))}
      </ol>

      <PressButton
        className="w-full justify-center px-4 py-2 text-sm"
        onClick={onClose}
        variant="outline"
      >
        Tutup
      </PressButton>
    </div>
  );

  if (variant === "modal") {
    return (
      <CenterModal isOpen onClose={onClose}>
        <div className="p-6 sm:p-7">{content}</div>
      </CenterModal>
    );
  }

  return (
    <div className="absolute right-0 top-[calc(100%+0.75rem)] z-20 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-black/10 bg-white p-4 text-left shadow-[0_16px_50px_rgba(23,23,56,0.14)]">
      {content}
    </div>
  );
}
