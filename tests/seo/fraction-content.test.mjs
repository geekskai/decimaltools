import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import { existsSync } from "node:fs"
import path from "node:path"
import test from "node:test"
import ts from "typescript"

const root = path.resolve(import.meta.dirname, "../..")
const compiledModules = new Map()

// Compile this small, pure dependency graph without relying on a prebuilt fixture or app server.
async function moduleUrl(sourcePath) {
  if (compiledModules.has(sourcePath)) {
    return compiledModules.get(sourcePath)
  }
  const source = await readFile(sourcePath, "utf8")
  const compiled = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ES2020 },
  })
  let output = compiled.outputText
  const imports = [...output.matchAll(/from "([^"]+)"/g)]
  for (const dependency of imports) {
    const dependencyBase = dependency[1].startsWith("@/")
      ? path.join(root, dependency[1].slice(2))
      : path.resolve(path.dirname(sourcePath), dependency[1])
    const dependencyPath = existsSync(`${dependencyBase}.ts`)
      ? `${dependencyBase}.ts`
      : path.join(dependencyBase, "index.ts")
    const dependencyUrl = await moduleUrl(dependencyPath)
    output = output.replace(dependency[0], `from "${dependencyUrl}"`)
  }
  const url = `data:text/javascript;base64,${Buffer.from(output).toString("base64")}`
  compiledModules.set(sourcePath, url)
  return url
}

const content = await import(await moduleUrl(path.join(root, "data/fraction-page-content.ts")))
const fractions = await import(await moduleUrl(path.join(root, "data/pseo-fractions.ts")))
const { getFractionPageModel } = await import(
  await moduleUrl(path.join(root, "lib/fraction-math/page-model.ts"))
)
const { getRulerWindow } = await import(
  await moduleUrl(path.join(root, "app/[locale]/tools/convert-inches-to-decimal/utils/ruler.ts"))
)

const originalEditorialSlugs = [
  "3-11",
  "3-14",
  "2-5",
  "5-12",
  "5-16",
  "11-8",
  "7-8",
  "2-3",
  "1-8",
  "3-8",
]

const novemberEditorialSlugs = [
  "5-13",
  "1-13",
  "11-13",
  "15-32",
  "10-13",
  "7-13",
  "14-15",
  "6-7",
  "1-32",
  "23-32",
  "2-13",
  "7-32",
  "13-14",
  "12-13",
  "2-15",
  "11-14",
  "2-7",
  "25-32",
  "5-32",
  "9-14",
  "13-32",
  "3-7",
  "5-4",
  "5-9",
  "4-9",
  "13-16",
  "1-14",
]

test("every recurring answer is an exact rational, with rounded display explicitly qualified", () => {
  let repeatingCount = 0
  for (const pair of fractions.pseoFractionPairs) {
    const model = getFractionPageModel(pair.numerator, pair.denominator)
    let previousRemainder = model.remainderNumerator
    for (const step of model.longDivision) {
      assert.equal(previousRemainder * 10, step.digit * pair.denominator + step.remainder)
      previousRemainder = step.remainder
    }
    const answer = content.getFractionAnswer(model)
    if (model.repeatingStart === null) {
      assert.equal(previousRemainder, 0)
      assert.match(answer, /exactly/)
      assert.ok(!answer.includes("≈"))
      continue
    }
    repeatingCount++
    const exact = answer.match(/= (\d+)\.(\d*)\((\d+)\)/)
    assert.ok(exact, pair.denominator)
    const [, whole, prefix, cycle] = exact
    const prefixScale = 10n ** BigInt(prefix.length)
    const cycleScale = 10n ** BigInt(cycle.length) - 1n
    const denominator = prefixScale * cycleScale
    const numerator =
      BigInt(whole) * denominator + BigInt(prefix || "0") * cycleScale + BigInt(cycle)
    assert.equal(numerator * BigInt(pair.denominator), denominator * BigInt(pair.numerator))
    assert.match(answer, /Rounded to 12 decimal places/)
    assert.ok(answer.includes("≈"))
  }
  assert.equal(repeatingCount, 60)
})

test("editorial landings have distinct explanations and valid related pages", () => {
  const slugs = originalEditorialSlugs
  assert.deepEqual(
    Object.keys(content.fractionPageContent).sort(),
    [...slugs, ...novemberEditorialSlugs].sort()
  )
  const headings = new Set()
  for (const [slug, explanation] of Object.entries(content.fractionPageContent)) {
    headings.add(explanation.heading)
    assert.ok(explanation.verification.length > 20, slug)
    assert.ok(explanation.rounding.length > 20, slug)
    for (const [numerator, denominator] of explanation.related) {
      assert.equal(fractions.isPseoWhitelisted(numerator, denominator), true)
    }
  }
  assert.equal(headings.size, 37)
  const revised = fractions.pseoFractionPairs.filter(
    (pair) => content.getFractionContentRevision(pair).version === "1.2"
  )
  assert.equal(revised.length, 48)
  assert.deepEqual(content.getFractionContentRevision({ numerator: 19, denominator: 32 }), {
    lastModified: fractions.PSEO_DETAIL_LAST_MODIFIED_DATE,
    version: fractions.PSEO_CONTENT_VERSION,
  })
  assert.equal(fractions.PSEO_LAST_MODIFIED_DATE, "2026-11-17")
  assert.equal(fractions.pseoFractionPairs.length, 110)
})

test("recurring notation distinguishes prefixes from cycles and keeps improper whole parts", () => {
  for (const [numerator, denominator, exact] of [
    [3, 11, "0.(27)"],
    [3, 14, "0.2(142857)"],
    [5, 12, "0.41(6)"],
    [2, 3, "0.(6)"],
    [4, 3, "1.(3)"],
  ]) {
    assert.ok(
      content.getFractionAnswer(getFractionPageModel(numerator, denominator)).includes(exact)
    )
  }
})

test("desktop and compact ruler windows contain the input without increasing the tick span", () => {
  for (const span of [3, 6]) {
    for (const value of [0, 0.5, 3, 5.75, 6, 7.25, 1000000]) {
      const ruler = getRulerWindow({ value, span })
      assert.equal(ruler.end - ruler.start, span)
      assert.ok(ruler.start <= value && value <= ruler.end)
      assert.equal(ruler.start + ruler.offset, value)
    }
  }
  assert.deepEqual(getRulerWindow({ value: 5.75, span: 3 }), { start: 4, end: 7, offset: 1.75 })
  assert.deepEqual(getRulerWindow({ value: 7.25, span: 6 }), { start: 4, end: 10, offset: 3.25 })
  assert.deepEqual(getRulerWindow({ span: 3 }), { start: 0, end: 3, offset: null })
})

function assertExactVerification({ numerator, denominator, verification }) {
  const recurring = verification.match(/(\d+)\.(\d*)\((\d+)\)/)
  if (recurring) {
    const [, whole, prefix, cycle] = recurring
    const prefixScale = 10n ** BigInt(prefix.length)
    const cycleScale = 10n ** BigInt(cycle.length) - 1n
    const rationalDenominator = prefixScale * cycleScale
    const rationalNumerator =
      BigInt(whole) * rationalDenominator + BigInt(prefix || "0") * cycleScale + BigInt(cycle)
    assert.equal(
      rationalNumerator * BigInt(denominator),
      rationalDenominator * BigInt(numerator),
      verification
    )
    for (const [, top, bottom] of verification.matchAll(/(\d+)\/(\d+)/g)) {
      assert.equal(
        BigInt(top) * BigInt(denominator),
        BigInt(bottom) * BigInt(numerator),
        verification
      )
    }
    return
  }
  const multiplication = verification.match(/(\d+)\.(\d+) × (\d+) = (\d+)/)
  assert.ok(multiplication, verification)
  const [, whole, decimalDigits, multiplier, product] = multiplication
  assert.equal(Number(multiplier), denominator)
  assert.equal(Number(product), numerator)
  assert.equal(
    BigInt(whole + decimalDigits) * BigInt(multiplier),
    BigInt(product) * 10n ** BigInt(decimalDigits.length),
    verification
  )
}

function assertRoundedExamples({ numerator, denominator, rounding }) {
  const claims = [...rounding.matchAll(/(\d+)\/(\d+) (≈|=) (\d+)\.(\d+)/g)]
  assert.ok(claims.length >= 2, rounding)
  for (const [, top, bottom, relation, whole, decimalDigits] of claims) {
    assert.equal(Number(top), numerator)
    assert.equal(Number(bottom), denominator)
    const scale = 10n ** BigInt(decimalDigits.length)
    const displayed = BigInt(whole + decimalDigits)
    if (relation === "=") {
      assert.equal(displayed * BigInt(denominator), BigInt(numerator) * scale, rounding)
      continue
    }
    // All examples are positive; an exact halfway case rounds upward.
    const rounded =
      (2n * BigInt(numerator) * scale + BigInt(denominator)) / (2n * BigInt(denominator))
    assert.equal(displayed, rounded, rounding)
  }
}

test("all 27 GSC editorial targets have checked verification, rounding, and a scoped revision", () => {
  const updatedSlugs = []
  for (const pair of fractions.pseoFractionPairs) {
    const slug = `${pair.numerator}-${pair.denominator}`
    const revision = content.getFractionContentRevision(pair)
    if (!novemberEditorialSlugs.includes(slug)) {
      const model = getFractionPageModel(pair.numerator, pair.denominator)
      const hasEarlierRevision =
        originalEditorialSlugs.includes(slug) || model.repeatingStart !== null
      const expectedRevision = hasEarlierRevision
        ? { lastModified: "2026-11-13T10:27:26Z", version: "1.2" }
        : { lastModified: "2026-11-13", version: "1.1" }
      assert.deepEqual(revision, expectedRevision, slug)
      continue
    }
    updatedSlugs.push(slug)
    const editorial = content.fractionPageContent[slug]
    assert.ok(editorial, slug)
    assert.ok(editorial.seoDescription.includes(`${pair.numerator}/${pair.denominator}`), slug)
    assert.ok(editorial.seoDescription.length <= 170, slug)
    assertExactVerification({ ...pair, verification: editorial.verification })
    assertRoundedExamples({ ...pair, rounding: editorial.rounding })
    assert.deepEqual(revision, { lastModified: "2026-11-17", version: "1.3" })
  }
  assert.deepEqual(updatedSlugs.sort(), [...novemberEditorialSlugs].sort())
})
