import ListLayout from "@/layouts/ListLayout"
import { useTranslations } from "next-intl"
import Link from "next/link"
import type { Blog } from "contentlayer/generated"
import type { CoreContent } from "pliny/utils/contentlayer.js"

const POSTS_PER_PAGE = 6
const MAX_DISPLAY = 5

const FEATURED_TOOLS = [
  {
    name: "Hours to Decimal Calculator",
    description: "Convert work logs and payroll durations into decimal hours instantly.",
    href: "/tools/hours-to-decimal-calculator",
  },
  {
    name: "Time to Decimal Converter",
    description: "Convert flexible time formats to decimal hours, minutes, or days.",
    href: "/tools/time-to-decimal-converter",
  },
  {
    name: "Inches to Decimals",
    description: "Convert fractions and mixed inches to decimal values for precision work.",
    href: "/tools/inches-to-decimals",
  },
  {
    name: "Millimeters to Decimal",
    description: "Convert millimeters to decimal inches for machining and manufacturing.",
    href: "/tools/millimeters-to-decimal",
  },
  {
    name: "Gauge to Decimal",
    description: "Look up gauge thickness and convert to decimal inch and mm outputs.",
    href: "/tools/gauge-to-decimal",
  },
  {
    name: "Hexa to Decimal",
    description: "Decode hex values into decimal, binary, and engineering-friendly outputs.",
    href: "/tools/hexa-to-decimal",
  },
]

interface HomeProps {
  posts?: CoreContent<Blog>[]
}

export default function Home({ posts = [] }: HomeProps) {
  const t = useTranslations("HomePage")
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
    <div className="dt-interface dt-page">
      <header className="dt-page-header">
        <h1>Decimal conversion tools</h1>
        <p>Convert fractions, measurements, time and number formats.</p>
        <p className="text-sm text-slate-400">Free to use. No account required.</p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link href="/tools" className="dt-button dt-button-primary">Browse all tools</Link>
          <Link href="/blog" className="dt-button">Read the guides</Link>
        </div>
      </header>

      <section aria-labelledby="home-converters">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 id="home-converters" className="text-xl font-semibold text-white">Converters</h2>
          <Link href="/tools" className="dt-text-link">View all tools</Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_TOOLS.map((tool) => (
            <Link key={tool.href} href={tool.href} className="dt-panel dt-tool-link">
              <h3 className="font-semibold text-white">{tool.name}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{tool.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-800 pt-8">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-white">{t("hero_blogs_list")}</h2>
          <Link href="/blog" className="dt-text-link">{t("blog_all_posts")}</Link>
        </div>
        <ListLayout
          posts={posts.slice(0, MAX_DISPLAY)}
          initialDisplayPosts={initialDisplayPosts}
          pagination={pagination}
          title={t("blog_all_posts")}
        />
      </section>

      {posts.length > MAX_DISPLAY && (
        <div>
          <Link href="/blog" className="dt-button">{t("blog_all_posts")}</Link>
        </div>
      )}
    </div>
  )
}
