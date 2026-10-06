import assert from "node:assert/strict"
import test from "node:test"
import {
  buildPageSchema,
  genPageMetadata,
  getCanonicalUrl,
  getShareImageUrl,
  serializeJsonLd,
  SEO_ENTITY_IDS,
} from "../../lib/seo.ts"
import { getBlogPageNumber, getPublishedPosts, getPublishedTagCounts } from "../../lib/blog-seo.ts"

test("canonical addresses preserve public paths and normalize English aliases", () => {
  assert.equal(
    getCanonicalUrl("/en/tools/fraction-to-decimal/?q=1#answer"),
    "https://decimaltools.com/tools/fraction-to-decimal"
  )
  assert.equal(getCanonicalUrl("/"), "https://decimaltools.com/")
  assert.equal(getCanonicalUrl("/encoding"), "https://decimaltools.com/encoding")
  assert.equal(
    getCanonicalUrl("https://publisher.example/original/"),
    "https://publisher.example/original/"
  )
})

test("metadata shares one canonical, description and absolute image across previews", () => {
  const metadata = genPageMetadata({
    path: "/tools/",
    title: "Measurement converters",
    description: "Convert inches and fractions.",
    image: getShareImageUrl("tools"),
  })
  assert.equal(metadata.alternates.canonical, "https://decimaltools.com/tools")
  assert.equal(metadata.openGraph.url, metadata.alternates.canonical)
  assert.equal(metadata.twitter.description, metadata.description)
  assert.equal(metadata.openGraph.images[0].url, "https://decimaltools.com/og/tools")
  assert.equal(metadata.twitter.images[0], metadata.openGraph.images[0].url)
  assert.equal(metadata.openGraph.title, metadata.title)
})

test("article metadata honors an explicit canonical and absolute source image", () => {
  const metadata = genPageMetadata({
    path: "/blog/copy",
    title: "Guide",
    alternates: { canonical: "https://publisher.example/guide" },
    image: "https://images.example/guide.png",
    openGraph: { type: "article" },
  })
  assert.equal(metadata.openGraph.url, "https://publisher.example/guide")
  assert.equal(metadata.openGraph.images[0].url, "https://images.example/guide.png")
  assert.equal(metadata.openGraph.type, "article")
})

test("JSON-LD cannot break out of its script while preserving the underlying text", () => {
  const schema = { text: '</script><script>alert("test")</script>' }
  const serialized = serializeJsonLd(schema)
  assert.ok(!serialized.includes("<"))
  assert.deepEqual(JSON.parse(serialized), schema)
})

test("page and breadcrumb entities share canonical URLs and site identity", () => {
  const schema = buildPageSchema({
    path: "/en/tools/",
    name: "Tools",
    description: "Converters",
    type: "CollectionPage",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Tools", path: "/tools/" },
    ],
  })
  const [page, breadcrumb] = schema["@graph"]
  assert.equal(page.isPartOf["@id"], SEO_ENTITY_IDS.website)
  assert.equal(page.breadcrumb["@id"], breadcrumb["@id"])
  assert.equal(breadcrumb.itemListElement[1].item, page.url)
})

test("drafts cannot leak into public lists or tag counts", () => {
  const posts = [
    { title: "Published", tags: ["Measurement", "Measurement"] },
    { title: "Draft", draft: true, tags: ["Hidden"] },
  ]
  assert.deepEqual(
    getPublishedPosts(posts).map((post) => post.title),
    ["Published"]
  )
  assert.deepEqual(getPublishedTagCounts(posts), { measurement: 1 })
})

test("pagination rejects malformed, partial, zero and out-of-range page numbers", () => {
  for (const value of ["0", "-1", "01", "1oops", "1.5", "3", "NaN"]) {
    assert.equal(getBlogPageNumber({ value, totalPosts: 10 }), null)
  }
  assert.equal(getBlogPageNumber({ value: "1", totalPosts: 0 }), 1)
  assert.equal(getBlogPageNumber({ value: "2", totalPosts: 10 }), 2)
})
