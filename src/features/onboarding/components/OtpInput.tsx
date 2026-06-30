"use client";

import { useMemo, useRef } from "react";

type OtpInputProps = {
  length?: number;
  onChange: (value: string) => void;
  value: string;
};

export function OtpInput({ length = 6, onChange, value }: OtpInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = useMemo(() => {
    return Array.from({ length }, (_, index) => value[index] ?? "");
  }, [length, value]);

  function updateDigit(nextDigit: string, index: number) {
    const sanitizedDigit = nextDigit.replace(/\D/g, "").slice(-1);
    const nextDigits = [...digits];
    nextDigits[index] = sanitizedDigit;
    onChange(nextDigits.join(""));

    if (sanitizedDigit && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  }

  function handlePaste(event: React.ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const pastedDigits = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);

    if (!pastedDigits) {
      return;
    }

    onChange(pastedDigits);
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {digits.map((digit, index) => (
        <input
          className={`h-14 w-11 rounded-[14px] border text-center text-[1.55rem] font-bold outline-none transition-colors sm:w-12 ${
            digit
              ? "border-secondary bg-primary text-white"
              : "border-black/10 bg-white text-secondary focus:border-primary"
          }`}
          inputMode="numeric"
          key={index}
          maxLength={1}
          onChange={(event) => updateDigit(event.target.value, index)}
          onKeyDown={(event) => handleKeyDown(event, index)}
          onPaste={handlePaste}
          ref={(node) => {
            refs.current[index] = node;
          }}
          value={digit}
        />
      ))}
    </div>
  );
}
