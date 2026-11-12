import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"
import ts from "typescript"

async function loadTool(slug) {
  const sourceUrl = new URL(`../../app/[locale]/tools/${slug}/utils.ts`, import.meta.url)
  const source = await readFile(sourceUrl, "utf8")
  const compiled = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ES2020 },
  })
  return import(
    `data:text/javascript;base64,${Buffer.from(compiled.outputText).toString("base64")}`
  )
}

const decimalTool = await loadTool("decimal-to-inches-calculator")
const fractionalTool = await loadTool("inches-to-decimals")
const metricTool = await loadTool("decimal-to-millimeter")
const millimeterTool = await loadTool("millimeters-to-decimal")

test("typing or pasting invalid decimal inches never produces a different positive measurement", () => {
  for (const input of ["-0.5", "−0.5", "-14.5", "-.5"]) {
    const normalized = decimalTool.normalizeDecimalInput(input)
    assert.equal(normalized, input)
    assert.deepEqual(decimalTool.convertDecimalToInches(normalized, 16, "nearest"), {
      ok: false,
      error: "negative_not_supported",
    })
  }
  for (const input of ["1.2.3", "1/2", "abc0.5", "1e3"]) {
    assert.equal(decimalTool.convertDecimalToInches(input, 16, "nearest").ok, false)
  }
})

test("decimal inches retain exact fractions, rounding direction, offsets and feet-inch output", () => {
  const nearest = decimalTool.convertDecimalToInches("0.32", 16, "nearest")
  assert.equal(nearest.ok, true)
  assert.equal(nearest.value.exactFraction.label, '8/25"')
  assert.equal(nearest.value.nearestFraction.label, '5/16"')
  assert.equal(nearest.value.nearestOffsetLabel, '+ 0.0075"')
  assert.equal(
    decimalTool.convertDecimalToInches("0.32", 16, "up").value.nearestFraction.label,
    '3/8"'
  )
  assert.equal(
    decimalTool.convertDecimalToInches("0.32", 16, "down").value.nearestFraction.label,
    '5/16"'
  )
  assert.equal(
    decimalTool.convertDecimalToInches("14.5", 16, "nearest").value.feetInchLabel,
    "1' 2 1/2\""
  )
  assert.equal(decimalTool.convertDecimalToInches("0", 16, "nearest").value.inputInches, 0)
  assert.equal(decimalTool.convertDecimalToInches(" .5 ", 16, "nearest").value.inputInches, 0.5)
})

test("mixed-inch hyphens remain valid while leading negative signs are rejected", () => {
  const mixed = fractionalTool.convertInchesToDecimal("1-3/4", 6)
  assert.equal(mixed.value.decimalLabel, "1.75")
  assert.equal(mixed.value.millimetersLabel, "44.45")
  assert.equal(fractionalTool.convertInchesToDecimal("3/7", 6).value.decimalLabel, "0.428571")
  assert.equal(fractionalTool.convertInchesToDecimal("3/7", 6).value.isNonStandardDenominator, true)
  assert.equal(fractionalTool.convertInchesToDecimal("1/0", 6).error, "division_by_zero")
  for (const input of ["-0.5", "−0.5", "-1 3/4"]) {
    assert.equal(fractionalTool.convertInchesToDecimal(input, 6).error, "negative_not_supported")
  }
})

test("the exact 25.4 factor is distinct from rounded inch-to-mm display", () => {
  assert.equal(metricTool.convertValue("5/8", "in_to_mm", "standard").value.outputLabel, "15.88 mm")
  assert.equal(
    metricTool.convertValue("5/8", "in_to_mm", "precision").value.outputLabel,
    "15.8750 mm"
  )
  assert.equal(metricTool.convertValue("5/8", "in_to_mm", "rounded").value.outputLabel, "16 mm")
  assert.equal(
    metricTool.convertValue("25.4", "mm_to_in", "precision").value.outputLabel,
    "1.0000 in"
  )
})

test("millimeter decimal display rounding does not alter nearest fraction or offset", () => {
  const tenMillimeters = millimeterTool.convertMillimetersToDecimal("10", 4, "nearest")
  assert.equal(tenMillimeters.value.displayInchesLabel, "0.3937")
  assert.equal(tenMillimeters.value.fractionLabel, '25/64"')
  assert.equal(tenMillimeters.value.offsetLabel, "+ 0.0031")
  assert.equal(
    millimeterTool.convertMillimetersToDecimal("10", 4, "down").value.fractionLabel,
    '25/64"'
  )
  assert.equal(
    millimeterTool.convertMillimetersToDecimal("12.7", 4, "nearest").value.displayInchesLabel,
    "0.5000"
  )
  assert.equal(millimeterTool.convertMillimetersToDecimal("1/2", 4, "nearest").error, "invalid")
})
