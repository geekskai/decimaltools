import assert from "node:assert/strict"
import test from "node:test"
import { createRequire } from "node:module"
import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import ts from "typescript"

const require = createRequire(import.meta.url)
// Compile the real module and its relative imports in an isolated, portable directory.
async function loadFractionPageModel() {
  const sourceDirectory = new URL("../../lib/fraction-math/", import.meta.url)
  const compiledDirectory = await mkdtemp(join(tmpdir(), "decimaltools-fraction-model-"))
  try {
    const sourceFiles = await readdir(sourceDirectory)
    for (const sourceFile of sourceFiles.filter((fileName) => fileName.endsWith(".ts"))) {
      const source = await readFile(new URL(sourceFile, sourceDirectory), "utf8")
      const compiled = ts.transpileModule(source, {
        compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS },
      })
      await writeFile(join(compiledDirectory, sourceFile.replace(/\.ts$/, ".js")), compiled.outputText)
    }
    return require(join(compiledDirectory, "page-model.js"))
  } finally {
    await rm(compiledDirectory, { recursive: true, force: true })
  }
}

const { getFractionPageModel } = await loadFractionPageModel()

test("fraction page model explains terminating and repeating decimals", () => {
  const threeEighths = getFractionPageModel(3, 8)
  assert.equal(threeEighths.core.formattedDecimal, "0.375")
  assert.equal(threeEighths.exactDecimalPlaces, 3)
  assert.equal(threeEighths.longDivision.map(({ digit }) => digit).join(""), "375")

  const oneThird = getFractionPageModel(1, 3)
  assert.equal(oneThird.core.formattedDecimal, "0.333333333333")
  assert.equal(oneThird.repeatingStart, 0)

  const fiveSixths = getFractionPageModel(5, 6)
  assert.equal(fiveSixths.repeatingStart, 1)
  assert.equal(fiveSixths.longDivision.map(({ digit }) => digit).join(""), "83")

  const fourThirds = getFractionPageModel(4, 3)
  assert.equal(fourThirds.wholePart, 1)
  assert.equal(fourThirds.remainderNumerator, 1)
  assert.equal(fourThirds.repeatingStart, 0)
})

test("fraction page model computes exact finite results", () => {
  assert.equal(getFractionPageModel(1, 16).core.formattedDecimal, "0.0625")
  assert.equal(getFractionPageModel(31, 32).core.formattedDecimal, "0.96875")
})
