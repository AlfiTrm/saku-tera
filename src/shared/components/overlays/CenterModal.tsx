"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

type CenterModalProps = {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
};

export function CenterModal({ children, isOpen, onClose }: CenterModalProps) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.button
            animate={{ opacity: 1 }}
            aria-label="Tutup modal"
            className="fixed inset-0 z-40 bg-secondary/38"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={onClose}
            type="button"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="w-full max-w-[28rem] rounded-[2rem] bg-[#fffdf8]"
              exit={{ opacity: 0, scale: 0.98, y: 12 }}
              initial={{ opacity: 0, scale: 0.98, y: 12 }}
              role="dialog"
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
