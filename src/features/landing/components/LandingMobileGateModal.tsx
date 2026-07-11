"use client";

import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

type LandingMobileGateModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function LandingMobileGateModal({
  isOpen,
  onClose,
}: LandingMobileGateModalProps) {
  const [installUrl, setInstallUrl] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setInstallUrl(`${window.location.origin}/?install=pwa`);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const qrSrc = useMemo(() => {
    if (!installUrl) {
      return "";
    }

    return `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(installUrl)}`;
  }, [installUrl]);

  if (!isMounted) {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
        >
          <button
            aria-label="Tutup modal"
            className="pointer-events-auto absolute inset-0 cursor-default bg-transparent"
            onClick={onClose}
            type="button"
          />

          <motion.section
            animate={{ opacity: 1, scale: 1, y: 0 }}
            aria-labelledby="install-sakutera-title"
            aria-modal="true"
            className="pointer-events-auto relative w-full max-w-[46rem] overflow-hidden rounded-[1.5rem] border border-secondary/12 bg-[#fffdf8] shadow-[0_24px_70px_rgba(23,23,56,0.18)]"
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <header className="flex h-16 items-center justify-between border-b border-secondary/10 px-5 sm:px-7">
              <Image
                alt="SakuTera"
                className="h-auto w-31"
                height={28}
                src="/icons/sakutera-full.svg"
                width={126}
              />

              <button
                aria-label="Tutup modal"
                className="flex h-9 w-9 items-center justify-center rounded-full text-secondary/55 transition-colors hover:bg-secondary/6 hover:text-secondary cursor-pointer"
                onClick={onClose}
                type="button"
              >
                <Icon className="h-5 w-5" icon="solar:close-circle-linear" />
              </button>
            </header>

            <div className="grid items-center gap-7 px-6 py-8 sm:grid-cols-[minmax(0,1fr)_auto] sm:px-9 sm:py-10">
              <div className="grid gap-4 text-center sm:text-left">

                <div className="grid gap-2">
                  <h2
                    className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-[1.02] tracking-[-0.045em] text-secondary"
                    id="install-sakutera-title"
                  >
                    Lanjutkan di ponselmu
                  </h2>
                  <p className="max-w-md text-sm leading-6 text-secondary/65 sm:text-base">
                    Scan QR untuk membuka Sakutera dan langsung lanjut ke proses install.
                  </p>
                </div>
              </div>

              <div className="grid justify-items-center gap-3">
                <div className="rounded-2xl border border-primary/25 bg-white p-2.5">
                  {qrSrc ? (
                    <img
                      alt="QR code untuk membuka Sakutera di ponsel"
                      className="h-36 w-36 rounded-lg sm:h-40 sm:w-40"
                      height={160}
                      src={qrSrc}
                      width={160}
                    />
                  ) : (
                    <div className="h-36 w-36 animate-pulse rounded-lg bg-secondary/6 sm:h-40 sm:w-40" />
                  )}
                </div>
              </div>
            </div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
