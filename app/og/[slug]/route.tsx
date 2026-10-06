import { toolsData } from "@/data/toolsData"
import siteMetadata from "@/data/siteMetadata"
import { createShareImage } from "@/lib/seo-image"

export const dynamic = "force-static"

const sharePages = [
  { id: "home", title: "Decimal converters & calculators", description: siteMetadata.description },
  {
    id: "tools",
    title: "Find the right converter",
    description:
      "Free tools for fractions, inches, millimeters, time and character codes. No sign-up required.",
  },
  ...toolsData,
]

export function generateStaticParams() {
  return sharePages.map((page) => ({ slug: page.id }))
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = sharePages.find((candidate) => candidate.id === slug)
  if (!page) {
    return new Response("Image not found", { status: 404 })
  }
  return createShareImage({ title: page.title, description: page.description })
}
