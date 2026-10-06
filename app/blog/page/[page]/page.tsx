import PageSchema from "@/components/PageSchema"
import { notFound, permanentRedirect } from "next/navigation"
import { genPageMetadata } from "@/lib/seo"
import { getPublishedPosts, getBlogPageNumber, POSTS_PER_PAGE } from "@/lib/blog-seo"
import ListLayoutWithTags from "@/layouts/ListLayoutWithTags"
import { allCoreContent, sortPosts } from "pliny/utils/contentlayer"
import { allBlogs } from "contentlayer/generated"

const publishedPosts = getPublishedPosts(allBlogs)

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params
  const pageNumber = getBlogPageNumber({ value: page, totalPosts: publishedPosts.length })
  if (!pageNumber) {
    notFound()
  }
  return genPageMetadata({
    path: pageNumber === 1 ? "/blog" : `/blog/page/${pageNumber}`,
    title: `Decimal & Measurement Guides - Page ${pageNumber} | DecimalTools`,
    description: `Browse page ${pageNumber} of DecimalTools conversion guides and worked examples.`,
  })
}

export const generateStaticParams = async () => {
  const totalPages = Math.ceil(publishedPosts.length / POSTS_PER_PAGE)
  const paths = Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
    page: (i + 2).toString(),
  }))

  return paths
}

export default async function Page({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params
  const posts = allCoreContent(sortPosts(publishedPosts))
  const pageNumber = getBlogPageNumber({ value: page, totalPosts: publishedPosts.length })
  if (!pageNumber) {
    notFound()
  }
  if (pageNumber === 1) {
    permanentRedirect("/blog")
  }
  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  }

  return (
    <>
      <PageSchema
        path={`/blog/page/${pageNumber}`}
        name={`Decimal & Measurement Guides - Page ${pageNumber}`}
        description={`Browse page ${pageNumber} of DecimalTools conversion guides and worked examples.`}
        type="CollectionPage"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: `Page ${pageNumber}`, path: `/blog/page/${pageNumber}` },
        ]}
      />
      <ListLayoutWithTags
        posts={posts}
        initialDisplayPosts={initialDisplayPosts}
        pagination={pagination}
        title={`Guides - Page ${pageNumber}`}
      />
    </>
  )
}
