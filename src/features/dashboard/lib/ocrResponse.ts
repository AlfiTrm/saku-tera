import type {
  IncomeDocumentExtraction,
  IncomeDocumentType,
} from "@/src/features/dashboard/types/dashboardData";

const MAX_REASONABLE_AMOUNT = 100_000_000;
const MIN_REASONABLE_AMOUNT = 10_000;

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function toAmountCandidate(value: string | number) {
  const digitsOnly = String(value).replace(/[^\d]/g, "");
  const parsed = Number(digitsOnly);

  if (
    !Number.isFinite(parsed) ||
    parsed < MIN_REASONABLE_AMOUNT ||
    parsed > MAX_REASONABLE_AMOUNT
  ) {
    return null;
  }

  return parsed;
}

function collectStringValues(input: unknown, sink: string[]) {
  if (typeof input === "string") {
    const normalized = normalizeWhitespace(input);
    if (normalized) {
      sink.push(normalized);
    }
    return;
  }

  if (typeof input === "number") {
    sink.push(String(input));
    return;
  }

  if (Array.isArray(input)) {
    input.forEach((item) => collectStringValues(item, sink));
    return;
  }

  if (input && typeof input === "object") {
    Object.values(input).forEach((value) => collectStringValues(value, sink));
  }
}

function detectDocumentType(text: string, fileName: string): IncomeDocumentType {
  const normalized = `${fileName} ${text}`.toLowerCase();

  if (
    normalized.includes("slip gaji") ||
    normalized.includes("gaji") ||
    normalized.includes("salary") ||
    normalized.includes("payroll")
  ) {
    return "salary-slip";
  }

  if (normalized.includes("invoice") || normalized.includes("tagihan")) {
    return "invoice";
  }

  if (
    normalized.includes("transfer") ||
    normalized.includes("mutasi") ||
    normalized.includes("bukti transfer") ||
    normalized.includes("bukti bayar")
  ) {
    return "bank-proof";
  }

  return "unknown";
}

function detectSourceHint(text: string) {
  const normalized = text.toLowerCase();

  if (normalized.includes("gopay") || normalized.includes("gojek")) {
    return "Gojek - GoPay";
  }

  if (normalized.includes("ovo")) {
    return "OVO - Kurir Online";
  }

  if (normalized.includes("grab")) {
    return "Manual - Grab";
  }

  return "Input Manual";
}

function pickAmount(text: string, payload: unknown) {
  if (payload && typeof payload === "object") {
    const amountFields = ["amount", "nominal", "salary", "total", "income"];

    for (const field of amountFields) {
      const fieldValue = (payload as Record<string, unknown>)[field];
      const candidate = fieldValue ? toAmountCandidate(fieldValue as string | number) : null;

      if (candidate) {
        return candidate;
      }
    }
  }

  const matches = text.match(/(?:rp|idr)?\s*[\.:]?\s*\d{1,3}(?:[.,\s]\d{3}){1,5}/gi) ?? [];

  for (const match of matches) {
    const candidate = toAmountCandidate(match);
    if (candidate) {
      return candidate;
    }
  }

  return undefined;
}

function createDescription(documentType: IncomeDocumentType) {
  if (documentType === "salary-slip") {
    return "Nominal dibaca dari slip penghasilan";
  }

  if (documentType === "invoice") {
    return "Nominal dibaca dari invoice";
  }

  if (documentType === "bank-proof") {
    return "Nominal dibaca dari bukti transfer";
  }

  return "Nominal dibaca dari dokumen yang diunggah";
}

export function normalizeOcrPayload(
  payload: unknown,
  fileName: string,
): IncomeDocumentExtraction {
  const textValues: string[] = [];
  collectStringValues(payload, textValues);
  const combinedText = normalizeWhitespace(textValues.join(" "));
  const documentType = detectDocumentType(combinedText, fileName);
  const amount = pickAmount(combinedText, payload);

  return {
    amount,
    confidence:
      amount && combinedText.length > 40 ? "high" : amount ? "medium" : "low",
    description: createDescription(documentType),
    documentType,
    fileName,
    sourceHint: detectSourceHint(combinedText),
  };
}

export function createFallbackExtraction(file: File): IncomeDocumentExtraction {
  const normalizedName = file.name.toLowerCase();

  if (normalizedName.includes("invoice")) {
    return {
      amount: 425000,
      confidence: "medium",
      description: "Nominal awal diisi dari nama file invoice",
      documentType: "invoice",
      fileName: file.name,
      sourceHint: "Input Manual",
    };
  }

  if (normalizedName.includes("slip") || normalizedName.includes("gaji")) {
    return {
      amount: 1850000,
      confidence: "medium",
      description: "Nominal awal diisi dari slip penghasilan",
      documentType: "salary-slip",
      fileName: file.name,
      sourceHint: "Input Manual",
    };
  }

  if (normalizedName.includes("transfer") || normalizedName.includes("bukti")) {
    return {
      amount: 735000,
      confidence: "medium",
      description: "Nominal awal diisi dari bukti transfer",
      documentType: "bank-proof",
      fileName: file.name,
      sourceHint: "OVO - Kurir Online",
    };
  }

  return {
    amount: undefined,
    confidence: "low",
    description: "OCR belum menemukan nominal yang yakin. Kamu bisa lanjut isi manual.",
    documentType: "unknown",
    fileName: file.name,
    sourceHint: "Input Manual",
  };
}
