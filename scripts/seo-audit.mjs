import { mkdir, writeFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import siteMetadata from "../data/siteMetadata.js"
import { auditSite, toCsv } from "./seo-audit-lib.mjs"

const options = {
  site: siteMetadata.siteUrl,
  canonicalOrigin: siteMetadata.siteUrl,
  output: "reports/seo/audit.csv",
  sitemap: "/sitemap.xml",
}
const optionNames = {
  "--site": "site",
  "--canonical-origin": "canonicalOrigin",
  "--output": "output",
  "--sitemap": "sitemap",
}
const argumentsList = process.argv.slice(2)
for (let index = 0; index < argumentsList.length; index += 2) {
  const key = optionNames[argumentsList[index]]
  const value = argumentsList[index + 1]
  if (!key || !value) {
    throw new Error(
      "Usage: seo:audit [--site URL] [--canonical-origin URL] [--sitemap PATH] [--output CSV]"
    )
  }
  options[key] = value
}

try {
  const result = await auditSite(options)
  const output = resolve(options.output)
  await mkdir(dirname(output), { recursive: true })
  await writeFile(output, toCsv(result.rows))
  await writeFile(output.replace(/\.csv$/, "") + ".json", JSON.stringify(result, null, 2) + "\n")
  console.log(JSON.stringify(result.summary, null, 2))
  console.log(`Report: ${output}`)
  const hasFailures =
    result.summary.failed || result.summary.duplicateUrls || result.summary.duplicateTitles.length
  if (hasFailures) {
    process.exitCode = 1
  } else if (result.summary.blocked) {
    process.exitCode = 2
  }
} catch (error) {
  console.error("SEO audit BLOCKED:", error)
  process.exitCode = 2
}
