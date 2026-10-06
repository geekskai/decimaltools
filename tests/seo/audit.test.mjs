import assert from "node:assert/strict"
import test from "node:test"
import {
  auditSite,
  inspectHtml,
  isCrawlAllowed,
  parseRobots,
  toCsv,
} from "../../scripts/seo-audit-lib.mjs"

const ORIGIN = "https://decimaltools.com"
const VALID_HTML = `<html lang="en"><head><title>Fraction converter</title><meta name="description" content="Convert fractions."><link rel="canonical" href="${ORIGIN}/tools"><meta property="og:image" content="/og/tools"></head><body><h1>Fraction converter</h1><script type="application/ld+json">{"@type":"WebApplication"}</script></body></html>`

function inspect(html, xRobots = "") {
  return inspectHtml({
    html,
    pageUrl: `${ORIGIN}/tools`,
    expectedCanonical: `${ORIGIN}/tools`,
    xRobots,
  })
}

test("HTML audit accepts complete metadata and rejects inherited canonical, noindex and duplicate H1", () => {
  assert.deepEqual(inspect(VALID_HTML).errors, [])
  const broken = VALID_HTML.replace(`href="${ORIGIN}/tools"`, `href="${ORIGIN}/"`).replace(
    "</body>",
    "<h1>Duplicate</h1></body>"
  )
  assert.deepEqual(inspect(broken, "noindex").errors, ["canonical_mismatch", "h1_count", "noindex"])
})

test("page title excludes accessible SVG icon titles", () => {
  const html = VALID_HTML.replace("</body>", "<svg><title>Mail</title></svg></body>")
  assert.equal(inspect(html).title, "Fraction converter")
})

test("empty sitemaps cannot produce a passing audit", async (context) => {
  context.mock.method(globalThis, "fetch", async (url) => ({
    status: 200,
    url,
    headers: new Headers({ "content-type": "text/xml" }),
    text: async () => "<urlset></urlset>",
  }))
  await assert.rejects(
    auditSite({ site: "http://localhost:3011", canonicalOrigin: ORIGIN }),
    /Sitemap contains no page URLs/
  )
})

test("root canonical slash equivalence is accepted but tool trailing slashes are not", () => {
  const root = VALID_HTML.replace(`href="${ORIGIN}/tools"`, `href="${ORIGIN}"`)
  assert.deepEqual(
    inspectHtml({ html: root, pageUrl: ORIGIN, expectedCanonical: `${ORIGIN}/` }).errors,
    []
  )
  assert.ok(
    inspect(
      VALID_HTML.replace(`href="${ORIGIN}/tools"`, `href="${ORIGIN}/tools/"`)
    ).errors.includes("canonical_mismatch")
  )
})

test("robots audit honors specific crawler groups, longest matching rule and allow ties", () => {
  const groups = parseRobots(
    "User-agent: *\nDisallow: /\nUser-agent: Googlebot\nDisallow: /api/\nAllow: /api/public/\nDisallow: /*?private=*\n"
  )
  assert.equal(isCrawlAllowed({ groups, path: "/tools" }), true)
  assert.equal(isCrawlAllowed({ groups, path: "/api/private" }), false)
  assert.equal(isCrawlAllowed({ groups, path: "/api/public/help" }), true)
  assert.equal(isCrawlAllowed({ groups, path: "/tools?private=1" }), false)
  assert.equal(isCrawlAllowed({ groups, path: "/tools", agent: "otherbot" }), false)
})

test("CSV escapes quotes, commas and embedded newlines", () => {
  const csv = toCsv([
    { url: "https://example.com", title: 'A, "quoted"\ntitle', errors: ["bad_link"] },
  ])
  assert.ok(csv.includes('"A, ""quoted""\ntitle"'))
})

test("site audit checks local pages against public canonical URLs and real content dates", async (context) => {
  context.mock.method(globalThis, "fetch", async (url) => {
    const path = new URL(url).pathname
    const bodies = {
      "/robots.txt": "User-agent: *\nAllow: /",
      "/sitemap.xml": `<urlset><url><loc>${ORIGIN}/tools</loc><lastmod>2026-05-06</lastmod></url></urlset>`,
      "/tools": VALID_HTML,
    }
    const contentType = path.startsWith("/og/") ? "image/png" : "text/html"
    return {
      status: 200,
      url,
      headers: new Headers({ "content-type": contentType }),
      text: async () => bodies[path] || "",
      body: { cancel: async () => {} },
    }
  })
  const result = await auditSite({ site: "http://localhost:3011", canonicalOrigin: ORIGIN })
  assert.equal(result.summary.passed, 1)
  assert.equal(result.summary.blocked, 0)
  assert.equal(result.summary.failed, 0)
})

test("network errors remain BLOCKED and broken images fail instead of being treated as safe", async (context) => {
  context.mock.method(console, "error", () => {})
  context.mock.method(globalThis, "fetch", async (url) => {
    const path = new URL(url).pathname
    if (path === "/unreachable") {
      throw new Error("Connection refused")
    }
    const bodies = {
      "/robots.txt": "User-agent: *\nAllow: /",
      "/sitemap.xml": `<urlset><url><loc>${ORIGIN}/tools</loc></url><url><loc>${ORIGIN}/unreachable</loc></url></urlset>`,
      "/tools": VALID_HTML,
    }
    return {
      status: path.startsWith("/og/") ? 404 : 200,
      url,
      headers: new Headers({ "content-type": "text/html" }),
      text: async () => bodies[path] || "",
    }
  })
  const result = await auditSite({ site: "http://localhost:3011", canonicalOrigin: ORIGIN })
  assert.equal(result.summary.failed, 1)
  assert.equal(result.summary.blocked, 1)
  assert.equal(result.summary.passed, 0)
  assert.ok(result.rows[0].errors.includes("broken_references"))
  assert.equal(result.rows[1].status, "BLOCKED")
})

test("FAQ display is allowed while standalone, graph and mixed FAQPage schemas are rejected", () => {
  const visibleFaq = VALID_HTML.replace(
    "</body>",
    "<section><h2>Frequently asked questions</h2><h3>How does this work?</h3><p>Divide the numerator by the denominator.</p></section></body>"
  )
  assert.deepEqual(inspect(visibleFaq).errors, [])
  for (const schema of [
    { "@type": "FAQPage" },
    { "@graph": [{ "@type": "FAQPage" }] },
    { "@type": ["BlogPosting", "FAQPage"] },
  ]) {
    const html = visibleFaq.replace('{"@type":"WebApplication"}', JSON.stringify(schema))
    assert.ok(inspect(html).errors.includes("unexpected_faq_schema"))
  }
})
