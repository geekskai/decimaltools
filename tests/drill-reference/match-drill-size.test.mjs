import assert from "node:assert/strict"
import test from "node:test"

import { matchDrillSize } from "../../lib/drill-reference/index.ts"

test("matches an exact fractional-inch drill size through the public interface", () => {
  const result = matchDrillSize({ value: 0.25, unit: "inch" })

  assert.equal(result.ok, true)
  if (!result.ok) return

  const fractional = result.matches.find((match) => match.system === "fractional-inch")

  assert.ok(fractional)
  assert.deepEqual(
    fractional.nearest.map((candidate) => candidate.label),
    ["1/4"]
  )
  assert.equal(fractional.nearest[0].nominalInches, 0.25)
  assert.equal(fractional.nearest[0].nominalMillimeters, 6.35)
  assert.equal(fractional.nearest[0].deviationInches, 0)
  assert.equal(fractional.nearest[0].absoluteDeviationInches, 0)
})

test("returns the nearest nominal sizes for all four v1 drill systems", () => {
  const result = matchDrillSize({ value: 0.25, unit: "inch" })

  assert.equal(result.ok, true)
  if (!result.ok) return

  assert.deepEqual(
    result.matches.map((match) => match.system),
    ["fractional-inch", "number", "letter", "metric"]
  )
  assert.deepEqual(
    result.matches.find((match) => match.system === "number")?.nearest.map((size) => size.label),
    ["#1"]
  )
  assert.deepEqual(
    result.matches.find((match) => match.system === "letter")?.nearest.map((size) => size.label),
    ["E"]
  )
  assert.deepEqual(
    result.matches.find((match) => match.system === "metric")?.nearest.map((size) => size.label),
    ["6.3 mm", "6.4 mm"]
  )
})

test("returns the closest lower and upper nominal sizes around the measurement", () => {
  const result = matchDrillSize({ value: 6.35, unit: "mm" })

  assert.equal(result.ok, true)
  if (!result.ok) return

  const fractional = result.matches.find((match) => match.system === "fractional-inch")

  assert.equal(fractional?.lower?.label, "15/64")
  assert.equal(fractional?.upper?.label, "17/64")
  assert.ok(fractional.lower.deviationInches < 0)
  assert.ok(fractional.upper.deviationInches > 0)

  const metric = result.matches.find((match) => match.system === "metric")

  assert.equal(metric?.lower?.label, "6.3 mm")
  assert.equal(metric?.upper?.label, "6.4 mm")
})

test("checks candidates only against a tolerance supplied by the user", () => {
  const withoutTolerance = matchDrillSize({ value: 0.249, unit: "inch" })
  const withTolerance = matchDrillSize({
    value: 0.249,
    unit: "inch",
    tolerance: { value: 0.002, unit: "inch" },
  })

  assert.equal(withoutTolerance.ok, true)
  assert.equal(withTolerance.ok, true)
  if (!withoutTolerance.ok || !withTolerance.ok) return

  const uncheckedFractional = withoutTolerance.matches.find(
    (match) => match.system === "fractional-inch"
  )
  const checkedFractional = withTolerance.matches.find(
    (match) => match.system === "fractional-inch"
  )
  const checkedNumber = withTolerance.matches.find((match) => match.system === "number")

  assert.equal("withinTolerance" in uncheckedFractional.nearest[0], false)
  assert.equal(checkedFractional.nearest[0].withinTolerance, true)
  assert.equal(checkedNumber.nearest[0].withinTolerance, false)
})

test("rejects invalid measurements and negative tolerances", () => {
  for (const value of [Number.NaN, Number.POSITIVE_INFINITY, 0, -0.25]) {
    assert.deepEqual(matchDrillSize({ value, unit: "inch" }), {
      ok: false,
      code: "invalid_measurement",
      error: "Measurement must be a finite number greater than zero.",
    })
  }

  assert.deepEqual(
    matchDrillSize({
      value: 0.25,
      unit: "inch",
      tolerance: { value: -0.001, unit: "inch" },
    }),
    {
      ok: false,
      code: "invalid_tolerance",
      error: "Tolerance must be a finite number greater than or equal to zero.",
    }
  )
})

test("returns normalized input and cross-checked endpoint values", () => {
  const numberLow = matchDrillSize({ value: 0.3429, unit: "mm" })
  const numberHigh = matchDrillSize({ value: 0.228, unit: "inch" })
  const letterHigh = matchDrillSize({ value: 0.413, unit: "inch" })
  const metricHigh = matchDrillSize({ value: 13, unit: "mm" })

  for (const result of [numberLow, numberHigh, letterHigh, metricHigh]) {
    assert.equal(result.ok, true)
  }
  if (!numberLow.ok || !numberHigh.ok || !letterHigh.ok || !metricHigh.ok) return

  assert.deepEqual(numberLow.input, {
    value: 0.3429,
    unit: "mm",
    inches: 0.0135,
    millimeters: 0.3429,
  })
  assert.equal(
    numberLow.matches.find((match) => match.system === "number")?.nearest[0].label,
    "#80"
  )
  assert.equal(
    numberHigh.matches.find((match) => match.system === "number")?.nearest[0].label,
    "#1"
  )
  assert.equal(letterHigh.matches.find((match) => match.system === "letter")?.nearest[0].label, "Z")
  assert.equal(
    metricHigh.matches.find((match) => match.system === "metric")?.nearest[0].label,
    "13.0 mm"
  )

  const numberCandidate = numberLow.matches.find((match) => match.system === "number")?.nearest[0]
  assert.equal(numberCandidate?.deviationMillimeters, 0)
  assert.equal(numberCandidate?.absoluteDeviationMillimeters, 0)
})
