import { load } from "cheerio"

const REQUEST_TIMEOUT_MS = 20_000
const AUDIT_CONCURRENCY = 4

function containsFaqSchema(schema) {
  if (!schema || typeof schema !== "object") {
    return false
  }
  const types = schema["@type"]
  if (types === "FAQPage" || (Array.isArray(types) && types.includes("FAQPage"))) {
    return true
  }
  return Object.values(schema).some(containsFaqSchema)
}

export function parseRobots(source) {
  const groups = []
  let group = { agents: [], rules: [] }
  for (const line of source.split(/\r?\n/)) {
    const match = line.replace(/#.*/, "").match(/^\s*(user-agent|allow|disallow)\s*:\s*(.*?)\s*$/i)
    if (!match) {
      continue
    }
    const [, directive, value] = match
    if (directive.toLowerCase() === "user-agent" && group.rules.length) {
      groups.push(group)
      group = { agents: [], rules: [] }
    }
    if (directive.toLowerCase() === "user-agent") {
      group.agents.push(value.toLowerCase())
      continue
    }
    group.rules.push({ isAllowed: directive.toLowerCase() === "allow", path: value })
  }
  return [...groups, group]
}

export function isCrawlAllowed({ groups, path, agent = "googlebot" }) {
  const exactGroups = groups.filter((group) => group.agents.includes(agent))
  const applicable = exactGroups.length
    ? exactGroups
    : groups.filter((group) => group.agents.includes("*"))
  const matches = applicable
    .flatMap((group) => group.rules)
    .filter((rule) => {
      if (!rule.path) {
        return false
      }
      const pattern = rule.path.replace(/[.+?^{}()|[\]\\]/g, "\\$&").replaceAll("*", ".*")
      return new RegExp(`^${pattern}`).test(path)
    })
  matches.sort(
    (left, right) =>
      right.path.replaceAll("*", "").length - left.path.replaceAll("*", "").length ||
      Number(right.isAllowed) - Number(left.isAllowed)
  )
  return matches[0]?.isAllowed ?? true
}

function getAbsoluteLinks({ document, selector, attribute, pageUrl }) {
  return [
    ...new Set(
      document(selector)
        .toArray()
        .map((element) => {
          const value = document(element).attr(attribute)
          if (!value) {
            return null
          }
          try {
            const url = new URL(value, pageUrl)
            url.hash = ""
            return /^https?:$/.test(url.protocol) ? url.href : null
          } catch (error) {
            console.error(`Invalid ${attribute} on ${pageUrl}:`, error.message)
            return null
          }
        })
        .filter(Boolean)
    ),
  ]
}

export function inspectHtml({ html, pageUrl, expectedCanonical, xRobots = "" }) {
  const document = load(html)
  const errors = []
  const canonicalLinks = document('link[rel="canonical"]')
  const canonical = canonicalLinks.first().attr("href") || ""
  const title = document("head > title").first().text().trim()
  const description = document('meta[name="description"]').attr("content") || ""
  const language = document("html").attr("lang") || ""
  const robots = document('meta[name="robots"], meta[name="googlebot"]')
    .toArray()
    .map((element) => document(element).attr("content"))
    .join(",")
  const h1Count = document("h1").length
  const schemaScripts = document('script[type="application/ld+json"]').toArray()
  if (
    canonicalLinks.length !== 1 ||
    (canonical !== expectedCanonical && canonical !== expectedCanonical.replace(/\/$/, ""))
  ) {
    errors.push("canonical_mismatch")
  }
  if (!title) {
    errors.push("missing_title")
  }
  if (!description.trim()) {
    errors.push("missing_description")
  }
  if (h1Count !== 1) {
    errors.push("h1_count")
  }
  if (!/^en(?:-US)?$/i.test(language)) {
    errors.push("html_language")
  }
  if (/\b(noindex|none)\b/i.test(`${robots},${xRobots}`)) {
    errors.push("noindex")
  }
  if (!schemaScripts.length) {
    errors.push("missing_json_ld")
  }
  for (const element of schemaScripts) {
    try {
      const schema = JSON.parse(document(element).text())
      if (containsFaqSchema(schema)) {
        errors.push("unexpected_faq_schema")
      }
    } catch (error) {
      console.error(`Invalid JSON-LD on ${pageUrl}:`, error.message)
      errors.push("invalid_json_ld")
    }
  }
  const images = getAbsoluteLinks({
    document,
    selector: 'meta[property="og:image"], meta[name="twitter:image"]',
    attribute: "content",
    pageUrl,
  })
  if (!images.length) {
    errors.push("missing_share_image")
  }
  const contentImages = getAbsoluteLinks({
    document,
    selector: "img[src]",
    attribute: "src",
    pageUrl,
  })
  const links = getAbsoluteLinks({ document, selector: "a[href]", attribute: "href", pageUrl })
  return {
    title,
    description,
    canonical,
    language,
    h1Count,
    schemaCount: schemaScripts.length,
    errors,
    images: [...new Set([...images, ...contentImages])],
    links,
  }
}

async function fetchResource(url) {
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      headers: { "user-agent": "DecimalToolsSEOAudit/1.0" },
    })
    const contentType = response.headers.get("content-type") || ""
    const isText = /text|xml|json/.test(contentType)
    const body = isText ? await response.text() : ""
    if (!isText) {
      await response.body?.cancel()
    }
    return {
      status: response.status,
      finalUrl: response.url,
      contentType,
      body,
      xRobots: response.headers.get("x-robots-tag") || "",
    }
  } catch (error) {
    console.error(`Could not fetch ${url}:`, error.message)
    return { status: null, finalUrl: url, body: "", contentType: "", error: error.message }
  }
}

function toFetchUrl({ url, site, canonicalOrigin }) {
  const target = new URL(url, canonicalOrigin)
  if (target.origin === canonicalOrigin) {
    return new URL(`${target.pathname}${target.search}`, site).href
  }
  return target.href
}

async function mapConcurrent(values, operation) {
  const results = new Array(values.length)
  let cursor = 0
  async function worker() {
    while (cursor < values.length) {
      const index = cursor++
      results[index] = await operation(values[index])
    }
  }
  await Promise.all(Array.from({ length: Math.min(AUDIT_CONCURRENCY, values.length) }, worker))
  return results
}

async function readSitemap({ url, fetchCached, site, canonicalOrigin, visited = new Set() }) {
  if (visited.has(url)) {
    return []
  }
  visited.add(url)
  const response = await fetchCached(url)
  if (response.error || response.status !== 200) {
    throw new Error(`Sitemap unavailable: ${url} (${response.error || response.status})`)
  }
  const document = load(response.body, { xml: true })
  const locations = document("loc")
    .toArray()
    .map((element) => document(element).text().trim())
  if (document("sitemapindex").length) {
    const nested = await mapConcurrent(locations, (location) =>
      readSitemap({
        url: toFetchUrl({ url: location, site, canonicalOrigin }),
        fetchCached,
        site,
        canonicalOrigin,
        visited,
      })
    )
    return nested.flat()
  }
  if (!document("urlset").length) {
    throw new Error(`Not an XML sitemap: ${url}`)
  }
  return document("urlset > url")
    .toArray()
    .map((element) => ({
      url: document(element).find("loc").text().trim(),
      lastmod: document(element).find("lastmod").text().trim(),
    }))
}

async function auditReferences({ inspection, context }) {
  const brokenReferences = []
  const blockedReferences = []
  const warnings = []
  const internalLinks = inspection.links.filter((url) =>
    [context.site, context.canonicalOrigin].includes(new URL(url).origin)
  )
  const references = [...new Set([...internalLinks, ...inspection.images])]
  for (const url of references) {
    const response = await context.fetchCached(toFetchUrl({ url, ...context }))
    if (response.error) {
      blockedReferences.push(url)
      continue
    }
    const isImage = inspection.images.includes(url)
    if (response.status !== 200 || (isImage && !response.contentType.startsWith("image/"))) {
      brokenReferences.push(url)
    }
    if (!isImage && response.finalUrl !== toFetchUrl({ url, ...context })) {
      warnings.push(`redirecting_link:${url}`)
    }
  }
  return { brokenReferences, blockedReferences, warnings }
}

async function auditPage({ entry, context, robotsGroups, hasRobotsError }) {
  const fetchUrl = toFetchUrl({ url: entry.url, ...context })
  const response = await context.fetchCached(fetchUrl)
  if (response.error) {
    return {
      url: entry.url,
      status: "BLOCKED",
      httpStatus: null,
      errors: [],
      blocked: [response.error],
    }
  }
  const expectedCanonical = new URL(new URL(entry.url).pathname, context.canonicalOrigin).href
  const inspection = inspectHtml({
    html: response.body,
    pageUrl: entry.url,
    expectedCanonical,
    xRobots: response.xRobots,
  })
  const errors = [...inspection.errors]
  if (response.status !== 200) {
    errors.push(`http_${response.status}`)
  }
  if (response.finalUrl !== fetchUrl) {
    errors.push("sitemap_redirect")
  }
  if (!response.contentType.includes("text/html")) {
    errors.push("not_html")
  }
  if (new URL(entry.url).origin !== context.canonicalOrigin) {
    errors.push("foreign_sitemap_url")
  }
  if (!isCrawlAllowed({ groups: robotsGroups, path: new URL(entry.url).pathname })) {
    errors.push("robots_disallowed")
  }
  if (
    entry.lastmod &&
    (!Number.isFinite(Date.parse(entry.lastmod)) || Date.parse(entry.lastmod) > Date.now())
  ) {
    errors.push("invalid_lastmod")
  }
  const references = await auditReferences({ inspection, context })
  const blocked = [...references.blockedReferences]
  if (hasRobotsError) {
    blocked.push("robots_unavailable")
  }
  if (references.brokenReferences.length) {
    errors.push("broken_references")
  }
  let status = "PASS"
  if (blocked.length) {
    status = "BLOCKED"
  }
  if (errors.length) {
    status = "FAIL"
  }
  return {
    url: entry.url,
    status,
    httpStatus: response.status,
    finalUrl: response.finalUrl,
    ...inspection,
    errors,
    blocked,
    ...references,
  }
}

export async function auditSite({ site, canonicalOrigin, sitemap = "/sitemap.xml" }) {
  const cache = new Map()
  function fetchCached(url) {
    if (!cache.has(url)) {
      cache.set(url, fetchResource(url))
    }
    return cache.get(url)
  }
  const context = {
    site: new URL(site).origin,
    canonicalOrigin: new URL(canonicalOrigin).origin,
    fetchCached,
  }
  const robots = await fetchCached(new URL("/robots.txt", site).href)
  const hasRobotsError = Boolean(robots.error || (robots.status !== 200 && robots.status !== 404))
  const robotsGroups = parseRobots(robots.status === 200 ? robots.body : "")
  const entries = await readSitemap({ url: new URL(sitemap, site).href, ...context })
  if (!entries.length) {
    throw new Error("Sitemap contains no page URLs; audit cannot verify the site")
  }
  const uniqueEntries = [...new Map(entries.map((entry) => [entry.url, entry])).values()]
  const rows = await mapConcurrent(uniqueEntries, (entry) =>
    auditPage({ entry, context, robotsGroups, hasRobotsError })
  )
  const duplicateUrls = entries.length - uniqueEntries.length
  const duplicateTitles = rows
    .filter(
      (row, index) =>
        row.title && rows.findIndex((candidate) => candidate.title === row.title) !== index
    )
    .map((row) => row.url)
  const summary = {
    total: rows.length,
    passed: rows.filter((row) => row.status === "PASS").length,
    failed: rows.filter((row) => row.status === "FAIL").length,
    blocked: rows.filter((row) => row.status === "BLOCKED").length,
    duplicateUrls,
    duplicateTitles,
  }
  return { summary, rows }
}

export function toCsv(rows) {
  const columns = [
    "url",
    "status",
    "httpStatus",
    "canonical",
    "title",
    "description",
    "language",
    "h1Count",
    "schemaCount",
    "errors",
    "blocked",
    "brokenReferences",
    "warnings",
  ]
  function escapeCell(value) {
    const text = Array.isArray(value) ? value.join("; ") : String(value ?? "")
    return `"${text.replaceAll('"', '""')}"`
  }
  return (
    [
      columns.join(","),
      ...rows.map((row) => columns.map((column) => escapeCell(row[column])).join(",")),
    ].join("\n") + "\n"
  )
}
