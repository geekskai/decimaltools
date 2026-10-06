import type { MetadataRoute } from "next"
import { allBlogs } from "contentlayer/generated"
import siteMetadata from "@/data/siteMetadata"
import { toolsData } from "@/data/toolsData"
import { PSEO_LAST_MODIFIED_DATE, getPseoPath, pseoFractionPairs } from "@/data/pseo-fractions"
import { getCanonicalUrl } from "@/lib/seo"
import { getPublishedPosts, getPublishedTagCounts, POSTS_PER_PAGE } from "@/lib/blog-seo"
import { toolContentDates } from "./tool-content-dates"

export default function sitemap(): MetadataRoute.Sitemap {
  const publishedPosts = getPublishedPosts(allBlogs)
  const staticPaths = ["/", "/blog", "/terms", "/privacy", "/tools", "/tags", "/about"]
  const routes: MetadataRoute.Sitemap = staticPaths.map((path) => ({ url: getCanonicalUrl(path) }))
  const blogRoutes = publishedPosts
    .map((post) => ({
      url: getCanonicalUrl(post.canonicalUrl || `/${post.path}`),
      lastModified: post.lastmod || post.date,
    }))
    .filter((entry) => new URL(entry.url).origin === siteMetadata.siteUrl)
  const toolRoutes = toolsData.map((tool) => ({
    url: getCanonicalUrl(tool.href),
    lastModified: toolContentDates[tool.id],
  }))
  const fractionRoutes = pseoFractionPairs.map(({ numerator, denominator }) => ({
    url: getCanonicalUrl(getPseoPath(numerator, denominator)),
    lastModified: PSEO_LAST_MODIFIED_DATE,
  }))
  const tagRoutes = Object.keys(getPublishedTagCounts(publishedPosts)).map((tag) => ({
    url: getCanonicalUrl(`/tags/${tag}`),
  }))
  const totalPages = Math.ceil(publishedPosts.length / POSTS_PER_PAGE)
  const paginationRoutes = Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => ({
    url: getCanonicalUrl(`/blog/page/${index + 2}`),
  }))
  const allRoutes = [
    ...routes,
    ...blogRoutes,
    ...toolRoutes,
    ...tagRoutes,
    ...paginationRoutes,
    { url: getCanonicalUrl("/tools/as-a-decimal"), lastModified: PSEO_LAST_MODIFIED_DATE },
    ...fractionRoutes,
  ]
  return [...new Map(allRoutes.map((entry) => [entry.url, entry])).values()]
}
