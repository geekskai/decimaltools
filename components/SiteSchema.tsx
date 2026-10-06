import { buildSiteSchema, serializeJsonLd } from "@/lib/seo"

export default function SiteSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildSiteSchema()) }}
    />
  )
}
