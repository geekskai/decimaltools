import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"
import ts from "typescript"

const sourceUrl = new URL("../../app/[locale]/tools/directory-search.ts", import.meta.url)
const source = await readFile(sourceUrl, "utf8")
const compiled = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ES2020 },
})
const { getDirectorySummary, matchesDirectorySearch } = await import(
  "data:text/javascript;base64," + Buffer.from(compiled.outputText).toString("base64")
)

const hoursTool = {
  href: "/tools/hours-to-decimal-calculator",
  title: "Hours to Decimal Calculator",
  description: "Convert time entries into decimal hours.",
  features: ["Smart parser: 1:30, 1h 30m, 90 min", "Quarter-hour rounding"],
}
const inchesTool = {
  href: "/tools/decimal-to-inches-calculator",
  title: "Decimal to Inches Calculator",
  description: "Convert decimal inches with selectable tape precision.",
  features: ["Feet-inch formatting", "Digital ruler marker"],
}

test("visible work duration summary is searchable", () => {
  assert.match(getDirectorySummary(hoursTool), /work durations/)
  assert.equal(matchesDirectorySearch(hoursTool, "durations"), true)
  assert.equal(matchesDirectorySearch(hoursTool, "work durations"), true)
})

test("visible tape-measure summary finds its actual converter", () => {
  assert.match(getDirectorySummary(inchesTool), /tape-measure/)
  assert.equal(matchesDirectorySearch(inchesTool, "tape-measure"), true)
})

test("summary searches are case insensitive", () => {
  assert.equal(matchesDirectorySearch(hoursTool, "DURATIONS"), true)
  assert.equal(matchesDirectorySearch(inchesTool, "TAPE-MEASURE"), true)
})

test("existing title, full description and feature searches remain available", () => {
  assert.equal(matchesDirectorySearch(hoursTool, "hours to decimal"), true)
  assert.equal(matchesDirectorySearch(hoursTool, "time entries"), true)
  assert.equal(matchesDirectorySearch(hoursTool, "quarter-hour"), true)
  assert.equal(matchesDirectorySearch(inchesTool, "digital ruler"), true)
})

test("unmapped tools display and search their original description", () => {
  const otherTool = { ...hoursTool, href: "/tools/other", description: "Special converter" }
  assert.equal(getDirectorySummary(otherTool), "Special converter")
  assert.equal(matchesDirectorySearch(otherTool, "special converter"), true)
})

test("empty searches include tools and unrelated queries exclude them", () => {
  assert.equal(matchesDirectorySearch(hoursTool, ""), true)
  assert.equal(matchesDirectorySearch(hoursTool, "no-such-conversion"), false)
})
