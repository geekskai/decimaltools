import type { BatchRow } from "./utils"

const PDF_LAYOUT = {
  width: 595, height: 842, columns: [36, 174, 312, 462],
  titleY: 800, headerY: 755, firstRowY: 730, footerY: 26,
  rowHeight: 18, rowsPerPage: 36, fontSize: 10, titleSize: 16, footerSize: 9,
} as const

function pdfText({ text, x, y, size = PDF_LAYOUT.fontSize }: {
  text: string; x: number; y: number; size?: number
}): string {
  const escapedText = text.replace(/([\\()])/g, "\\$1")
  return `BT /F1 ${size} Tf 1 0 0 1 ${x} ${y} Tm (${escapedText}) Tj ET`
}

function pdfRow({ cells, y }: { cells: string[]; y: number }): string {
  return cells.map((text, index) => pdfText({ text, x: PDF_LAYOUT.columns[index], y })).join("\n")
}

function batchCells(row: BatchRow): string[] {
  return [row.sourceLabel, row.exactHours.toFixed(4), row.roundedHours.toFixed(4),
    row.totalAmount == null ? "-" : `$${row.totalAmount.toFixed(2)}`]
}

function totalCells(rows: BatchRow[]): string[] {
  const totals = rows.reduce((summary, row) => ({
    exactHours: summary.exactHours + row.exactHours,
    roundedHours: summary.roundedHours + row.roundedHours,
    amount: summary.amount + (row.totalAmount ?? 0),
  }), { exactHours: 0, roundedHours: 0, amount: 0 })
  const hasAmount = rows.some((row) => row.totalAmount != null)
  return ["Grand total", totals.exactHours.toFixed(4), totals.roundedHours.toFixed(4),
    hasAmount ? `$${totals.amount.toFixed(2)}` : "-"]
}

function pdfPage({ rows, totals, pageNumber, pageCount }: {
  rows: BatchRow[]; totals?: string[]; pageNumber: number; pageCount: number
}): string {
  const commands = [
    pdfText({ text: "Hours to Decimal Batch Export", x: PDF_LAYOUT.columns[0],
      y: PDF_LAYOUT.titleY, size: PDF_LAYOUT.titleSize }),
    pdfRow({ cells: ["Entry", "Exact hours", "Rounded hours", "Amount"], y: PDF_LAYOUT.headerY }),
  ]
  rows.forEach((row, index) => {
    commands.push(pdfRow({ cells: batchCells(row), y: PDF_LAYOUT.firstRowY - index * PDF_LAYOUT.rowHeight }))
  })
  if (totals) {
    commands.push(pdfRow({ cells: totals, y: PDF_LAYOUT.firstRowY - (rows.length + 1) * PDF_LAYOUT.rowHeight }))
  }
  commands.push(pdfText({ text: `Page ${pageNumber} of ${pageCount}`,
    x: PDF_LAYOUT.columns[0], y: PDF_LAYOUT.footerY, size: PDF_LAYOUT.footerSize }))
  return commands.join("\n") + "\n"
}

function pdfObjects(pages: string[]): string[] {
  const objects = ["<< /Type /Catalog /Pages 2 0 R >>", "",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"]
  const pageReferences: string[] = []
  for (const content of pages) {
    const pageId = objects.length + 1
    pageReferences.push(`${pageId} 0 R`)
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PDF_LAYOUT.width} ${PDF_LAYOUT.height}] /Resources << /Font << /F1 3 0 R >> >> /Contents ${pageId + 1} 0 R >>`)
    objects.push(`<< /Length ${new TextEncoder().encode(content).length} >>\nstream\n${content}endstream`)
  }
  objects[1] = `<< /Type /Pages /Kids [${pageReferences.join(" ")}] /Count ${pages.length} >>`
  return objects
}

function serializePdf(objects: string[]): string {
  const encoder = new TextEncoder()
  let documentText = "%PDF-1.4\n"
  let byteOffset = encoder.encode(documentText).length
  const offsets: number[] = []
  for (const [index, content] of objects.entries()) {
    offsets.push(byteOffset)
    const serializedObject = `${index + 1} 0 obj\n${content}\nendobj\n`
    documentText += serializedObject
    byteOffset += encoder.encode(serializedObject).length
  }
  const crossReferences = offsets.map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`).join("")
  return documentText + `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${crossReferences}trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${byteOffset}\n%%EOF\n`
}

/**
 * Export normalized ASCII duration labels and numeric batch values as a PDF.
 * Pagination and totals are generated locally, so export never depends on a popup or print dialog.
 */
export function buildBatchPdf(rows: BatchRow[]): Blob {
  const pageCount = Math.max(1, Math.ceil(rows.length / PDF_LAYOUT.rowsPerPage))
  const totals = totalCells(rows)
  const pages: string[] = []
  for (let pageIndex = 0; pageIndex < pageCount; pageIndex += 1) {
    const start = pageIndex * PDF_LAYOUT.rowsPerPage
    pages.push(pdfPage({ rows: rows.slice(start, start + PDF_LAYOUT.rowsPerPage),
      totals: pageIndex === pageCount - 1 ? totals : undefined,
      pageNumber: pageIndex + 1, pageCount }))
  }
  return new Blob([serializePdf(pdfObjects(pages))], { type: "application/pdf" })
}
