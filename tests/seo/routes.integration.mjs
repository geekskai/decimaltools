import assert from "node:assert/strict"
import test from "node:test"
import { load } from "cheerio"

// Run against a production build: SEO_TEST_SITE=http://localhost:3011 node --test tests/seo/routes.integration.mjs
const site = process.env.SEO_TEST_SITE
if (!site) {
  throw new Error("Set SEO_TEST_SITE to the running site before executing route integration tests")
}

test("first blog page permanently redirects and invalid pagination returns 404", async () => {
  const firstPage = await fetch(new URL("/blog/page/1", site), { redirect: "manual" })
  assert.equal(firstPage.status, 308)
  assert.equal(new URL(firstPage.headers.get("location"), site).pathname, "/blog")
  await firstPage.body?.cancel()
  for (const page of ["0", "1oops", "999999999"]) {
    const response = await fetch(new URL(`/blog/page/${page}`, site), { redirect: "manual" })
    assert.equal(response.status, 404, page)
    await response.body?.cancel()
  }
})

test("cold fraction aliases have one canonical redirect and excluded fractions return 404", async () => {
  const numerator = (Date.now() % 100000) + 1000
  const alias = `/tools/as-a-decimal/${numerator}-${numerator * 2}`
  const response = await fetch(new URL(alias, site), { redirect: "manual" })
  assert.equal(response.status, 308)
  assert.equal(new URL(response.headers.get("location"), site).pathname, "/tools/as-a-decimal/1-2")
  await response.body?.cancel()
  for (const slug of ["0-2", "999-1000", "invalid"]) {
    const excluded = await fetch(new URL(`/tools/as-a-decimal/${slug}`, site))
    assert.equal(excluded.status, 404, slug)
    await excluded.body?.cancel()
  }
})
test("legacy undefined-locale inches URL redirects to the canonical tool", async () => {
  const legacyUrl = new URL("/undefined/tools/convert-inches-to-decimal?input=3%2F8", site)
  const legacyResponse = await fetch(legacyUrl, { redirect: "manual" })
  assert.equal(legacyResponse.status, 308)
  const destination = new URL(legacyResponse.headers.get("location"), site)
  assert.equal(destination.pathname, "/tools/convert-inches-to-decimal")
  assert.equal(destination.searchParams.get("input"), "3/8")
  await legacyResponse.body?.cancel()

  const toolResponse = await fetch(destination, { redirect: "manual" })
  assert.equal(toolResponse.status, 200)
  const toolHtml = await toolResponse.text()
  assert.match(
    toolHtml,
    /<link rel="canonical" href="https:\/\/decimaltools\.com\/tools\/convert-inches-to-decimal"/
  )
  assert.doesNotMatch(toolHtml, /\/undefined\//)
})

test("unknown undefined-locale routes still return 404", async () => {
  const unknownResponse = await fetch(new URL("/undefined/tools/not-a-tool", site), {
    redirect: "manual",
  })
  assert.equal(unknownResponse.status, 404)
  await unknownResponse.body?.cancel()
})

// Check rendered HTML rather than the whitelist alone: links must work without JavaScript.
async function getFractionSitemapPaths() {
  const sitemapResponse = await fetch(new URL("/sitemap.xml", site))
  assert.equal(sitemapResponse.status, 200)
  const sitemapXml = await sitemapResponse.text()
  const sitemap = load(sitemapXml, { xml: true })
  return sitemap("url > loc")
    .toArray()
    .map((entry) => new URL(sitemap(entry).text()).pathname)
    .filter((pathname) => /^\/tools\/as-a-decimal\/\d+-\d+$/.test(pathname))
    .sort()
}

test("fraction directory links to every sitemap fraction and its structured list matches", async () => {
  const expectedPaths = await getFractionSitemapPaths()
  assert.equal(expectedPaths.length, 110)
  const directoryResponse = await fetch(new URL("/tools/as-a-decimal", site))
  assert.equal(directoryResponse.status, 200)
  const directoryHtml = await directoryResponse.text()
  const directory = load(directoryHtml)
  const visiblePaths = directory("#fraction-directory a[href]")
    .toArray()
    .map((anchor) => new URL(directory(anchor).attr("href"), site).pathname)
    .filter((pathname) => /^\/tools\/as-a-decimal\/\d+-\d+$/.test(pathname))
    .sort()
  assert.deepEqual(visiblePaths, expectedPaths)
  const directoryParagraphs = directory("main p")
    .toArray()
    .map((paragraph) => directory(paragraph).text())
    .join("\n")
  assert.match(directoryParagraphs, new RegExp(`\\b${expectedPaths.length} worked conversions\\b`))
  assert.doesNotMatch(directoryParagraphs, /\{count\}/)
  const schemas = directory('script[type="application/ld+json"]')
    .toArray()
    .map((script) => JSON.parse(directory(script).text()))
  const structuredList = schemas.find((schema) => schema["@type"] === "ItemList")
  assert.ok(structuredList)
  const structuredPaths = structuredList.itemListElement
    .map((entry) => new URL(entry.url).pathname)
    .sort()
  assert.deepEqual(structuredPaths, expectedPaths)
  for (const pathname of expectedPaths) {
    const denominator = pathname.split("-").at(-1)
    assert.equal(directory(`#denominator-${denominator}`).length, 1, pathname)
  }
})

test("every fraction has a canonical answer page and visible links back to its directory group", async () => {
  const expectedPaths = await getFractionSitemapPaths()
  for (const pathname of expectedPaths) {
    const pageResponse = await fetch(new URL(pathname, site), { redirect: "manual" })
    assert.equal(pageResponse.status, 200, pathname)
    const pageHtml = await pageResponse.text()
    const page = load(pageHtml)
    const denominator = pathname.split("-").at(-1)
    assert.equal(new URL(page('link[rel="canonical"]').attr("href")).pathname, pathname)
    assert.equal(page('meta[name="robots"]').attr("content"), "index, follow", pathname)
    assert.equal(page("h1").length, 1, pathname)
    assert.equal(
      page('nav[aria-label="Breadcrumb"] a[href="/tools/as-a-decimal"]').length,
      1,
      pathname
    )
    assert.equal(
      page(`main a[href="/tools/as-a-decimal#denominator-${denominator}"]`).length,
      1,
      pathname
    )
    assert.ok(page("main").text().includes(pathname.split("/").at(-1).replace("-", "/")), pathname)
  }
})

test("fraction family description counts its visible quick links without placeholders", async () => {
  const conversionResponse = await fetch(new URL("/tools/fraction-to-decimal", site))
  assert.equal(conversionResponse.status, 200)
  const conversionHtml = await conversionResponse.text()
  const conversionPage = load(conversionHtml)
  const familyHeading = conversionPage("h2").filter(
    (_, heading) => conversionPage(heading).text().trim() === "Browse fractions by denominator"
  )
  assert.equal(familyHeading.length, 1)
  const familySection = familyHeading.parent()
  const quickLinkPaths = familySection.find("a[href]")
    .toArray()
    .map((anchor) => new URL(conversionPage(anchor).attr("href"), site).pathname)
    .filter((pathname) => /^\/tools\/as-a-decimal\/\d+-\d+$/.test(pathname))
  assert.equal(quickLinkPaths.length, 14)
  assert.equal(new Set(quickLinkPaths).size, quickLinkPaths.length)
  const summary = familySection.children("p").first().text()
  assert.match(summary, new RegExp(`\\b${quickLinkPaths.length}\\b`))
  assert.doesNotMatch(summary, /\{count\}/)
})

