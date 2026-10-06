import Link from "next/link"
import { toolsData } from "@/data/toolsData"
import { toolTopics } from "@/data/tool-topics"

export default function RelatedTools({ slug }: { slug: string }) {
  const topic = toolTopics.find((candidate) =>
    candidate.slugs.some((toolSlug) => toolSlug === slug)
  )
  const relatedTools = toolsData.filter(
    (tool) => tool.id !== slug && topic?.slugs.some((toolSlug) => toolSlug === tool.id)
  )
  return (
    <section
      aria-label="Related tools"
      className="my-8 rounded-2xl border border-white/10 bg-slate-900/40 p-5"
    >
      <h2 className="text-xl font-semibold text-white">
        Related {topic?.name.toLowerCase()} tools
      </h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2">
        {relatedTools.map((tool) => (
          <li key={tool.id}>
            <Link
              href={tool.href}
              className="font-medium text-cyan-200 underline underline-offset-4"
            >
              {tool.title}
            </Link>
            <p className="mt-1 text-sm text-slate-300">{tool.description}</p>
          </li>
        ))}
      </ul>
      {topic?.name === "Measurement" && (
        <Link
          href="/blog/tools/how-to-convert-inches-to-a-decimal"
          className="mt-4 block text-cyan-200 underline"
        >
          Guide: how to convert fractional inches to decimals
        </Link>
      )}
      <Link href="/tools" className="mt-4 inline-block text-cyan-200 underline">
        Browse all converters
      </Link>
    </section>
  )
}
