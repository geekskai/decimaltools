import { buildPageSchema, serializeJsonLd } from "@/lib/seo"

export default function PageSchema(options: Parameters<typeof buildPageSchema>[0]) {
  const schema = buildPageSchema(options)
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
    />
  )
}
