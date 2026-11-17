import type { FractionPageModel } from "@/lib/fraction-math/page-model"
import { isTerminatingDenominator } from "@/lib/fraction-math/rational"
import { PSEO_CONTENT_VERSION, PSEO_DETAIL_LAST_MODIFIED_DATE } from "./pseo-fractions"
import type { PseoFractionPair } from "./pseo-fractions"

interface FractionPageContent {
  seoDescription?: string
  revision?: { lastModified: string; version: string }
  heading: string
  explanation: string[]
  verification: string
  rounding: string
  faq: { question: string; answer: string }
  related: [number, number][]
  measurement?: { inches: string; millimeters: string }
}

const NOVEMBER_FRACTION_REVISION = { lastModified: "2026-11-17", version: "1.3" }

/** Editorial explanations are scoped to the original ten pilots and the 27 reviewed GSC pages. */
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
  "5-13": {
    revision: NOVEMBER_FRACTION_REVISION,
    heading: "Following the six digits in 5/13",
    seoDescription:
      "5/13 = 0.(384615), with 384615 repeating. Follow the remainder cycle, verify the exact value, and compare rounding to two and four decimal places.",
    explanation: [
      "The first division step is 50 ÷ 13 = 3 with remainder 11. Continuing gives the digits 8, 4, 6, 1, and 5. The remainder then returns to 5, so all six digits repeat: 5/13 = 0.(384615).",
      "This value is between 1/3 and 2/5: it is greater than 0.333333… and less than 0.4. That comparison is a useful check on the position of the decimal point before choosing a display precision.",
    ],
    verification:
      "0.(384615) = 384615/999999 = 5/13. Multiplying 384615 by 13 gives 4999995, the same as 5 × 999999, so the repeating decimal is exact.",
    rounding:
      "5/13 ≈ 0.38 to two decimal places because the third digit is 4. For four places, 5/13 ≈ 0.3846; the fifth digit is 1, so the final 6 stays unchanged.",
    faq: {
      question: "Is 0.3846 the exact value of 5/13?",
      answer:
        "0.3846 is rounded to four decimal places. The exact value is 0.(384615), with the entire six-digit block repeating forever.",
    },
    related: [
      [4, 13],
      [6, 13],
      [1, 3],
      [2, 5],
    ],
  },
  "1-13": {
    revision: NOVEMBER_FRACTION_REVISION,
    heading: "The leading zero belongs to the cycle",
    seoDescription:
      "1/13 = 0.(076923). Learn why the leading zero repeats, check the value with 76923/999999, and round it to two or four decimal places.",
    explanation: [
      "Because 10 is smaller than 13, the tenths digit is 0. Bringing down another zero gives 100 ÷ 13 = 7 with remainder 9. The full cycle is 076923, including its first zero.",
      "After six decimal digits, the remainder returns to 1. Write 1/13 = 0.(076923), or 0.076923076923… . Dropping the zero inside the parentheses would change the value and the length of the cycle.",
    ],
    verification:
      "0.(076923) = 76923/999999 = 1/13. Although the numerator is written without a leading zero, the denominator has six nines because the repeating block has six digits.",
    rounding:
      "1/13 ≈ 0.08 to two decimal places: the third digit, 6, increases the hundredths digit from 7 to 8. To four places, 1/13 ≈ 0.0769 because the fifth digit is 2.",
    faq: {
      question: "Can I write 1/13 as 0.(76923)?",
      answer:
        "No. The zero is part of the six-digit cycle. Use 0.(076923); 0.(76923) starts with a 7 in the tenths place and represents a different number.",
    },
    related: [
      [2, 13],
      [12, 13],
      [1, 14],
    ],
  },
  "11-13": {
    revision: NOVEMBER_FRACTION_REVISION,
    heading: "Check eleven thirteenths by subtracting from 1",
    seoDescription:
      "11/13 = 0.(846153). Check it using 1 minus 2/13, verify its repeating decimal, and see why it rounds to 0.85 or 0.8462.",
    explanation: [
      "Eleven thirteenths is two thirteenths short of 1: 11/13 = 1 − 2/13. Since 2/13 = 0.(153846), the difference is 0.(846153).",
      "Long division begins with 110 ÷ 13 = 8, remainder 6, followed by 60 ÷ 13 = 4, remainder 8. The digits continue as 6153, and the remainder returns to 11 after the full block 846153.",
    ],
    verification:
      "0.(846153) = 846153/999999 = 11/13. Cross-multiplication gives 846153 × 13 = 10999989 and 11 × 999999 = 10999989.",
    rounding:
      "11/13 ≈ 0.85 to two decimal places because the third digit is 6. At four places, 11/13 ≈ 0.8462: the fifth digit is 5, so the fourth digit increases from 1 to 2.",
    faq: {
      question: "Why does 11/13 round to 0.8462 rather than 0.8461?",
      answer:
        "The exact decimal starts 0.846153… . The fifth decimal digit is 5, so rounding to four places increases the last retained digit from 1 to 2.",
    },
    related: [
      [2, 13],
      [10, 13],
      [12, 13],
    ],
  },
  "15-32": {
    revision: NOVEMBER_FRACTION_REVISION,
    heading: "One thirty-second below a half",
    seoDescription:
      "15/32 is exactly 0.46875. Check it as one half minus 1/32, verify by multiplication, and round to two or four decimal places.",
    explanation: [
      "A half is 16/32, so 15/32 = 1/2 − 1/32. Subtracting the exact decimals gives 0.5 − 0.03125 = 0.46875. The result must be just below a half.",
      "The denominator is 32 = 2⁵. Multiplying both parts by 3125 gives 46875/100000, so all five decimal places are exact. Long division ends when the remainder reaches zero.",
    ],
    verification:
      "0.46875 × 32 = 15. This multiplication recovers the numerator without a rounding error, confirming the five-place decimal.",
    rounding:
      "15/32 ≈ 0.47 to two decimal places because the third digit is 8. Using four places, 15/32 ≈ 0.4688; the final 5 is an exact halfway case, rounded upward here.",
    faq: {
      question: "Is 15/32 exactly 0.47?",
      answer:
        "Its exact value is 0.46875. The shorter value 0.47 is rounded to two decimal places and is slightly larger than the fraction.",
    },
    related: [
      [13, 32],
      [17, 32],
      [1, 32],
      [1, 2],
    ],
  },
  "10-13": {
    revision: NOVEMBER_FRACTION_REVISION,
    heading: "Keep the zero at the end of 769230",
    seoDescription:
      "10/13 = 0.(769230). See why the final zero is part of the cycle, verify the exact fraction, and round to 0.77 or 0.7692.",
    explanation: [
      "Multiplying 1/13 = 0.(076923) by 10 moves the decimal point one place. The result is 10/13 = 0.(769230). The zero has moved to the end of the repeating block; it has not disappeared.",
      "In long division, the sixth step divides 10 by 13, producing a 0 and leaving remainder 10. That remainder restarts the sequence, so the six-digit block 769230 repeats.",
    ],
    verification:
      "0.(769230) = 769230/999999 = 10/13. Both cross-products, 769230 × 13 and 10 × 999999, equal 9999990.",
    rounding:
      "10/13 ≈ 0.77 to two decimal places, since the third digit is 9. For four places, 10/13 ≈ 0.7692; the fifth digit is 3, so the fourth digit remains 2.",
    faq: {
      question: "Is the repeating block of 10/13 just 76923?",
      answer:
        "The block is 769230, with six digits. Omitting its final zero changes the positions of every digit after the first block.",
    },
    related: [
      [1, 13],
      [9, 13],
      [11, 13],
    ],
  },
  "7-13": {
    revision: NOVEMBER_FRACTION_REVISION,
    heading: "Seven thirteenths is slightly more than a half",
    seoDescription:
      "7/13 = 0.(538461). Compare it with one half, follow the repeating remainder, and check two-place and four-place rounding.",
    explanation: [
      "Since 7/13 = 14/26 and 1/2 = 13/26, the difference is 1/26. Seven thirteenths is therefore a little above 0.5, consistent with the decimal 0.538461538461… .",
      "The first digit comes from 70 ÷ 13 = 5 with remainder 5. Continuing produces 38461 and returns the remainder to 7. The exact notation is 0.(538461).",
    ],
    verification:
      "0.(538461) = 538461/999999 = 7/13. The equality follows from 538461 × 13 = 6999993 = 7 × 999999.",
    rounding:
      "7/13 ≈ 0.54 to two decimal places because the third digit is 8. To four places, 7/13 ≈ 0.5385: the fifth digit is 6, so the fourth digit rises from 4 to 5.",
    faq: {
      question: "How far above one half is 7/13?",
      answer:
        "It is exactly 1/26 above one half: 7/13 − 1/2 = 14/26 − 13/26 = 1/26. Its decimal begins 0.538461… .",
    },
    related: [
      [6, 13],
      [8, 13],
      [1, 2],
    ],
  },
  "14-15": {
    revision: NOVEMBER_FRACTION_REVISION,
    heading: "A single 9 before the repeating 3",
    seoDescription:
      "14/15 = 0.9(3), with only the 3 repeating. Separate the prefix from the cycle, verify with 84/90, and compare rounding examples.",
    explanation: [
      "Dividing 140 by 15 gives the first decimal digit 9 and remainder 5. Every later step divides 50 by 15, producing 3 and leaving remainder 5 again. Only the 3 repeats: 14/15 = 0.9(3).",
      "The fraction is one fifteenth below 1. Its denominator 15 = 3 × 5 explains the decimal form: the factor 5 allows a one-digit prefix, while the remaining factor 3 produces a recurring digit.",
    ],
    verification:
      "0.9(3) = 84/90 = 14/15. To obtain 84/90, let x = 0.9(3): subtracting 10x from 100x cancels the repeating tail and gives 90x = 84.",
    rounding:
      "14/15 ≈ 0.93 to two decimal places and 14/15 ≈ 0.9333 to four places. In both cases the next digit is 3, so rounding leaves the last retained digit unchanged.",
    faq: {
      question: "Does 93 repeat in the decimal for 14/15?",
      answer:
        "The 9 occurs once before the repeating part. Write 0.9(3), meaning 0.933333… . Writing 0.(93) would mean 0.939393… .",
    },
    related: [
      [1, 15],
      [13, 15],
      [2, 15],
    ],
  },
  "6-7": {
    revision: NOVEMBER_FRACTION_REVISION,
    heading: "Six sevenths and the distance to 1",
    seoDescription:
      "6/7 = 0.(857142). Check it as 1 minus 1/7, verify the six-digit cycle, and round to 0.86 or 0.8571.",
    explanation: [
      "Six sevenths is one seventh short of a whole: 6/7 = 1 − 1/7. Subtracting 0.142857142857… from 1 gives 0.857142857142… .",
      "The division starts with 60 ÷ 7 = 8, remainder 4, then 40 ÷ 7 = 5, remainder 5. After the digits 857142, the remainder is 6 again and the same block starts over.",
    ],
    verification:
      "0.(857142) = 857142/999999 = 6/7. Multiplying 857142 by 7 gives 5999994, equal to 6 × 999999.",
    rounding:
      "6/7 ≈ 0.86 to two decimal places because the third digit is 7. At four places, 6/7 ≈ 0.8571; the fifth digit is 4, so the final 1 does not increase.",
    faq: {
      question: "Why is 6/7 less than 0.86?",
      answer:
        "The exact decimal starts 0.857142… . Rounding to two places gives 0.86, which is slightly larger. Keep 0.(857142) when an exact decimal expression is needed.",
    },
    related: [
      [1, 7],
      [5, 7],
      [3, 7],
    ],
  },
  "1-32": {
    revision: NOVEMBER_FRACTION_REVISION,
    heading: "One part out of thirty-two",
    seoDescription:
      "1/32 is exactly 0.03125. Convert it to hundred-thousandths, verify by multiplying by 32, and see why four-place rounding gives 0.0313.",
    explanation: [
      "Multiplying the numerator and denominator by 3125 gives 1/32 = 3125/100000 = 0.03125. The zero in the tenths place matters: one thirty-second is less than one tenth.",
      "Because 32 = 2⁵, five decimal places are enough for an exact result. Every thirty-second adds another 0.03125, so this value is also a useful starting point for fractions such as 5/32 and 7/32.",
    ],
    verification:
      "0.03125 × 32 = 1. The product is exactly 1, so 0.03125 is the full decimal value rather than a shortened display.",
    rounding:
      "1/32 ≈ 0.03 to two decimal places because the third digit is 1. To four places, 1/32 ≈ 0.0313; its exact fifth digit is 5, and the halfway case rounds upward here.",
    faq: {
      question: "Why does 1/32 round to 0.0313 instead of 0.0312?",
      answer:
        "The exact value is 0.03125. At four decimal places this is halfway between 0.0312 and 0.0313. The examples use the rule that an exact halfway case rounds upward.",
    },
    related: [
      [3, 32],
      [5, 32],
      [1, 16],
    ],
  },
  "23-32": {
    revision: NOVEMBER_FRACTION_REVISION,
    heading: "One thirty-second below three quarters",
    seoDescription:
      "23/32 = 0.71875 exactly. Use 3/4 minus 1/32 to check the result, then compare rounding to 0.72 and 0.7188.",
    explanation: [
      "Three quarters is 24/32, so 23/32 = 3/4 − 1/32. Using exact decimals, 0.75 − 0.03125 = 0.71875. This places the fraction just below three quarters.",
      "The first two division steps are 230 ÷ 32 = 7 with remainder 6, then 60 ÷ 32 = 1 with remainder 28. The remaining digits are 875, and the division ends at zero remainder.",
    ],
    verification:
      "0.71875 × 32 = 23. Recovering the numerator confirms all five digits of the exact decimal.",
    rounding:
      "23/32 ≈ 0.72 to two decimal places because the third digit is 8. To four places, 23/32 ≈ 0.7188; the last 5 makes an exact halfway case, rounded upward here.",
    faq: {
      question: "How close is 23/32 to 3/4?",
      answer: "It is exactly 1/32 below 3/4. The decimal difference is 0.75 − 0.71875 = 0.03125.",
    },
    related: [
      [21, 32],
      [25, 32],
      [3, 4],
      [1, 32],
    ],
  },
  "2-13": {
    revision: NOVEMBER_FRACTION_REVISION,
    heading: "Double the decimal for one thirteenth",
    seoDescription:
      "2/13 = 0.(153846). Check the result by doubling 1/13, verify the recurring fraction, and round to 0.15 or 0.1538.",
    explanation: [
      "Two thirteenths is twice 1/13. Doubling 0.076923076923… gives 0.153846153846… , so the six-digit repeating block is 153846.",
      "Long division begins with 20 ÷ 13 = 1 and remainder 7. The remainders then pass through 5, 11, 6, and 8 before returning to 2. Returning to the starting remainder repeats the same six digits.",
    ],
    verification:
      "0.(153846) = 153846/999999 = 2/13. The cross-products agree: 153846 × 13 = 1999998 = 2 × 999999.",
    rounding:
      "2/13 ≈ 0.15 to two decimal places; the third digit is 3. At four places, 2/13 ≈ 0.1538 because the fifth digit is 4. Both displays shorten a decimal that repeats forever.",
    faq: {
      question: "Does 1538 repeat in 2/13?",
      answer:
        "The full repeating block is 153846. The value 0.1538 is only a four-place approximation, so its four digits should not be put in repeating parentheses.",
    },
    related: [
      [1, 13],
      [3, 13],
      [11, 13],
    ],
  },
  "7-32": {
    revision: NOVEMBER_FRACTION_REVISION,
    heading: "Seven thirty-seconds is just below a quarter",
    seoDescription:
      "7/32 is exactly 0.21875. Compare it with 1/4, verify the five-place result, and work through two-place and four-place rounding.",
    explanation: [
      "A quarter is 8/32. Subtract one thirty-second to get 7/32 = 1/4 − 1/32 = 0.25 − 0.03125 = 0.21875.",
      "The division steps produce 2, 1, 8, 7, and 5, with remainders 6, 28, 24, 16, and finally 0. Reaching zero after five places makes 0.21875 exact.",
    ],
    verification:
      "0.21875 × 32 = 7. This checks the decimal directly against the numerator, including all five decimal digits.",
    rounding:
      "7/32 ≈ 0.22 to two decimal places because the third digit is 8. For four places, 7/32 ≈ 0.2188; the final 5 is an exact halfway case and rounds upward here.",
    faq: {
      question: "Is 7/32 smaller than 1/4?",
      answer:
        "Yes. Write 1/4 as 8/32 to see that 7/32 is smaller by 1/32. In decimals, the difference is 0.25 − 0.21875 = 0.03125.",
    },
    related: [
      [5, 32],
      [9, 32],
      [1, 4],
      [1, 32],
    ],
  },
  "13-14": {
    revision: NOVEMBER_FRACTION_REVISION,
    heading: "Thirteen fourteenths has a non-repeating 9",
    seoDescription:
      "13/14 = 0.9(285714). Separate the first 9 from the repeating block, verify the exact value, and round to 0.93 or 0.9286.",
    explanation: [
      "Thirteen fourteenths is 1 − 1/14, so its value is close to 1. Subtracting 0.071428571428… gives 0.928571428571… , written exactly as 0.9(285714).",
      "The first division step, 130 ÷ 14, gives 9 with remainder 4. The next six digits, 285714, bring the remainder back to 4. The initial 9 stays outside the repeating parentheses.",
    ],
    verification:
      "0.9(285714) = 9285705/9999990 = 13/14. For x = 0.9(285714), subtracting 10x from 10000000x cancels the repeating tail and gives 9999990x = 9285705.",
    rounding:
      "13/14 ≈ 0.93 to two decimal places because the third digit is 8. At four places, 13/14 ≈ 0.9286; the fifth digit is 7, so the fourth digit increases from 5 to 6.",
    faq: {
      question: "Why is the first 9 not inside the repeating block of 13/14?",
      answer:
        "After the first 9, the digits repeat as 285714. The remainder first returns to 4 after those six digits, so the exact notation is 0.9(285714).",
    },
    related: [
      [1, 14],
      [11, 14],
      [6, 7],
    ],
  },
  "12-13": {
    revision: NOVEMBER_FRACTION_REVISION,
    heading: "One thirteenth short of a whole",
    seoDescription:
      "12/13 = 0.(923076). Check it by subtracting 1/13 from 1, verify its exact repeating form, and round to two or four decimal places.",
    explanation: [
      "Use the complement 12/13 = 1 − 1/13. Since 1/13 = 0.076923076923… , twelve thirteenths is 0.923076923076… . The result is below 1 by exactly one thirteenth.",
      "The cycle contains an internal zero: 923076. In long division, the fourth step starts with remainder 1, so 10 ÷ 13 gives a 0. Keeping that zero preserves the six-digit cycle.",
    ],
    verification:
      "0.(923076) = 923076/999999 = 12/13. Multiplying 923076 by 13 gives 11999988, equal to 12 × 999999.",
    rounding:
      "12/13 ≈ 0.92 to two decimal places because the third digit is 3. To four places, 12/13 ≈ 0.9231: the fifth digit is 7, so the fourth digit, 0, increases to 1.",
    faq: {
      question: "Why does four-place rounding of 12/13 end in 1?",
      answer:
        "The exact digits begin 0.923076… . The first four are 9230, and the next digit is 7. Rounding increases the final retained zero to 1, giving 0.9231.",
    },
    related: [
      [1, 13],
      [10, 13],
      [11, 13],
    ],
  },
  "2-15": {
    revision: NOVEMBER_FRACTION_REVISION,
    heading: "A single 1 followed by recurring threes",
    seoDescription:
      "2/15 = 0.1(3). Follow the remainder that produces repeated threes, verify with 12/90, and compare 0.13 with 0.1333.",
    explanation: [
      "The first step is 20 ÷ 15 = 1 with remainder 5. Every later step divides 50 by 15 and produces 3 with the same remainder 5. Thus 2/15 = 0.1(3), with only the 3 recurring.",
      "Another route is to divide two thirds by 5: (2/3) ÷ 5 = 2/15. Dividing 0.666666… by 5 gives 0.133333… , which checks the size and the recurring digit.",
    ],
    verification:
      "0.1(3) = 12/90 = 2/15. If x = 0.1(3), then 100x − 10x = 13.(3) − 1.(3) = 12, so 90x = 12.",
    rounding:
      "2/15 ≈ 0.13 to two decimal places and 2/15 ≈ 0.1333 to four places. The next digit is always 3 after the prefix, so neither rounding increases the final digit.",
    faq: {
      question: "Is 0.13 equal to 2/15?",
      answer:
        "0.13 is a two-place approximation. The exact decimal is 0.1(3), or 0.133333… , so stopping after 0.13 leaves out a positive recurring tail.",
    },
    related: [
      [1, 15],
      [4, 15],
      [2, 3],
    ],
  },
  "11-14": {
    revision: NOVEMBER_FRACTION_REVISION,
    heading: "A half plus two sevenths",
    seoDescription:
      "11/14 = 0.7(857142). Check it as 1/2 plus 2/7, distinguish the prefix from the cycle, and see two rounding examples.",
    explanation: [
      "Split 11/14 into 7/14 + 4/14 = 1/2 + 2/7. Adding 0.5 to 0.285714285714… gives 0.785714285714… , or 0.7(857142).",
      "The first decimal digit comes from 110 ÷ 14 = 7, remainder 12. The next six digits return the remainder to 12, so 857142 repeats after the initial 7.",
    ],
    verification:
      "0.7(857142) = 7857135/9999990 = 11/14. Let x equal that decimal. Subtracting 10x from 10000000x leaves 9999990x = 7857135, with the recurring digits canceled.",
    rounding:
      "11/14 ≈ 0.79 to two decimal places; the third digit is 5, so the second digit increases from 8 to 9. To four places, 11/14 ≈ 0.7857 because the fifth digit is 1.",
    faq: {
      question: "Does 785714 repeat in 11/14?",
      answer:
        "The first 7 is a non-repeating prefix. The cycle after it is 857142, so use 0.7(857142) for the exact repeating notation.",
    },
    related: [
      [2, 7],
      [9, 14],
      [13, 14],
    ],
  },
  "2-7": {
    revision: NOVEMBER_FRACTION_REVISION,
    heading: "Two sevenths starts the cycle at 285714",
    seoDescription:
      "2/7 = 0.(285714). Double one seventh, verify the six-digit cycle with 285714/999999, and round to 0.29 or 0.2857.",
    explanation: [
      "Doubling 1/7 = 0.(142857) gives 2/7 = 0.(285714). The same six digits occur in a different starting position, and every digit belongs to the repeating block.",
      "In long division, 20 ÷ 7 gives 2 with remainder 6, then 60 ÷ 7 gives 8 with remainder 4. Completing the block 285714 returns the remainder to 2, ready for the next block.",
    ],
    verification:
      "0.(285714) = 285714/999999 = 2/7. The cross-products are 285714 × 7 = 1999998 and 2 × 999999 = 1999998.",
    rounding:
      "2/7 ≈ 0.29 to two decimal places because the third digit is 5. To four places, 2/7 ≈ 0.2857; the fifth digit is 1 and leaves the final 7 unchanged.",
    faq: {
      question: "Why is 2/7 rounded to 0.29 instead of 0.28?",
      answer:
        "The exact decimal begins 0.285714… . Its third decimal digit is 5, with more nonzero digits after it, so rounding to two places increases 0.28 to 0.29.",
    },
    related: [
      [1, 7],
      [3, 7],
      [5, 7],
    ],
  },
  "25-32": {
    revision: NOVEMBER_FRACTION_REVISION,
    heading: "Use the complement seven thirty-seconds",
    seoDescription:
      "25/32 is exactly 0.78125. Check it using 1 minus 7/32, verify by multiplication, and round to 0.78 or 0.7813.",
    explanation: [
      "The numerators 25 and 7 add to 32, so 25/32 = 1 − 7/32. Subtracting the exact value 0.21875 from 1 gives 0.78125.",
      "Long division starts with 250 ÷ 32 = 7, remainder 26, then 260 ÷ 32 = 8, remainder 4. Three more digits, 125, finish the division with remainder zero.",
    ],
    verification:
      "0.78125 × 32 = 25. As a second check, the exact decimals 0.78125 and 0.21875 add to 1.",
    rounding:
      "25/32 ≈ 0.78 to two decimal places because the third digit is 1. To four places, 25/32 ≈ 0.7813; the exact final 5 is a halfway case, rounded upward here.",
    faq: {
      question: "Is 0.78125 a rounded value of 25/32?",
      answer:
        "No. It is the exact five-place decimal. The denominator 32 is a power of 2, and long division reaches a zero remainder after the fifth digit.",
    },
    related: [
      [7, 32],
      [23, 32],
      [27, 32],
    ],
  },
  "5-32": {
    revision: NOVEMBER_FRACTION_REVISION,
    heading: "An eighth plus one thirty-second",
    seoDescription:
      "5/32 = 0.15625 exactly. Add 1/8 and 1/32 to check it, verify the decimal by multiplication, and compare two rounding precisions.",
    explanation: [
      "One eighth is 4/32. Adding one more thirty-second gives 5/32 = 1/8 + 1/32 = 0.125 + 0.03125 = 0.15625.",
      "In long division, the first two steps produce 1 with remainder 18, then 5 with remainder 20. Continuing produces 625 and ends at remainder zero. Those five digits are the complete decimal.",
    ],
    verification:
      "0.15625 × 32 = 5. The product returns the original numerator exactly, so the decimal does not need a recurring marker.",
    rounding:
      "5/32 ≈ 0.16 to two decimal places because the third digit is 6. For four places, 5/32 ≈ 0.1563; the exact final digit is 5, and a halfway case rounds upward here.",
    faq: {
      question: "Why is 5/32 larger than 1/8?",
      answer:
        "Write 1/8 as 4/32. The difference is one thirty-second, or exactly 0.03125. Adding it to 0.125 gives 0.15625.",
    },
    related: [
      [3, 32],
      [7, 32],
      [1, 8],
      [1, 32],
    ],
  },
  "9-14": {
    revision: NOVEMBER_FRACTION_REVISION,
    heading: "A half plus one seventh",
    seoDescription:
      "9/14 = 0.6(428571). Check it as 1/2 plus 1/7, verify the exact decimal, and see why four-place rounding gives 0.6429.",
    explanation: [
      "Since 9/14 = 7/14 + 2/14, it is 1/2 + 1/7. Adding 0.5 and 0.142857142857… gives 0.642857142857… , written as 0.6(428571).",
      "The initial division step gives 6 with remainder 6. The following six digits are 428571 and return the remainder to 6. The first 6 is therefore a prefix, not part of the repeating block.",
    ],
    verification:
      "0.6(428571) = 6428565/9999990 = 9/14. With x equal to the decimal, 10000000x − 10x = 6428565, so x = 6428565/9999990.",
    rounding:
      "9/14 ≈ 0.64 to two decimal places because the third digit is 2. At four places, 9/14 ≈ 0.6429; the fifth digit is 5 and the recurring tail continues, so the fourth digit increases.",
    faq: {
      question: "Which digits repeat in 9/14?",
      answer:
        "The six digits 428571 repeat after a single initial 6. The exact form is 0.6(428571), and its four-place approximation is 0.6429.",
    },
    related: [
      [1, 7],
      [1, 2],
      [11, 14],
    ],
  },
  "13-32": {
    revision: NOVEMBER_FRACTION_REVISION,
    heading: "One thirty-second above three eighths",
    seoDescription:
      "13/32 is exactly 0.40625. Check it by adding 3/8 and 1/32, verify by multiplication, and round to 0.41 or 0.4063.",
    explanation: [
      "Three eighths equals 12/32. Add one thirty-second to obtain 13/32 = 3/8 + 1/32 = 0.375 + 0.03125 = 0.40625.",
      "The hundredths digit is zero: after the first division step leaves remainder 2, the next step divides 20 by 32 and produces 0. Keep that zero when writing 0.40625; omitting it changes the value.",
    ],
    verification:
      "0.40625 × 32 = 13. This checks the internal zero as well as the other decimal digits against the original fraction.",
    rounding:
      "13/32 ≈ 0.41 to two decimal places: the third digit is 6, so the zero in the hundredths place increases to 1. To four places, 13/32 ≈ 0.4063, rounding the exact halfway case upward.",
    faq: {
      question: "Why does 13/32 have a zero after the 4?",
      answer:
        "The hundredths step has 20 to divide by 32, so its quotient digit is 0. The exact decimal is 0.40625, with that zero keeping each following digit in its correct place.",
    },
    related: [
      [11, 32],
      [15, 32],
      [3, 8],
      [1, 32],
    ],
  },
  "3-7": {
    revision: NOVEMBER_FRACTION_REVISION,
    heading: "Three sevenths and the block 428571",
    seoDescription:
      "3/7 = 0.(428571). Follow its six-digit remainder cycle, check the exact repeating fraction, and round to 0.43 or 0.4286.",
    explanation: [
      "The fraction is three copies of 1/7, so multiplying 0.142857142857… by 3 gives 0.428571428571… . Because 2 × 3 = 6 is less than 7, three sevenths is below one half.",
      "Long division starts with 30 ÷ 7 = 4, remainder 2, followed by 20 ÷ 7 = 2, remainder 6. After the six digits 428571, the remainder returns to 3 and the cycle repeats.",
    ],
    verification:
      "0.(428571) = 428571/999999 = 3/7. Cross-multiplication gives 428571 × 7 = 2999997 = 3 × 999999.",
    rounding:
      "3/7 ≈ 0.43 to two decimal places because the third digit is 8. To four places, 3/7 ≈ 0.4286; the fifth digit is 7, so the fourth digit increases from 5 to 6.",
    faq: {
      question: "Is 0.4286 larger or smaller than 3/7?",
      answer:
        "It is slightly larger. The exact decimal starts 0.428571… , so rounding to four places increases the fourth digit and gives 0.4286.",
    },
    related: [
      [1, 7],
      [2, 7],
      [4, 7],
      [1, 2],
    ],
  },
  "5-4": {
    revision: NOVEMBER_FRACTION_REVISION,
    heading: "Keep the whole number in five quarters",
    seoDescription:
      "5/4 = 1.25 exactly, or 1 1/4 as a mixed number. Check both parts, verify by multiplying by 4, and round to one decimal place.",
    explanation: [
      "Five quarters contains one whole and one quarter: 5/4 = 4/4 + 1/4 = 1 + 0.25 = 1.25. The result is greater than 1 because the numerator is larger than the denominator.",
      "To use a power-of-ten denominator, multiply both parts by 25: 5/4 = 125/100. The 1 is the whole-number part and the 25 represents twenty-five hundredths. Converting only the remainder would lose the whole number.",
    ],
    verification:
      "1.25 × 4 = 5. This multiplication checks that the whole-number part is included as well as the fractional quarter.",
    rounding:
      "5/4 ≈ 1.3 to one decimal place, rounding the exact halfway value 1.25 upward. At two places, 5/4 = 1.25 exactly; adding more trailing zeros changes only the display.",
    faq: {
      question: "Why is 5/4 equal to 1.25 rather than 0.25?",
      answer:
        "Dividing 5 by 4 gives a whole-number part of 1 and a remainder of 1. The remaining quarter is 0.25, which must be added to the whole number.",
    },
    related: [
      [1, 4],
      [3, 4],
      [7, 4],
      [3, 2],
    ],
  },
  "5-9": {
    revision: NOVEMBER_FRACTION_REVISION,
    heading: "A repeating 5 from the same remainder",
    seoDescription:
      "5/9 = 0.(5), with 5 repeating forever. Verify the value algebraically, distinguish it from 0.55, and round to 0.56 or 0.5556.",
    explanation: [
      "Each long-division step divides 50 by 9, giving 5 with remainder 5. The same remainder immediately produces the next 5, so the decimal is 0.(5) = 0.555555… .",
      "One ninth is 0.(1), and five copies give 0.(5). A finite display such as 0.55 stops before the positive recurring tail, so it is smaller than five ninths.",
    ],
    verification:
      "0.(5) = 5/9. Let x = 0.(5); then 10x − x = 5, giving 9x = 5. This recovers the fraction from the exact recurring decimal.",
    rounding:
      "5/9 ≈ 0.56 to two decimal places and 5/9 ≈ 0.5556 to four places. In each case the next digit is 5 and more nonzero digits follow, so the last retained digit increases.",
    faq: {
      question: "Why is 5/9 rounded to 0.56 instead of 0.55?",
      answer:
        "The exact value is 0.555555… . Its third decimal digit is 5 and the tail continues, so rounding to two places increases the hundredths digit to 6.",
    },
    related: [
      [4, 9],
      [7, 9],
      [1, 9],
    ],
  },
  "4-9": {
    revision: NOVEMBER_FRACTION_REVISION,
    heading: "Four ninths keeps producing the digit 4",
    seoDescription:
      "4/9 = 0.(4), with 4 repeating forever. Verify the recurring value, compare it with 0.44, and round to two or four decimal places.",
    explanation: [
      "Dividing 40 by 9 gives 4 with remainder 4. Every next step begins with that same remainder, so each following digit is another 4. The exact decimal is 0.(4).",
      "Four ninths and five ninths add to 1. Their exact decimals, 0.444444… and 0.555555… , are complementary. A finite 0.44 is slightly below four ninths because it omits the recurring tail.",
    ],
    verification:
      "0.(4) = 4/9. If x = 0.(4), then 10x − x = 4, so 9x = 4. The equation verifies the entire recurring decimal without truncating it.",
    rounding:
      "4/9 ≈ 0.44 to two decimal places and 4/9 ≈ 0.4444 to four places. The next digit is 4 in either case, so rounding does not increase the final retained digit.",
    faq: {
      question: "Is 0.44 exactly four ninths?",
      answer:
        "No. Four ninths is 0.(4), with infinitely many 4s. The value 0.44 is its two-place approximation and is slightly smaller than the exact fraction.",
    },
    related: [
      [5, 9],
      [2, 9],
      [1, 9],
    ],
  },
  "13-16": {
    revision: NOVEMBER_FRACTION_REVISION,
    heading: "Three sixteenths short of a whole",
    seoDescription:
      "13/16 is exactly 0.8125. Check it as 1 minus 3/16, verify the decimal by multiplication, and round to 0.81 or 0.813.",
    explanation: [
      "Thirteen sixteenths is 1 − 3/16. Since 3/16 is exactly 0.1875, subtracting it from 1 gives 0.8125.",
      "The denominator 16 = 2⁴ can be changed to 10000 by multiplying by 625. Applying the same multiplier to the numerator gives 8125/10000, confirming an exact decimal with four places.",
    ],
    verification:
      "0.8125 × 16 = 13. The product recovers the numerator exactly, which distinguishes the full value from a shorter rounded display.",
    rounding:
      "13/16 ≈ 0.81 to two decimal places because the third digit is 2. To three places, 13/16 ≈ 0.813; the exact last digit is 5, so the halfway case rounds upward here.",
    faq: {
      question: "Is 13/16 a repeating decimal?",
      answer:
        "No. Its exact value is 0.8125, and long division ends after four decimal places. The reduced denominator 16 contains only the prime factor 2.",
    },
    related: [
      [3, 16],
      [11, 16],
      [15, 16],
    ],
  },
  "1-14": {
    revision: NOVEMBER_FRACTION_REVISION,
    heading: "A zero prefix before 714285 repeats",
    seoDescription:
      "1/14 = 0.0(714285). Learn why the first zero is outside the repeating block, verify the exact value, and round to 0.07 or 0.0714.",
    explanation: [
      "One fourteenth is half of one seventh. Dividing 0.142857142857… by 2 gives 0.071428571428… , written exactly as 0.0(714285).",
      "The first division step gives 0 because 10 is less than 14, leaving remainder 10. The next six digits, 714285, return the remainder to 10. Keep the initial zero outside the parentheses; repeating 0714285 would create a different seven-digit cycle.",
    ],
    verification:
      "0.0(714285) = 714285/9999990 = 1/14. Let x = 0.0(714285). Then 10000000x − 10x = 714285, so 9999990x = 714285.",
    rounding:
      "1/14 ≈ 0.07 to two decimal places because the third digit is 1. To four places, 1/14 ≈ 0.0714; the fifth digit is 2, leaving the fourth digit unchanged.",
    faq: {
      question: "Does 0714285 repeat in 1/14?",
      answer:
        "No. The initial zero occurs before the cycle. The six digits 714285 repeat, so write 0.0(714285), meaning 0.071428571428… .",
    },
    related: [
      [1, 7],
      [3, 14],
      [13, 14],
    ],
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

/** Preserve earlier accuracy dates unless a page has an explicit editorial revision. */
export function getFractionContentRevision({ numerator, denominator }: PseoFractionPair) {
  const editorialContent = fractionPageContent[`${numerator}-${denominator}`]
  if (editorialContent?.revision) {
    return editorialContent.revision
  }
  const hasEditorialContent = Boolean(editorialContent)
  const hasAccuracyCorrection = !isTerminatingDenominator(denominator)
  if (hasEditorialContent || hasAccuracyCorrection) {
    return { lastModified: "2026-11-13T10:27:26Z", version: "1.2" }
  }
  return { lastModified: PSEO_DETAIL_LAST_MODIFIED_DATE, version: PSEO_CONTENT_VERSION }
}
