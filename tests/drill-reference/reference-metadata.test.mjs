import assert from "node:assert/strict"
import test from "node:test"

import { getDrillReferenceMetadata } from "../../lib/drill-reference/index.ts"

test("publishes versioned source and scope metadata without claiming certification", () => {
  const metadata = getDrillReferenceMetadata()

  assert.equal(metadata.id, "drill-reference-set")
  assert.equal(metadata.version, "2026.08.1")
  assert.equal(metadata.verifiedOn, "2026-08-12")
  assert.deepEqual(metadata.exactConversion, {
    inches: 1,
    millimeters: 25.4,
  })
  assert.deepEqual(
    metadata.systems.map(({ system, count }) => [system, count]),
    [
      ["fractional-inch", 64],
      ["number", 80],
      ["letter", 26],
      ["metric", 130],
    ]
  )
  assert.ok(metadata.sources.some((source) => source.authority === "NIST"))
  assert.ok(metadata.sources.some((source) => source.reference === "ASME B94.11M-1993"))
  assert.equal(metadata.certifiedByStandardsBody, false)
})
