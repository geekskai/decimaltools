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

test("all ten pilots have distinct explanations and valid related pages; revision scope is 66", () => {
  const slugs = ["3-11", "3-14", "2-5", "5-12", "5-16", "11-8", "7-8", "2-3", "1-8", "3-8"]
  assert.deepEqual(Object.keys(content.fractionPageContent).sort(), slugs.sort())
  const headings = new Set()
  for (const [slug, explanation] of Object.entries(content.fractionPageContent)) {
    headings.add(explanation.heading)
    assert.ok(explanation.verification.length > 20, slug)
    assert.ok(explanation.rounding.length > 20, slug)
    for (const [numerator, denominator] of explanation.related) {
      assert.equal(fractions.isPseoWhitelisted(numerator, denominator), true)
    }
  }
  assert.equal(headings.size, 10)
  const revised = fractions.pseoFractionPairs.filter(
    (pair) => content.getFractionContentRevision(pair).version === "1.2"
  )
  assert.equal(revised.length, 66)
  assert.deepEqual(content.getFractionContentRevision({ numerator: 19, denominator: 32 }), {
    lastModified: fractions.PSEO_DETAIL_LAST_MODIFIED_DATE,
    version: fractions.PSEO_CONTENT_VERSION,
  })
  assert.equal(fractions.PSEO_LAST_MODIFIED_DATE, "2026-10-07")
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
