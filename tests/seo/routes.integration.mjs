import assert from "node:assert/strict"
import test from "node:test"

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
