export type MeasurementUnit = "inch" | "mm"

export type DrillSizeSystem = "fractional-inch" | "number" | "letter" | "metric"

export interface DrillMatchInput {
  value: number
  unit: MeasurementUnit
  tolerance?: {
    value: number
    unit: MeasurementUnit
  }
}

export interface DrillCandidate {
  label: string
  nominalInches: number
  nominalMillimeters: number
  deviationInches: number
  absoluteDeviationInches: number
  deviationMillimeters: number
  absoluteDeviationMillimeters: number
  withinTolerance?: boolean
}

export interface DrillSystemMatch {
  system: DrillSizeSystem
  nearest: DrillCandidate[]
  lower: DrillCandidate | null
  upper: DrillCandidate | null
}

export type DrillMatchResult =
  | {
      ok: true
      input: {
        value: number
        unit: MeasurementUnit
        inches: number
        millimeters: number
      }
      matches: DrillSystemMatch[]
    }
  | {
      ok: false
      code: "invalid_measurement" | "invalid_tolerance"
      error: string
    }

export interface DrillReferenceSource {
  authority: string
  reference: string
  url: string
  role: "conversion-definition" | "standards-scope" | "cross-check"
  access: "public" | "public-abstract-paid-full-text"
}

export interface DrillReferenceMetadata {
  id: "drill-reference-set"
  version: string
  verifiedOn: string
  exactConversion: {
    inches: 1
    millimeters: 25.4
  }
  systems: Array<{
    system: DrillSizeSystem
    count: number
    scope: string
  }>
  sources: DrillReferenceSource[]
  certifiedByStandardsBody: false
  limitations: string[]
}

const MILLIMETERS_PER_INCH = 25.4
const TIE_EPSILON_INCHES = 1e-12

interface NominalDrillSize {
  label: string
  nominalInches: number
  nominalMillimeters: number
}

function greatestCommonDivisor(left: number, right: number): number {
  let a = Math.abs(left)
  let b = Math.abs(right)

  while (b !== 0) {
    const remainder = a % b
    a = b
    b = remainder
  }

  return a
}

function fractionalLabel(numerator: number): string {
  if (numerator === 64) return "1"

  const divisor = greatestCommonDivisor(numerator, 64)
  return `${numerator / divisor}/${64 / divisor}`
}

const FRACTIONAL_INCH_SIZES = Array.from({ length: 64 }, (_, index) => {
  const numerator = index + 1
  return {
    label: fractionalLabel(numerator),
    nominalInches: numerator / 64,
    nominalMillimeters: (numerator / 64) * MILLIMETERS_PER_INCH,
  }
})

const NUMBER_DRILL_INCHES = [
  0.0135, 0.0145, 0.016, 0.018, 0.02, 0.021, 0.0225, 0.024, 0.025, 0.026, 0.028, 0.0292, 0.031,
  0.032, 0.033, 0.035, 0.036, 0.037, 0.038, 0.039, 0.04, 0.041, 0.042, 0.043, 0.0465, 0.052, 0.055,
  0.0595, 0.0635, 0.067, 0.07, 0.073, 0.076, 0.0785, 0.081, 0.082, 0.086, 0.089, 0.0935, 0.096,
  0.098, 0.0995, 0.1015, 0.104, 0.1065, 0.11, 0.111, 0.113, 0.116, 0.12, 0.1285, 0.136, 0.1405,
  0.144, 0.147, 0.1495, 0.152, 0.154, 0.157, 0.159, 0.161, 0.166, 0.1695, 0.173, 0.177, 0.18, 0.182,
  0.185, 0.189, 0.191, 0.1935, 0.196, 0.199, 0.201, 0.204, 0.2055, 0.209, 0.213, 0.221, 0.228,
]

const NUMBER_DRILL_SIZES = NUMBER_DRILL_INCHES.map((nominalInches, index) => ({
  label: `#${80 - index}`,
  nominalInches,
  nominalMillimeters: nominalInches * MILLIMETERS_PER_INCH,
}))

const LETTER_DRILL_INCHES = [
  0.234, 0.238, 0.242, 0.246, 0.25, 0.257, 0.261, 0.266, 0.272, 0.277, 0.281, 0.29, 0.295, 0.302,
  0.316, 0.323, 0.332, 0.339, 0.348, 0.358, 0.368, 0.377, 0.386, 0.397, 0.404, 0.413,
]

const LETTER_DRILL_SIZES = LETTER_DRILL_INCHES.map((nominalInches, index) => ({
  label: String.fromCharCode("A".charCodeAt(0) + index),
  nominalInches,
  nominalMillimeters: nominalInches * MILLIMETERS_PER_INCH,
}))

const METRIC_DRILL_SIZES = Array.from({ length: 130 }, (_, index) => {
  const nominalMillimeters = Number(((index + 1) / 10).toFixed(1))
  return {
    label: `${nominalMillimeters.toFixed(1)} mm`,
    nominalInches: nominalMillimeters / MILLIMETERS_PER_INCH,
    nominalMillimeters,
  }
})

const REFERENCE_SETS: ReadonlyArray<{
  system: DrillSizeSystem
  sizes: ReadonlyArray<NominalDrillSize>
}> = [
  { system: "fractional-inch", sizes: FRACTIONAL_INCH_SIZES },
  { system: "number", sizes: NUMBER_DRILL_SIZES },
  { system: "letter", sizes: LETTER_DRILL_SIZES },
  { system: "metric", sizes: METRIC_DRILL_SIZES },
]

const REFERENCE_METADATA: DrillReferenceMetadata = {
  id: "drill-reference-set",
  version: "2026.08.1",
  verifiedOn: "2026-08-12",
  exactConversion: {
    inches: 1,
    millimeters: 25.4,
  },
  systems: [
    {
      system: "fractional-inch",
      count: FRACTIONAL_INCH_SIZES.length,
      scope: "1/64 inch through 1 inch in 1/64-inch increments",
    },
    {
      system: "number",
      count: NUMBER_DRILL_SIZES.length,
      scope: "Number drills #80 through #1",
    },
    {
      system: "letter",
      count: LETTER_DRILL_SIZES.length,
      scope: "Letter drills A through Z",
    },
    {
      system: "metric",
      count: METRIC_DRILL_SIZES.length,
      scope: "DecimalTools v1 comparison series from 0.1 mm through 13.0 mm in 0.1 mm increments",
    },
  ],
  sources: [
    {
      authority: "NIST",
      reference: "SI Units – Length",
      url: "https://www.nist.gov/pml/owm/si-units-length",
      role: "conversion-definition",
      access: "public",
    },
    {
      authority: "ASME",
      reference: "ASME B94.11M-1993",
      url: "https://www.asme.org/codes-standards/find-codes-standards/b94-11m-twist-drills",
      role: "standards-scope",
      access: "public-abstract-paid-full-text",
    },
    {
      authority: "ISO",
      reference: "ISO 235:2016",
      url: "https://www.iso.org/standard/64191.html",
      role: "standards-scope",
      access: "public-abstract-paid-full-text",
    },
    {
      authority: "Kennametal / MSC Industrial Supply",
      reference: "Decimal Equivalency Chart H-001-033",
      url: "https://www1.mscdirect.com/images/solutions/kennametal/decimal_eq_chart.pdf",
      role: "cross-check",
      access: "public",
    },
    {
      authority: "ICS Cutting Tools",
      reference: "Drill Size Conversion Chart",
      url: "https://www.icscuttingtools.com/pdfs/ICS-drill-chart.pdf",
      role: "cross-check",
      access: "public",
    },
  ],
  certifiedByStandardsBody: false,
  limitations: [
    "Nominal reference values are for comparison, not a tooling recommendation.",
    "The dataset is not certified or endorsed by ASME, ISO, NIST, or a manufacturer.",
    "The metric comparison series is an explicitly bounded DecimalTools v1 range, not a claim that every diameter belongs to one product standard.",
    "Published tolerances are outside this dataset; only a user-entered tolerance may be evaluated.",
  ],
}

function normalizeMeasurement(value: number, unit: MeasurementUnit) {
  return unit === "inch"
    ? { inches: value, millimeters: value * MILLIMETERS_PER_INCH }
    : { inches: value / MILLIMETERS_PER_INCH, millimeters: value }
}

export function getDrillReferenceMetadata(): DrillReferenceMetadata {
  return REFERENCE_METADATA
}

function toCandidate(
  size: NominalDrillSize,
  inputInches: number,
  inputMillimeters: number,
  toleranceInches?: number
): DrillCandidate {
  const deviationInches = size.nominalInches - inputInches
  const deviationMillimeters = size.nominalMillimeters - inputMillimeters

  return {
    ...size,
    deviationInches,
    absoluteDeviationInches: Math.abs(deviationInches),
    deviationMillimeters,
    absoluteDeviationMillimeters: Math.abs(deviationMillimeters),
    ...(toleranceInches === undefined
      ? {}
      : { withinTolerance: Math.abs(deviationInches) <= toleranceInches }),
  }
}

export function matchDrillSize(input: DrillMatchInput): DrillMatchResult {
  if (!Number.isFinite(input.value) || input.value <= 0) {
    return {
      ok: false,
      code: "invalid_measurement",
      error: "Measurement must be a finite number greater than zero.",
    }
  }

  if (input.tolerance && (!Number.isFinite(input.tolerance.value) || input.tolerance.value < 0)) {
    return {
      ok: false,
      code: "invalid_tolerance",
      error: "Tolerance must be a finite number greater than or equal to zero.",
    }
  }

  const normalizedInput = normalizeMeasurement(input.value, input.unit)
  const inputInches = normalizedInput.inches
  const toleranceInches = input.tolerance
    ? normalizeMeasurement(input.tolerance.value, input.tolerance.unit).inches
    : undefined

  return {
    ok: true,
    input: {
      value: input.value,
      unit: input.unit,
      inches: inputInches,
      millimeters: normalizedInput.millimeters,
    },
    matches: REFERENCE_SETS.map(({ system, sizes }) => {
      const minimumDeviation = Math.min(
        ...sizes.map((size) => Math.abs(size.nominalInches - inputInches))
      )
      const nearest = sizes
        .filter(
          (size) =>
            Math.abs(Math.abs(size.nominalInches - inputInches) - minimumDeviation) <=
            TIE_EPSILON_INCHES
        )
        .map((size) => toCandidate(size, inputInches, normalizedInput.millimeters, toleranceInches))
      const lowerSize = sizes.findLast(
        (size) => size.nominalInches < inputInches - TIE_EPSILON_INCHES
      )
      const upperSize = sizes.find((size) => size.nominalInches > inputInches + TIE_EPSILON_INCHES)

      return {
        system,
        nearest,
        lower: lowerSize
          ? toCandidate(lowerSize, inputInches, normalizedInput.millimeters, toleranceInches)
          : null,
        upper: upperSize
          ? toCandidate(upperSize, inputInches, normalizedInput.millimeters, toleranceInches)
          : null,
      }
    }),
  }
}
