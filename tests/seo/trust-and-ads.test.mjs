import assert from "node:assert/strict"
import { readdir, readFile } from "node:fs/promises"
import path from "node:path"
import test from "node:test"

const projectRoot = process.cwd()

async function readSourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name)
      if (entry.isDirectory()) return readSourceFiles(entryPath)
      if (!/\.(?:ts|tsx)$/.test(entry.name)) return []
      return [[entryPath, await readFile(entryPath, "utf8")]]
    })
  )
  return files.flat()
}

test("source does not publish unverified audience or rating claims", async () => {
  const sourceFiles = await readSourceFiles(path.join(projectRoot, "app"))
  const combinedSource = sourceFiles.map(([file, source]) => `${file}\n${source}`).join("\n")

  assert.doesNotMatch(combinedSource, /aggregateRating|ratingValue|ratingCount/)
  assert.doesNotMatch(combinedSource, /25K\+|25,000\+|numberOfItems:\s*["']50\+["']/)
})

test("sitewide schema contains only organization and website entities", async () => {
  const layout = await readFile(path.join(projectRoot, "app/[locale]/layout.tsx"), "utf8")

  assert.match(layout, /"@type": "Organization"/)
  assert.match(layout, /"@type": "WebSite"/)
  assert.doesNotMatch(layout, /"@type": "WebPage"|"@type": "ItemList"/)
})

test("AdSense remains disabled until explicitly enabled after approval", async () => {
  const adsFile = await readFile(path.join(projectRoot, "public/ads.txt"), "utf8")
  const adComponent = await readFile(
    path.join(projectRoot, "components/GoogleAdUnitWrap.tsx"),
    "utf8"
  )

  assert.equal(adsFile.trim(), "google.com, pub-2108246014001009, DIRECT, f08c47fec0942fa0")
  assert.match(adComponent, /NEXT_PUBLIC_ADSENSE_ENABLED === "true"/)
})
