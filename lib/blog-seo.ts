import { slug } from "github-slugger"

export const POSTS_PER_PAGE = 9

export function getPublishedPosts<T extends { draft?: boolean }>(posts: readonly T[]): T[] {
  return posts.filter((post) => !post.draft)
}

export function getPublishedTagCounts(posts: readonly { draft?: boolean; tags?: string[] }[]) {
  const tagCounts: Record<string, number> = {}
  for (const post of getPublishedPosts(posts)) {
    for (const tag of new Set(post.tags?.map((label) => slug(label)) || [])) {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    }
  }
  return tagCounts
}

export function getBlogPageNumber({
  value,
  totalPosts,
}: {
  value: string
  totalPosts: number
}): number | null {
  if (!/^[1-9]\d*$/.test(value)) {
    return null
  }
  const pageNumber = Number(value)
  const totalPages = Math.max(1, Math.ceil(totalPosts / POSTS_PER_PAGE))
  return pageNumber <= totalPages ? pageNumber : null
}
