import { genPageMetadata, getCanonicalUrl, SEO_ENTITY_IDS, serializeJsonLd } from "@/lib/seo"
import { getPublishedPosts } from "@/lib/blog-seo"
import "css/prism.css"
import "katex/dist/katex.css"

import { components } from "@/components/MDXComponents"
import { MDXLayoutRenderer } from "pliny/mdx-components"
import { sortPosts, coreContent, allCoreContent } from "pliny/utils/contentlayer"
import { allBlogs, allAuthors } from "contentlayer/generated"
import type { Authors, Blog } from "contentlayer/generated"
import PostLayout from "@/layouts/PostLayout"
import { Metadata } from "next"
import siteMetadata from "@/data/siteMetadata"
import { notFound } from "next/navigation"
import { Suspense } from "react"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata | undefined> {
  const { slug: slugSegments } = await params
  const slug = decodeURI(slugSegments.join("/"))
  const post = getPublishedPosts(allBlogs).find((p) => p.slug === slug)
  if (!post) {
    return
  }

  const canonical = getCanonicalUrl(post.canonicalUrl || `/${post.path}`)
  const image = Array.isArray(post.images) ? post.images[0] : post.images
  return genPageMetadata({
    path: canonical,
    title: post.title,
    description: post.summary,
    image: image || siteMetadata.socialBanner,
    openGraph: {
      type: "article",
      publishedTime: new Date(post.date).toISOString(),
      modifiedTime: new Date(post.lastmod || post.date).toISOString(),
      authors: [getCanonicalUrl("/about")],
    },
  })
}

export const generateStaticParams = async () => {
  return getPublishedPosts(allBlogs).map((p) => ({
    slug: p.slug.split("/").map((name) => decodeURI(name)),
  }))
}

export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug: slugSegments } = await params
  const slug = decodeURI(slugSegments.join("/"))
  // Filter out drafts in production
  const sortedCoreContents = allCoreContent(sortPosts(getPublishedPosts(allBlogs)))
  const postIndex = sortedCoreContents.findIndex((p) => p.slug === slug)
  if (postIndex === -1) {
    return notFound()
  }

  const prev = sortedCoreContents[postIndex + 1]
  const next = sortedCoreContents[postIndex - 1]
  const post = getPublishedPosts(allBlogs).find((p) => p.slug === slug) as Blog
  const authorList = post?.authors || ["default"]
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author)
    return coreContent(authorResults as Authors)
  })
  const mainContent = coreContent(post)
  const canonical = getCanonicalUrl(post.canonicalUrl || `/${post.path}`)
  const jsonLd = {
    ...post.structuredData,
    "@id": `${canonical}#article`,
    url: canonical,
    mainEntityOfPage: canonical,
    isPartOf: { "@id": SEO_ENTITY_IDS.website },
    author: authorDetails.map((author) => ({
      "@type": "Person",
      "@id": SEO_ENTITY_IDS.author,
      name: author.name,
      url: getCanonicalUrl("/about"),
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <PostLayout content={mainContent} authorDetails={authorDetails} next={next} prev={prev}>
        <Suspense fallback={<div>Loading content...</div>}>
          <MDXLayoutRenderer code={post.body.code} components={components} toc={post.toc} />
        </Suspense>
      </PostLayout>
    </>
  )
}
