import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"
import ts from "typescript"

const sourceUrl = new URL("../../app/[locale]/tools/hours-to-decimal-calculator/batch-pdf.ts", import.meta.url)
const source = await readFile(sourceUrl, "utf8")
const compiled = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ES2020 },
})
const { buildBatchPdf } = await import("data:text/javascript;base64," + Buffer.from(compiled.outputText).toString("base64"))
const batchRows = [
  { id: "first", sourceLabel: "1:30:00", exactHours: 1.5, roundedHours: 1.5, totalAmount: 37.5 },
  { id: "second", sourceLabel: "0:30:00", exactHours: 0.5, roundedHours: 0.5, totalAmount: 12.5 },
]

test("batch PDF contains entries, amounts and grand totals and is repeatable", async () => {
  const pdf = buildBatchPdf(batchRows)
  const documentText = await pdf.text()
  assert.equal(pdf.type, "application/pdf")
  assert.ok(documentText.startsWith("%PDF-1.4\n"))
  for (const expected of ["(1:30:00)", "(0:30:00)", "($37.50)", "($12.50)", "(Grand total)", "(2.0000)", "($50.00)"]) {
    assert.ok(documentText.includes(expected), expected)
  }
  assert.equal(documentText, await buildBatchPdf(batchRows).text())
})

test("PDF cross references and stream lengths point to the actual serialized bytes", async () => {
  const documentText = await buildBatchPdf(batchRows).text()
  const pdfBytes = Buffer.from(documentText)
  const xrefOffset = Number(documentText.match(/startxref\n(\d+)/)?.[1])
  assert.equal(pdfBytes.subarray(xrefOffset, xrefOffset + 4).toString(), "xref")
  const xrefLines = documentText.slice(xrefOffset).split("\n")
  const objectCount = Number(xrefLines[1].split(" ")[1])
  assert.ok(objectCount > 4)
  for (let objectId = 1; objectId < objectCount; objectId += 1) {
    const offset = Number(xrefLines[objectId + 2].slice(0, 10))
    assert.ok(pdfBytes.subarray(offset).toString().startsWith(objectId + " 0 obj\n"))
  }
  for (const stream of documentText.matchAll(/<< \/Length (\d+) >>\nstream\n/g)) {
    const start = stream.index + stream[0].length
    const end = start + Number(stream[1])
    assert.equal(pdfBytes.subarray(end, end + 9).toString(), "endstream")
  }
})

test("long batches paginate without dropping rows or duplicating totals", async () => {
  const rows = Array.from({ length: 43 }, (_, index) => ({
    id: String(index), sourceLabel: String(index + 1) + ":00:00",
    exactHours: index + 1, roundedHours: index + 1, totalAmount: null,
  }))
  const documentText = await buildBatchPdf(rows).text()
  assert.ok(documentText.includes("/Count 2"))
  assert.ok(documentText.includes("(Page 1 of 2)"))
  assert.ok(documentText.includes("(Page 2 of 2)"))
  assert.equal(documentText.split("(Grand total)").length - 1, 1)
  for (const row of rows) {
    assert.ok(documentText.includes("(" + row.sourceLabel + ")"))
  }
  assert.ok(documentText.includes("(946.0000)"))
  assert.ok(!documentText.includes("($0.00)"))
})

test("PDF literal strings escape parentheses and backslashes", async () => {
  const documentText = await buildBatchPdf([
    { ...batchRows[0], sourceLabel: "1:30:00 (checked)\\copy" },
  ]).text()
  assert.ok(documentText.includes("(1:30:00 \\(checked\\)\\\\copy)"))
})
