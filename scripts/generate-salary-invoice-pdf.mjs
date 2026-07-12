import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const outputPath = resolve(
  "D:/Project_Alfi/hackaton/sakutera/saku-tera/public/samples/contoh-slip-gaji-ocr.pdf",
);

function escapePdfText(value) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function buildTextBlock(lines) {
  const commands = [];

  for (const line of lines) {
    const {
      font = "F1",
      fontSize,
      x,
      y,
      text,
      color = "0 0 0",
    } = line;

    commands.push("BT");
    commands.push(`${color} rg`);
    commands.push(`/${font} ${fontSize} Tf`);
    commands.push(`1 0 0 1 ${x} ${y} Tm`);
    commands.push(`(${escapePdfText(text)}) Tj`);
    commands.push("ET");
  }

  return commands.join("\n");
}

function drawFilledRect(x, y, width, height, color) {
  return [`${color} rg`, `${x} ${y} ${width} ${height} re`, "f"].join("\n");
}

function drawStrokedRect(x, y, width, height, color, lineWidth = 1) {
  return [`${lineWidth} w`, `${color} RG`, `${x} ${y} ${width} ${height} re`, "S"].join(
    "\n",
  );
}

function drawLine(x1, y1, x2, y2, color, lineWidth = 1) {
  return [
    `${lineWidth} w`,
    `${color} RG`,
    `${x1} ${y1} m`,
    `${x2} ${y2} l`,
    "S",
  ].join("\n");
}

function createPdfBuffer(contentStream) {
  const streamLength = Buffer.byteLength(contentStream, "latin1");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Count 1 /Kids [3 0 R] >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    `<< /Length ${streamLength} >>\nstream\n${contentStream}\nendstream`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf, "latin1"));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefStart = Buffer.byteLength(pdf, "latin1");
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";

  for (let index = 1; index < offsets.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
  return Buffer.from(pdf, "latin1");
}

const lines = [
  { font: "F2", fontSize: 12, x: 56, y: 803, text: "PT MAJU LANCAR INDONESIA", color: "1 1 1" },
  { font: "F1", fontSize: 10, x: 56, y: 787, text: "Invoice Gaji / Salary Statement", color: "1 1 1" },
  { font: "F2", fontSize: 22, x: 56, y: 742, text: "SLIP GAJI KARYAWAN", color: "0.1 0.16 0.3" },
  { font: "F1", fontSize: 10, x: 56, y: 724, text: "Periode Penggajian", color: "0.45 0.5 0.62" },
  { font: "F2", fontSize: 12, x: 56, y: 708, text: "Juni 2026", color: "0.12 0.18 0.34" },
  { font: "F1", fontSize: 10, x: 210, y: 724, text: "Tanggal Pembayaran", color: "0.45 0.5 0.62" },
  { font: "F2", fontSize: 12, x: 210, y: 708, text: "30 Juni 2026", color: "0.12 0.18 0.34" },
  { font: "F1", fontSize: 10, x: 388, y: 724, text: "Nomor Dokumen", color: "0.45 0.5 0.62" },
  { font: "F2", fontSize: 12, x: 388, y: 708, text: "PAY-2026-06-014", color: "0.12 0.18 0.34" },
  { font: "F2", fontSize: 12, x: 56, y: 668, text: "Informasi Karyawan", color: "0.12 0.18 0.34" },
  { font: "F1", fontSize: 10, x: 56, y: 646, text: "Nama Karyawan", color: "0.45 0.5 0.62" },
  { font: "F2", fontSize: 11, x: 56, y: 630, text: "Budi Santoso", color: "0.12 0.18 0.34" },
  { font: "F1", fontSize: 10, x: 210, y: 646, text: "Jabatan", color: "0.45 0.5 0.62" },
  { font: "F2", fontSize: 11, x: 210, y: 630, text: "Sales Lapangan", color: "0.12 0.18 0.34" },
  { font: "F1", fontSize: 10, x: 388, y: 646, text: "NIK", color: "0.45 0.5 0.62" },
  { font: "F2", fontSize: 11, x: 388, y: 630, text: "EMP-0626-014", color: "0.12 0.18 0.34" },
  { font: "F2", fontSize: 12, x: 56, y: 584, text: "Rincian Penghasilan", color: "0.12 0.18 0.34" },
  { font: "F2", fontSize: 10, x: 56, y: 560, text: "KOMPONEN", color: "0.45 0.5 0.62" },
  { font: "F2", fontSize: 10, x: 472, y: 560, text: "NOMINAL", color: "0.45 0.5 0.62" },
  { font: "F1", fontSize: 11, x: 56, y: 534, text: "Gaji Pokok", color: "0.12 0.18 0.34" },
  { font: "F2", fontSize: 11, x: 448, y: 534, text: "Rp 4.500.000", color: "0.12 0.18 0.34" },
  { font: "F1", fontSize: 11, x: 56, y: 510, text: "Tunjangan Transport", color: "0.12 0.18 0.34" },
  { font: "F2", fontSize: 11, x: 456, y: 510, text: "Rp 750.000", color: "0.12 0.18 0.34" },
  { font: "F1", fontSize: 11, x: 56, y: 486, text: "Bonus Kinerja", color: "0.12 0.18 0.34" },
  { font: "F2", fontSize: 11, x: 448, y: 486, text: "Rp 1.250.000", color: "0.12 0.18 0.34" },
  { font: "F1", fontSize: 11, x: 56, y: 462, text: "Lembur", color: "0.12 0.18 0.34" },
  { font: "F2", fontSize: 11, x: 456, y: 462, text: "Rp 300.000", color: "0.12 0.18 0.34" },
  { font: "F2", fontSize: 12, x: 56, y: 418, text: "Potongan", color: "0.12 0.18 0.34" },
  { font: "F1", fontSize: 11, x: 56, y: 394, text: "BPJS Kesehatan", color: "0.12 0.18 0.34" },
  { font: "F2", fontSize: 11, x: 456, y: 394, text: "Rp 120.000", color: "0.12 0.18 0.34" },
  { font: "F1", fontSize: 11, x: 56, y: 370, text: "BPJS Ketenagakerjaan", color: "0.12 0.18 0.34" },
  { font: "F2", fontSize: 11, x: 456, y: 370, text: "Rp 80.000", color: "0.12 0.18 0.34" },
  { font: "F1", fontSize: 11, x: 56, y: 346, text: "PPh 21", color: "0.12 0.18 0.34" },
  { font: "F2", fontSize: 11, x: 456, y: 346, text: "Rp 150.000", color: "0.12 0.18 0.34" },
  { font: "F2", fontSize: 12, x: 56, y: 292, text: "TOTAL DITERIMA", color: "1 1 1" },
  { font: "F2", fontSize: 18, x: 392, y: 290, text: "Rp 6.450.000", color: "1 1 1" },
  { font: "F2", fontSize: 12, x: 56, y: 242, text: "Metode Pembayaran", color: "0.12 0.18 0.34" },
  { font: "F1", fontSize: 11, x: 56, y: 224, text: "Transfer Bank BCA - Rekening 1234567890", color: "0.12 0.18 0.34" },
  { font: "F2", fontSize: 12, x: 56, y: 188, text: "Catatan", color: "0.12 0.18 0.34" },
  { font: "F1", fontSize: 10, x: 56, y: 170, text: "Gaji bulan Juni 2026 telah dibayarkan penuh dan diverifikasi oleh tim payroll.", color: "0.3 0.35 0.45" },
  { font: "F1", fontSize: 10, x: 56, y: 154, text: "Dokumen contoh ini dibuat untuk pengujian OCR upload PDF pada aplikasi SakuTera.", color: "0.3 0.35 0.45" },
  { font: "F1", fontSize: 9, x: 56, y: 96, text: "Verifier: Nadia Putri | HR Payroll Officer", color: "0.45 0.5 0.62" },
  { font: "F1", fontSize: 9, x: 56, y: 82, text: "Field OCR utama: periode, tanggal, nama, NIK, nominal penghasilan, nominal total diterima.", color: "0.45 0.5 0.62" },
];

const shapes = [
  drawFilledRect(0, 0, 595, 842, "1 1 1"),
  drawFilledRect(40, 770, 515, 54, "0.11 0.21 0.45"),
  drawFilledRect(40, 694, 515, 56, "0.95 0.97 1"),
  drawStrokedRect(40, 606, 515, 72, "0.85 0.89 0.96"),
  drawFilledRect(40, 548, 515, 24, "0.95 0.97 1"),
  drawLine(40, 542, 555, 542, "0.85 0.89 0.96"),
  drawLine(40, 518, 555, 518, "0.9 0.92 0.97"),
  drawLine(40, 494, 555, 494, "0.9 0.92 0.97"),
  drawLine(40, 470, 555, 470, "0.9 0.92 0.97"),
  drawLine(40, 446, 555, 446, "0.9 0.92 0.97"),
  drawFilledRect(40, 282, 515, 34, "0.12 0.52 0.32"),
  drawStrokedRect(40, 136, 515, 118, "0.85 0.89 0.96"),
];

const contentStream = [...shapes, buildTextBlock(lines)].join("\n");

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, createPdfBuffer(contentStream));

console.log(`PDF generated at ${outputPath}`);
