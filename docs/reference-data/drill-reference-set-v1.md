# Drill Reference Set v1 Source Registry

**Dataset ID:** `drill-reference-set`

**Dataset version:** `2026.08.1`

**Verified:** August 12, 2026

**Release status:** Implementation baseline; public manufacturer references cross-checked line by line, standards-body full-text and professional review not yet performed

## Purpose

This registry records where DecimalTools obtained and checked the nominal drill-size facts used by Drill Size Matcher. It separates authoritative scope references from the public charts used to cross-check individual nominal values.

The dataset is a comparison reference. It is not a tooling recommendation, a tolerance table, a substitute-selection system, or a certified reproduction of a standards publication.

## Published scope

| System                   |                   v1 range | Entries | Construction                                                                  |
| ------------------------ | -------------------------: | ------: | ----------------------------------------------------------------------------- |
| Fractional-inch          |   `1/64 in` through `1 in` |      64 | Exact increments of `1/64 in`, labels reduced for display                     |
| Number                   |         `#80` through `#1` |      80 | Explicit nominal inch values cross-checked against public manufacturer charts |
| Letter                   |            `A` through `Z` |      26 | Explicit nominal inch values cross-checked against public manufacturer charts |
| Metric Comparison Series | `0.1 mm` through `13.0 mm` |     130 | DecimalTools v1 comparison range in `0.1 mm` increments                       |

The Metric Comparison Series is a deliberately bounded product range. Its inclusion does not claim that every value is specified by one standard, available from every manufacturer, or suitable for a particular drilling operation.

## Source registry

### NIST — exact unit relationship

- **Reference:** [SI Units – Length](https://www.nist.gov/pml/owm/si-units-length)
- **Access:** Public.
- **Authority role:** Defines the inch–millimeter conversion used by the matcher.
- **Fact used:** `1 inch = 25.4 millimeters` exactly.
- **Implementation rule:** Store or construct nominal source values in their native unit and calculate the equivalent unit using the exact relationship. Display rounding must not change matching values.

### ASME — twist-drill standards scope

- **Reference:** [ASME B94.11M-1993 — Twist Drills](https://www.asme.org/codes-standards/find-codes-standards/b94-11m-twist-drills)
- **Access:** Public description; full standard is paid.
- **Authority role:** Confirms that the standard covers twist-drill nomenclature, definitions, sizes, and tolerances in inch and metric sizes.
- **Use in v1:** Scope and terminology only. DecimalTools has not represented the dataset as a complete reproduction of ASME tables and has not claimed ASME certification.
- **Open verification:** Compare the implemented nominal series against a lawfully accessed copy before changing the release status to standards-verified.

### ISO — drill dimension standards scope

- **Reference:** [ISO 235:2016 — Parallel shank jobber and stub series drills and Morse taper shank drills](https://www.iso.org/standard/64191.html)
- **Access:** Public abstract; full standard is paid.
- **Authority role:** Confirms current published scope for metric and inch drill dimensions and diameter steps.
- **Use in v1:** Scope and terminology only. It is not the source for claiming that the Metric Comparison Series is an ISO series.

### Kennametal / MSC Industrial Supply — public value cross-check

- **Reference:** [Decimal Equivalency Chart H-001-033](https://www1.mscdirect.com/images/solutions/kennametal/decimal_eq_chart.pdf)
- **Access:** Public manufacturer/distributor PDF.
- **Role:** Cross-check fractional, number, letter, and metric nominal equivalents.
- **Boundary:** A public chart is supporting evidence, not a standards-body certification.

### ICS Cutting Tools — public value cross-check

- **Reference:** [Drill Size Conversion Chart](https://www.icscuttingtools.com/pdfs/ICS-drill-chart.pdf)
- **Access:** Public manufacturer PDF.
- **Role:** Independent cross-check of fractional, number, letter, and metric nominal equivalents.
- **Boundary:** A public chart is supporting evidence, not a standards-body certification.

## Data rules

1. Nominal values are reference facts; proprietary prose, table layout, and commentary are not copied.
2. Fractional sizes are generated from exact rational increments rather than transcribed rounded decimals.
3. Number and letter values are stored as explicit nominal-inch values.
4. Metric values are constructed in millimeters and converted to inches using the NIST exact relationship.
5. **Signed Deviation** is `nominal size − measured value`.
6. Equal-distance results are all retained; the matcher must not silently select one.
7. **Adjacent Nominal Size** means the closest size strictly below or above the measurement within one system.
8. Published drill-manufacturing tolerances are not part of this dataset.
9. `withinTolerance` exists only when a user supplies a non-negative tolerance.
10. Dataset changes require a new version, a reviewed diff, updated golden cases, and an updated verification date.

## Known discrepancies and controls

Public drill charts sometimes appear to differ because of typographical errors, OCR errors, rounding, product scope, or revision. During this review, a search-result extraction rendered `#66` as `0.0333 in`; direct inspection of both registered manufacturer PDFs showed `#66 = 0.0330 in`. The implementation uses `0.0330 in`, and the discrepancy is recorded as extraction noise rather than averaged or silently ignored.

On August 12, 2026, all 80 Number values and all 26 Letter values in the implementation were checked line by line against both registered manufacturer PDFs. No disagreement remained between the implementation and the source PDFs.

Controls:

- Do not treat one OCR extraction as source truth.
- Require agreement across at least two independent public references for explicit number and letter values.
- Escalate any disagreement rather than averaging values.
- Test endpoint, interior, tie, conversion, invalid-input, and tolerance behavior through the public module interface.
- Publish corrections and increment the dataset version when a released nominal value changes.

## Calculation contract

The public module interface is:

```ts
matchDrillSize({
  value: number,
  unit: "inch" | "mm",
  tolerance?: {
    value: number,
    unit: "inch" | "mm"
  }
}): DrillMatchResult

getDrillReferenceMetadata(): DrillReferenceMetadata
```

Contract behavior:

- Reject non-finite, zero, or negative measurements.
- Reject non-finite or negative tolerances; zero tolerance is valid.
- Return one system result for each of fractional-inch, number, letter, and metric.
- Preserve all equal-distance nearest sizes within the calculation tie epsilon.
- Return nominal inch and millimeter values, Signed Deviation, absolute deviation, and Adjacent Nominal Sizes.
- Return a tolerance result only when the caller supplied a tolerance.
- Never return a suitability or substitute recommendation.

## Release checklist

- [x] NIST exact conversion source recorded.
- [x] ASME and ISO scope references recorded with access limitations.
- [x] Two public manufacturer charts recorded for cross-checking.
- [x] Four v1 system ranges and counts recorded.
- [x] Calculation seam and error behavior tested.
- [x] Equal-distance behavior tested.
- [x] User-entered tolerance boundary tested.
- [x] Full explicit number and letter lists independently reviewed line by line against both registered manufacturer PDFs.
- [ ] Lawfully accessed standards text or qualified professional review recorded.
- [ ] Public source/method page reviewed for publication wording.

Until the last two items are complete, the dataset may be used as an implementation baseline but must not be described as standards-verified or professionally reviewed.
