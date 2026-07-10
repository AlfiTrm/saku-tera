"use client";

import { Check, ChevronsUpDown, Search } from "lucide-react";
import { Popover } from "radix-ui";
import { forwardRef, useMemo, useState } from "react";
import PhoneInput, {
  formatPhoneNumberIntl,
  getCountries,
  getCountryCallingCode,
  type Country,
  type Labels,
  type Value,
} from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

const regionNames = new Intl.DisplayNames(["id"], { type: "region" });
const countryLabels: Labels = {
  ...Object.fromEntries(
    getCountries().map((country) => [country, regionNames.of(country) ?? country]),
  ),
  country: "Negara",
  ext: "Ekstensi",
  phone: "Nomor telepon",
  ZZ: "Internasional",
};

type PhoneNumberFieldProps = {
  onChange: (value: { phone: string; phoneDisplay: string }) => void;
  value: string;
};

type CountryOption = {
  divider?: boolean;
  label: string;
  value?: Country;
};

type CountrySelectProps = {
  disabled?: boolean;
  onChange: (country?: Country) => void;
  options: CountryOption[];
  value?: Country;
};

const PhoneTextInput = forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<"input">
>(function PhoneTextInput({ className, ...props }, ref) {
  return (
    <input
      {...props}
      className={`h-[66px] min-w-0 flex-1 rounded-r-[18px] bg-white px-4 text-[0.98rem] font-medium text-secondary outline-none placeholder:text-[0.9rem] placeholder:text-secondary/35 ${className ?? ""}`}
      inputMode="tel"
      ref={ref}
    />
  );
});

function CountrySelect({
  disabled,
  onChange,
  options,
  value,
}: CountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selectedOption = options.find((option) => option.value === value);
  const selectedFlag = value ? flags[value] : undefined;

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("id");

    return options.filter((option) => {
      if (!option.value || option.divider) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const callingCode = getCountryCallingCode(option.value);
      return (
        option.label.toLocaleLowerCase("id").includes(normalizedQuery) ||
        option.value.toLocaleLowerCase("id").includes(normalizedQuery) ||
        callingCode.includes(normalizedQuery.replace("+", ""))
      );
    });
  }, [options, query]);

  function selectCountry(country: Country) {
    onChange(country);
    setIsOpen(false);
    setQuery("");
  }

  return (
    <Popover.Root
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          setQuery("");
        }
      }}
      open={isOpen}
    >
      <Popover.Trigger asChild>
        <button
          aria-label="Pilih negara"
          className="flex h-[66px] w-[112px] shrink-0 items-center justify-center gap-2 rounded-l-[18px] border-r border-black/8 bg-white px-3 text-secondary outline-none transition-colors hover:bg-primary/[0.04] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/45 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={disabled}
          type="button"
        >
          <span className="flex h-5 w-7 shrink-0 overflow-hidden rounded-[4px] border border-black/10 bg-black/5 [&>svg]:h-full [&>svg]:w-full">
            {selectedFlag ? (
              (() => {
                const Flag = selectedFlag;
                return <Flag title={selectedOption?.label ?? value ?? ""} />;
              })()
            ) : null}
          </span>
          <span className="text-sm font-semibold">
            {value ? `+${getCountryCallingCode(value)}` : "+"}
          </span>
          <ChevronsUpDown aria-hidden="true" className="h-3.5 w-3.5 text-secondary/38" />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="start"
          className="z-[80] w-[min(22rem,calc(100vw-2.5rem))] overflow-hidden rounded-[18px] border border-black/10 bg-white p-2 shadow-[0_18px_50px_rgba(23,23,56,0.16)] outline-none"
          sideOffset={8}
        >
          <div className="mb-2 flex h-11 items-center gap-2 rounded-[13px] bg-secondary/[0.045] px-3">
            <Search aria-hidden="true" className="h-4 w-4 shrink-0 text-secondary/38" />
            <input
              aria-label="Cari negara"
              autoFocus
              className="min-w-0 flex-1 bg-transparent text-sm font-medium text-secondary outline-none placeholder:text-secondary/35"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari negara atau kode..."
              value={query}
            />
          </div>

          <div className="max-h-64 overflow-y-auto overscroll-contain" role="listbox">
            {filteredOptions.map((option) => {
              const country = option.value as Country;
              const Flag = flags[country];
              const isSelected = country === value;

              return (
                <button
                  aria-selected={isSelected}
                  className={`flex min-h-11 w-full items-center gap-3 rounded-[12px] px-3 py-2 text-left text-sm transition-colors hover:bg-primary/6 ${
                    isSelected ? "bg-primary/8 text-secondary" : "text-secondary/75"
                  }`}
                  key={country}
                  onClick={() => selectCountry(country)}
                  role="option"
                  type="button"
                >
                  <span className="flex h-5 w-7 shrink-0 overflow-hidden rounded-[4px] border border-black/10 bg-black/5 [&>svg]:h-full [&>svg]:w-full">
                    {Flag ? <Flag title={option.label} /> : null}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-medium">{option.label}</span>
                  <span className="font-semibold text-secondary/48">
                    +{getCountryCallingCode(country)}
                  </span>
                  <Check
                    aria-hidden="true"
                    className={`h-4 w-4 text-primary ${isSelected ? "opacity-100" : "opacity-0"}`}
                  />
                </button>
              );
            })}

            {filteredOptions.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-secondary/45">
                Negara tidak ditemukan.
              </p>
            ) : null}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export function PhoneNumberField({ onChange, value }: PhoneNumberFieldProps) {
  function handleChange(nextValue?: Value) {
    const phone = nextValue ?? "";

    onChange({
      phone,
      phoneDisplay: phone ? formatPhoneNumberIntl(phone) : "",
    });
  }

  return (
    <div className="grid w-full min-w-0 gap-2">
      <PhoneInput
        addInternationalOption={false}
        autoComplete="tel"
        className="flex min-h-[68px] w-full min-w-0 rounded-[18px] border border-primary bg-white shadow-[0_0_0_1px_rgba(48,102,190,0.08)] focus-within:ring-2 focus-within:ring-primary/15"
        countryOptionsOrder={["ID", "SG", "MY", "|", "..."]}
        countrySelectComponent={CountrySelect}
        defaultCountry="ID"
        flags={flags}
        inputComponent={PhoneTextInput}
        labels={countryLabels}
        limitMaxLength
        onChange={handleChange}
        placeholder="812 3456 7890"
        value={value}
      />

      <span className="text-sm leading-5 text-secondary/40">
        Pilih negara, lalu masukkan nomor aktif untuk menerima kode OTP.
      </span>
    </div>
  );
}
