import type { FractionPageModel } from "@/lib/fraction-math/page-model"
import { isTerminatingDenominator } from "@/lib/fraction-math/rational"
import { PSEO_CONTENT_VERSION, PSEO_DETAIL_LAST_MODIFIED_DATE } from "./pseo-fractions"
import type { PseoFractionPair } from "./pseo-fractions"

interface FractionPageContent {
  heading: string
  explanation: string[]
  verification: string
  rounding: string
  faq: { question: string; answer: string }
  related: [number, number][]
  measurement?: { inches: string; millimeters: string }
}

/** Only these ten landings receive the additional editorial explanations. */
export const fractionPageContent: Record<string, FractionPageContent> = {
  "3-11": {
    heading: "Why the digits 27 repeat",
    explanation: [
      "30 ÷ 11 gives 2 with remainder 8. Next, 80 ÷ 11 gives 7 with remainder 3. The remainder has returned to the starting value, so the same two steps repeat forever.",
      "The repeating block is 27: 3/11 = 0.(27) = 0.272727… . Parentheses mark the digits that repeat, rather than digits to multiply.",
    ],
    verification:
      "0.(27) = 27/99 = 3/11, which checks the repeating decimal against the original fraction.",
    rounding:
      "To four decimal places, 3/11 ≈ 0.2727. The next digit is 2, so the fourth decimal digit stays 7.",
    faq: {
      question: "What is the repeating block in 3/11?",
      answer:
        "The block 27 repeats. Both digits belong to the cycle, so write 0.(27), or 0.272727… .",
    },
    related: [
      [2, 11],
      [4, 11],
    ],
  },
  "3-14": {
    heading: "The first digit and the repeating block",
    explanation: [
      "3/14 = 0.2(142857) = 0.2142857142857… . The first decimal digit, 2, is outside the repeating block; the six digits 142857 then repeat forever.",
      "In the division table, the first step leaves remainder 2. After the next six steps, remainder 2 appears again, closing the cycle. The reduced denominator 14 = 2 × 7 has a factor other than 2 or 5, so the decimal cannot terminate; the factor 2 accounts for the one-digit non-repeating prefix.",
    ],
    verification:
      "Let x = 0.2(142857). Then 10,000,000x − 10x = 2,142,857.(142857) − 2.(142857) = 2,142,855. Thus x = 2,142,855/9,999,990 = 3/14.",
    rounding:
      "3/14 ≈ 0.2143 to four decimal places and ≈ 0.214286 to six. Neither rounded value replaces the exact expression 0.2(142857).",
    faq: {
      question: "Does 214285 repeat in 3/14?",
      answer:
        "No. The first 2 is a non-repeating prefix. The repeating block is 142857, so the exact notation is 0.2(142857).",
    },
    related: [
      [1, 14],
      [5, 14],
    ],
  },
  "2-5": {
    heading: "Two fifths is four tenths",
    explanation: [
      "Multiply the numerator and denominator by 2: 2/5 = 4/10 = 0.4. The digit 4 is in the tenths place.",
      "In long division, 20 ÷ 5 gives 4 with remainder 0. No more digits are needed. As a percentage, 0.4 × 100% = 40%.",
    ],
    verification: "0.4 × 5 = 2, so the decimal gives back the original numerator.",
    rounding:
      "0.4 and 0.40 have the same value. Adding a trailing zero changes the display, not the number.",
    faq: {
      question: "Are 0.4 and 0.40 the same number?",
      answer: "Yes. Both equal 2/5 exactly; the trailing zero in 0.40 does not change its value.",
    },
    related: [
      [1, 5],
      [3, 5],
    ],
  },
  "5-12": {
    heading: "Why only the 6 repeats",
    explanation: [
      "5/12 = 0.41(6) = 0.416666… . The digits 41 form a non-repeating prefix, followed by the repeating digit 6.",
      "50 ÷ 12 gives 4 with remainder 2; 20 ÷ 12 gives 1 with remainder 8; 80 ÷ 12 gives 6 with remainder 8. From then on, the remainder stays 8, so every following digit is 6.",
    ],
    verification:
      "Let x = 0.41(6). Then 1,000x − 100x = 416.(6) − 41.(6) = 375, so x = 375/900 = 5/12.",
    rounding:
      "To four decimal places, 5/12 ≈ 0.4167. This rounds the repeating value; it does not make 0.4167 an exact equivalent.",
    faq: {
      question: "Is 5/12 exactly 0.4167?",
      answer:
        "No. 0.4167 is rounded to four decimal places. The exact decimal is 0.41(6), with 6 repeating forever.",
    },
    related: [
      [1, 12],
      [7, 12],
    ],
  },
  "5-16": {
    heading: "An exact four-place decimal",
    explanation: [
      "Multiplying both parts by 625 gives 5/16 = 3125/10000 = 0.3125. Because 16 = 2⁴, a denominator of 10,000 is enough to express the fraction exactly.",
    ],
    verification:
      "0.3125 × 16 = 5. The four-place decimal is exact, rather than a rounded approximation.",
    rounding: "To two decimal places, 5/16 ≈ 0.31. Use 0.3125 when you need the full exact value.",
    faq: {
      question: "Is 0.31 the exact value of 5/16?",
      answer: "No. 5/16 is exactly 0.3125; 0.31 is the value rounded to two decimal places.",
    },
    related: [
      [3, 16],
      [7, 16],
    ],
    measurement: { inches: "5/16", millimeters: "7.9375" },
  },
  "11-8": {
    heading: "From an improper fraction to a mixed number",
    explanation: [
      "11 ÷ 8 gives a whole-number part of 1 and a remainder of 3. Therefore 11/8 = 1 3/8 = 1 + 0.375 = 1.375.",
      "The result is greater than 1 because the numerator is larger than the denominator. Keep the whole-number part when converting the remaining 3/8.",
    ],
    verification: "1.375 × 8 = 11, checking both the whole-number and fractional parts.",
    rounding: "1.375 is exact. Rounded to two decimal places, 11/8 ≈ 1.38.",
    faq: {
      question: "What is 11/8 as a mixed number?",
      answer: "11/8 = 1 3/8. Converting the remaining 3/8 to 0.375 gives the exact decimal 1.375.",
    },
    related: [
      [3, 8],
      [9, 8],
      [13, 8],
    ],
  },
  "7-8": {
    heading: "One eighth short of a whole",
    explanation: [
      "7/8 = 875/1000 = 0.875. Another way to see it is 7/8 = 1 − 1/8 = 1 − 0.125 = 0.875.",
    ],
    verification: "0.875 × 8 = 7, so all three decimal digits belong to the exact result.",
    rounding: "To two decimal places, 7/8 ≈ 0.88. The exact value remains 0.875.",
    faq: {
      question: "Should 7/8 be written as 0.875 or 0.88?",
      answer:
        "Use 0.875 for the exact value. Use approximately 0.88 only when rounding to two decimal places.",
    },
    related: [
      [1, 8],
      [3, 8],
    ],
  },
  "2-3": {
    heading: "Why the digit 6 never ends",
    explanation: [
      "2/3 = 0.(6) = 0.666666… . Parentheses mean the digit 6 repeats forever.",
      "20 ÷ 3 gives 6 with remainder 2. Each next step begins with the same remainder, so it produces another 6.",
    ],
    verification: "Let x = 0.(6). Then 10x − x = 6, so 9x = 6 and x = 6/9 = 2/3.",
    rounding:
      "To four decimal places, 2/3 ≈ 0.6667. A finite string ending in 7 is a rounded display, not the exact repeating decimal.",
    faq: {
      question: "Why is 2/3 rounded to 0.6667?",
      answer:
        "The exact digits are 0.666666… . The fifth decimal digit is 6, so rounding to four places increases the fourth digit from 6 to 7.",
    },
    related: [
      [1, 3],
      [4, 3],
    ],
  },
  "1-8": {
    heading: "One eighth in thousandths",
    explanation: [
      "Multiply the numerator and denominator by 125: 1/8 = 125/1000 = 0.125. This is a terminating decimal with three decimal places.",
    ],
    verification: "0.125 × 8 = 1, confirming the exact value.",
    rounding:
      "0.1250 has the same value as 0.125. To two decimal places, 1/8 ≈ 0.13; the third digit, 5, rounds the second digit up.",
    faq: {
      question: "Is 0.13 equal to 1/8?",
      answer:
        "0.13 is a two-place approximation. The exact value of 1/8 is 0.125, which can also be written 0.1250.",
    },
    related: [
      [3, 8],
      [7, 8],
    ],
  },
  "3-8": {
    heading: "Three eighths in decimal and percent form",
    explanation: [
      "Multiplying both parts by 125 gives 3/8 = 375/1000 = 0.375. As a percentage, 0.375 × 100% = 37.5%.",
    ],
    verification: "0.375 × 8 = 3, confirming that 0.375 is exact.",
    rounding:
      "To two decimal places, 3/8 ≈ 0.38. Keep 0.375 for the exact decimal, and 37.5% for percent form.",
    faq: {
      question: "Is 3/8 equal to 0.38 or 37.5%?",
      answer:
        "3/8 equals 0.375 and 37.5% exactly. 0.38 is its approximation rounded to two decimal places.",
    },
    related: [
      [1, 8],
      [7, 8],
    ],
    measurement: { inches: "3/8", millimeters: "9.525" },
  },
}

/** Build exact recurring notation from the same remainder cycle used by long division. */
export function getFractionAnswer(model: FractionPageModel): string {
  if (model.repeatingStart === null) {
    return `${model.fractionLabel} = ${model.core.formattedDecimal} exactly.`
  }
  const digits = model.longDivision.map(({ digit }) => digit).join("")
  const prefix = digits.slice(0, model.repeatingStart)
  const cycle = digits.slice(model.repeatingStart)
  const exact = `${model.wholePart}.${prefix}(${cycle})`
  return `${model.fractionLabel} = ${exact}. The digits in parentheses repeat forever. Rounded to 12 decimal places, ${model.fractionLabel} ≈ ${model.core.formattedDecimal}.`
}

/** Accuracy corrections affect every repeating page; editorial additions affect only the pilots. */
export function getFractionContentRevision({ numerator, denominator }: PseoFractionPair) {
  const hasEditorialContent = Boolean(fractionPageContent[`${numerator}-${denominator}`])
  const hasAccuracyCorrection = !isTerminatingDenominator(denominator)
  if (hasEditorialContent || hasAccuracyCorrection) {
    return { lastModified: "2026-11-13T10:27:26Z", version: "1.2" }
  }
  return { lastModified: PSEO_DETAIL_LAST_MODIFIED_DATE, version: PSEO_CONTENT_VERSION }
}
