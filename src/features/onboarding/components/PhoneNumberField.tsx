"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type PhoneCountry = {
  code: "id" | "sg" | "my";
  dialCode: string;
  formatHint: string;
  label: string;
  placeholder: string;
};

const countries: PhoneCountry[] = [
  {
    code: "id",
    dialCode: "+62",
    formatHint: "08xx-xxxx-xxxx",
    label: "Indonesia",
    placeholder: "812-3456-7890",
  },
  {
    code: "sg",
    dialCode: "+65",
    formatHint: "8xxx-xxxx",
    label: "Singapore",
    placeholder: "8123-4567",
  },
  {
    code: "my",
    dialCode: "+60",
    formatHint: "1x-xxx-xxxx",
    label: "Malaysia",
    placeholder: "12-345-6789",
  },
];

type PhoneNumberFieldProps = {
  onChange: (value: { phone: string; phoneDisplay: string }) => void;
  value: string;
};

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function getCountryFromValue(value: string) {
  return (
    countries.find((country) => value.startsWith(country.dialCode)) ?? countries[0]
  );
}

function getLocalNumber(value: string, dialCode: string) {
  const sanitized = digitsOnly(value);
  const dialDigits = digitsOnly(dialCode);

  if (!sanitized.startsWith(dialDigits)) {
    return sanitized;
  }

  return sanitized.slice(dialDigits.length);
}

function formatLocalNumber(localNumber: string) {
  const limitedValue = digitsOnly(localNumber).slice(0, 12);

  if (limitedValue.length <= 4) {
    return limitedValue;
  }

  if (limitedValue.length <= 8) {
    return `${limitedValue.slice(0, 4)}-${limitedValue.slice(4)}`;
  }

  return `${limitedValue.slice(0, 4)}-${limitedValue.slice(4, 8)}-${limitedValue.slice(8)}`;
}

function FlagBadge({ country }: { country: PhoneCountry }) {
  const badgeClassName =
    country.code === "id"
      ? "bg-[linear-gradient(180deg,#ef4444_0%,#ef4444_50%,#ffffff_50%,#ffffff_100%)]"
      : country.code === "sg"
        ? "bg-[linear-gradient(180deg,#ef4444_0%,#ef4444_50%,#ffffff_50%,#ffffff_100%)]"
        : "bg-[linear-gradient(180deg,#dc2626_0%,#dc2626_33%,#ffffff_33%,#ffffff_66%,#1d4ed8_66%,#1d4ed8_100%)]";

  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-5 w-7 shrink-0 rounded-[4px] border border-black/8 ${badgeClassName}`}
    />
  );
}

export function PhoneNumberField({ onChange, value }: PhoneNumberFieldProps) {
  const derivedCountry = useMemo(() => getCountryFromValue(value), [value]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const localNumber = formatLocalNumber(
    getLocalNumber(value, derivedCountry.dialCode),
  );

  useEffect(() => {
    if (!isPickerOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsPickerOpen(false);
      }
    }

    window.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isPickerOpen]);

  const formatDescription = `${derivedCountry.formatHint} - Kode OTP akan dikirim via SMS/WhatsApp`;

  function emitNextValue(country: PhoneCountry, rawLocalNumber: string) {
    const cleanedLocalNumber = digitsOnly(rawLocalNumber);
    const fullPhone = `${country.dialCode}${cleanedLocalNumber}`;
    const displayValue = `${country.dialCode} ${formatLocalNumber(cleanedLocalNumber)}`.trim();

    onChange({
      phone: fullPhone,
      phoneDisplay: displayValue,
    });
  }

  function handleCountrySelect(country: PhoneCountry) {
    setIsPickerOpen(false);
    emitNextValue(country, localNumber);
  }

  function handleLocalNumberChange(nextValue: string) {
    const formattedNumber = formatLocalNumber(nextValue);
    emitNextValue(derivedCountry, formattedNumber);
  }

  return (
    <div className="grid gap-2" ref={wrapperRef}>
      <div className="relative flex min-h-[68px] overflow-visible rounded-[18px] border border-primary bg-white shadow-[0_0_0_1px_rgba(48,102,190,0.08)]">
        <button
          aria-expanded={isPickerOpen}
          aria-haspopup="listbox"
          className="flex w-[92px] shrink-0 touch-manipulation items-center justify-center gap-2 rounded-l-[18px] border-r border-black/8 px-3 text-left [-webkit-tap-highlight-color:transparent] active:bg-primary/5"
          onClick={() => setIsPickerOpen((currentValue) => !currentValue)}
          type="button"
        >
          <FlagBadge country={derivedCountry} />
          <span className="text-[0.98rem] font-semibold text-secondary">
            {derivedCountry.dialCode}
          </span>
        </button>

        <input
          autoComplete="tel-national"
          className="h-full min-w-0 flex-1 rounded-r-[18px] bg-white px-4 text-[1.02rem] font-medium text-secondary outline-none placeholder:text-[0.95rem] placeholder:text-secondary/35"
          inputMode="numeric"
          onChange={(event) => handleLocalNumberChange(event.target.value)}
          placeholder={derivedCountry.placeholder}
          type="tel"
          value={localNumber}
        />

        {isPickerOpen ? (
          <div className="absolute left-0 top-[calc(100%+0.5rem)] z-30 w-full rounded-[18px] border border-black/10 bg-white p-2 shadow-[0_18px_50px_rgba(23,23,56,0.16)]">
            <div aria-label="Pilih negara" className="grid gap-1" role="listbox">
              {countries.map((country) => (
                <button
                  className={`flex min-h-12 w-full touch-manipulation items-center justify-between rounded-[14px] px-3 py-2 text-left text-sm [-webkit-tap-highlight-color:transparent] active:bg-primary/10 ${
                    country.code === derivedCountry.code
                      ? "bg-primary/8 text-secondary"
                      : "text-secondary hover:bg-primary/6"
                  }`}
                  aria-selected={country.code === derivedCountry.code}
                  key={country.code}
                  onClick={() => handleCountrySelect(country)}
                  role="option"
                  type="button"
                >
                  <span className="flex items-center gap-3">
                    <FlagBadge country={country} />
                    <span className="font-medium">{country.label}</span>
                  </span>
                  <span className="font-semibold text-secondary/65">
                    {country.dialCode}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <span className="text-sm leading-5 text-secondary/40">{formatDescription}</span>
    </div>
  );
}
