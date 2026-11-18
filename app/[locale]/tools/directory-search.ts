import type { ToolData } from "@/data/toolsData"

type SearchableTool = Pick<ToolData, "href" | "title" | "description" | "features">

const DIRECTORY_SUMMARIES: Record<string, string> = {
  "/tools/decimal-to-char": "Decode decimal, binary or hexadecimal ASCII codes, or encode ASCII text.",
  "/tools/decimal-to-millimeter": "Convert decimal or fractional inches to millimeters, and millimeters to inches.",
  "/tools/decimal-to-inches-calculator": "Find the exact fraction or nearest tape-measure mark for decimal inches.",
  "/tools/millimeters-to-decimal": "Convert millimeters to decimal inches and the nearest common fraction.",
  "/tools/hours-to-decimal-calculator": "Convert work durations to decimal hours, apply rounding and total a batch.",
  "/tools/time-to-decimal-converter": "Convert time strings to decimal hours, minutes or days.",
  "/tools/hexa-to-decimal": "Convert hexadecimal values to decimal, binary, octal and ASCII.",
  "/tools/inches-to-decimals": "Look up fractional inches, decimal inches and millimeters in one chart.",
  "/tools/gauge-to-decimal": "Look up material and wire thickness by gauge in inches and millimeters.",
  "/tools/decimal-to-text": "Decode decimal character codes as ASCII or Unicode text.",
  "/tools/fraction-to-decimal": "Convert fractions, mixed numbers and decimals, with repeating-decimal notes.",
  "/tools/convert-inches-to-decimal": "Convert fractional inches with a visual ruler and adjustable decimal precision."
}


/** Keep the visible card summary and its searchable text in sync. */
export function getDirectorySummary(tool: SearchableTool): string {
  return DIRECTORY_SUMMARIES[tool.href] ?? tool.description
}

export function matchesDirectorySearch(tool: SearchableTool, searchTerm: string): boolean {
  const query = searchTerm.toLowerCase()
  const searchableText = [tool.title, getDirectorySummary(tool), tool.description, ...tool.features]
  return searchableText.some((text) => text.toLowerCase().includes(query))
}
