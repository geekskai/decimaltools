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
