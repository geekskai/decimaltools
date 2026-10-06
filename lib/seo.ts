import type { Metadata } from "next"
import siteMetadata from "../data/siteMetadata.js"

export const SEO_ENTITY_IDS = {
  organization: `${siteMetadata.siteUrl}/#organization`,
  website: `${siteMetadata.siteUrl}/#website`,
  author: `${siteMetadata.siteUrl}/about#person`,
} as const

export function getCanonicalUrl(path: string): string {
  const canonical = new URL(path, `${siteMetadata.siteUrl}/`)
  if (canonical.origin === siteMetadata.siteUrl) {
    canonical.pathname = canonical.pathname.replace(/^\/en(?=\/|$)/, "")
    canonical.pathname = canonical.pathname.replace(/\/+$/, "") || "/"
    canonical.search = ""
    canonical.hash = ""
  }
  return canonical.toString()
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c")
}

export function getShareImageUrl(slug = "home"): string {
  return new URL(`/og/${slug}`, siteMetadata.siteUrl).toString()
}

export function buildSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": SEO_ENTITY_IDS.organization,
        name: "DecimalTools",
        url: getCanonicalUrl("/"),
        logo: {
          "@type": "ImageObject",
          url: new URL(siteMetadata.siteLogo, siteMetadata.siteUrl).toString(),
        },
        email: siteMetadata.email,
        sameAs: [siteMetadata.github, siteMetadata.x, siteMetadata.linkedin],
      },
      {
        "@type": "WebSite",
        "@id": SEO_ENTITY_IDS.website,
        name: "DecimalTools",
        url: getCanonicalUrl("/"),
        description: siteMetadata.description,
        inLanguage: "en-US",
        publisher: { "@id": SEO_ENTITY_IDS.organization },
      },
    ],
  }
}

type PageSEOOptions = Omit<Metadata, "title" | "description"> & {
  path: string
  title: string
  description?: string
  image?: string
}

export function genPageMetadata({
  path,
  title,
  description = siteMetadata.description,
  image = getShareImageUrl(),
  openGraph,
  twitter,
  alternates,
  ...metadata
}: PageSEOOptions): Metadata {
  const alternate = alternates?.canonical
  let canonicalPath = path
  if (typeof alternate === "string" || alternate instanceof URL) {
    canonicalPath = alternate.toString()
  } else if (alternate) {
    canonicalPath = alternate.url.toString()
  }
  const canonical = getCanonicalUrl(canonicalPath)
  const imageUrl = new URL(image, siteMetadata.siteUrl).toString()
  return {
    ...metadata,
    metadataBase: new URL(siteMetadata.siteUrl),
    title,
    description,
    alternates: { ...alternates, canonical },
    openGraph: {
      type: "website",
      siteName: "DecimalTools",
      locale: "en_US",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      ...openGraph,
      title,
      description,
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      images: [imageUrl],
      ...twitter,
      title,
      description,
    },
  }
}

type PageSchemaOptions = {
  path: string
  name: string
  description: string
  type?: "WebPage" | "CollectionPage" | "AboutPage"
  breadcrumbs: { name: string; path: string }[]
}

export function buildPageSchema({
  path,
  name,
  description,
  type = "WebPage",
  breadcrumbs,
}: PageSchemaOptions) {
  const url = getCanonicalUrl(path)
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": type,
        "@id": `${url}#webpage`,
        url,
        name,
        description,
        inLanguage: "en-US",
        isPartOf: { "@id": SEO_ENTITY_IDS.website },
        about: { "@id": SEO_ENTITY_IDS.organization },
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: breadcrumbs.map((breadcrumb, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: breadcrumb.name,
          item: getCanonicalUrl(breadcrumb.path),
        })),
      },
    ],
  }
}
