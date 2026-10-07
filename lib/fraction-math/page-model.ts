import { mathParsedToConversion } from "./convert"
import { parseMathFractionInput } from "./parse-math-input"
import type { MathConversionCore } from "./types"

export interface FractionPageModel {
  numerator: number
  denominator: number
  canonicalNumerator: number
  canonicalDenominator: number
  fractionLabel: string
  inputString: string
  core: MathConversionCore
  longDivision: Array<{ digit: number; remainder: number }>
  repeatingStart: number | null
  exactDecimalPlaces: number | null
  wholePart: number
  remainderNumerator: number
}

/**
 * Single source of truth for pSEO pages and metadata: same path as typing `n/d` into the calculator.
 */
export function getFractionPageModel(
  numerator: number,
  denominator: number
): FractionPageModel | null {
  if (
    !Number.isFinite(numerator) ||
    !Number.isFinite(denominator) ||
    denominator === 0 ||
    numerator < 0 ||
    denominator < 0
  ) {
    return null
  }

  const inputString = `${numerator}/${denominator}`
  const parsed = parseMathFractionInput(inputString, { allowPureDecimal: false })
  if (!parsed.ok || parsed.value.kind !== "fraction") {
    return null
  }

  const core = mathParsedToConversion(inputString, parsed.value, 12)
  const wholePart = Math.floor(parsed.value.reducedNumerator / parsed.value.reducedDenominator)
  const remainderNumerator = parsed.value.reducedNumerator % parsed.value.reducedDenominator
  let remainder = parsed.value.reducedNumerator % parsed.value.reducedDenominator
  const seenRemainders = new Map<number, number>()
  const longDivision: Array<{ digit: number; remainder: number }> = []
  let repeatingStart: number | null = null
  while (remainder !== 0) {
    const seenAt = seenRemainders.get(remainder)
    if (seenAt !== undefined) {
      repeatingStart = seenAt
      break
    }
    seenRemainders.set(remainder, longDivision.length)
    const scaledRemainder = remainder * 10
    const digit = Math.floor(scaledRemainder / parsed.value.reducedDenominator)
    remainder = scaledRemainder % parsed.value.reducedDenominator
    longDivision.push({ digit, remainder })
  }
  const exactDecimalPlaces = remainder === 0 ? longDivision.length : null
  return {
    numerator,
    denominator,
    canonicalNumerator: parsed.value.reducedNumerator,
    canonicalDenominator: parsed.value.reducedDenominator,
    fractionLabel: `${parsed.value.reducedNumerator}/${parsed.value.reducedDenominator}`,
    inputString,
    core,
    longDivision,
    repeatingStart,
    exactDecimalPlaces,
    wholePart,
    remainderNumerator,
  }
}
