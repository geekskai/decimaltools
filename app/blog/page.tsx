import PageSchema from "@/components/PageSchema"
import { genPageMetadata } from "@/lib/seo"
import { getPublishedPosts, POSTS_PER_PAGE } from "@/lib/blog-seo"
import ListLayoutWithTags from "@/layouts/ListLayoutWithTags"
import { allCoreContent, sortPosts } from "pliny/utils/contentlayer"
import { allBlogs } from "contentlayer/generated"

export const metadata = genPageMetadata({
  path: "/blog",
  title: "Decimal & Measurement Guides | DecimalTools",
  description:
    "Practical guides to fractions, decimal inches and measurement conversions, with worked examples and free calculators.",
})

export default function BlogPage() {
  const posts = allCoreContent(sortPosts(getPublishedPosts(allBlogs)))
  const pageNumber = 1
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
        path="/blog"
        name="Decimal & Measurement Guides"
        description={String(metadata.description)}
        type="CollectionPage"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ]}
      />
      <ListLayoutWithTags
        posts={posts}
        initialDisplayPosts={initialDisplayPosts}
        pagination={pagination}
        title="All Posts"
      />
    </>
  )
}
