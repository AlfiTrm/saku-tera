"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

type BottomSheetProps = {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
};

export function BottomSheet({ children, isOpen, onClose }: BottomSheetProps) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.button
            animate={{ opacity: 1 }}
            aria-label="Tutup panel"
            className="fixed inset-0 z-40 bg-secondary/28"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={onClose}
            type="button"
          />
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[29rem] rounded-t-[2rem] bg-[#fffdf8] shadow-[0_-16px_48px_rgba(23,23,56,0.14)]"
            exit={{ opacity: 0, y: 24 }}
            initial={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
