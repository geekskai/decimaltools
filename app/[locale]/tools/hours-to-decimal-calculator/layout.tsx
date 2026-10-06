import RelatedTools from "@/components/RelatedTools"
import { genPageMetadata, getShareImageUrl, serializeJsonLd, SEO_ENTITY_IDS } from "@/lib/seo"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { LAST_MODIFIED_ISO, TOOL_SLUG } from "./seoData"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "HoursToDecimalCalculator" })
  return genPageMetadata({
    path: `/tools/${TOOL_SLUG}`,
    title: t("seo_title"),
    description: t("seo_description"),
    image: getShareImageUrl(TOOL_SLUG),
    robots: { index: true, follow: true, googleBot: { "max-image-preview": "large" } },
    other: { "last-modified": LAST_MODIFIED_ISO },
  })
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "HoursToDecimalCalculator" })
  const isDefaultLocale = locale === "en"
  const pageUrl = isDefaultLocale
    ? `https://decimaltools.com/tools/${TOOL_SLUG}`
    : `https://decimaltools.com/${locale}/tools/${TOOL_SLUG}`

  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${pageUrl}#application`,
    isPartOf: { "@id": SEO_ENTITY_IDS.website },
    name: t("structured_data.app_name"),
    description: t("structured_data.app_description"),
    url: pageUrl,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    isAccessibleForFree: true,
    featureList: [
      t("structured_data.feature_1"),
      t("structured_data.feature_2"),
      t("structured_data.feature_3"),
      t("structured_data.feature_4"),
      t("structured_data.feature_5"),
      t("structured_data.feature_6"),
    ],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    provider: {
      "@id": SEO_ENTITY_IDS.organization,
      "@type": "Organization",
      name: "DecimalTools",
      url: "https://decimaltools.com",
    },
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t("breadcrumb.home"),
        item: "https://decimaltools.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t("breadcrumb.tools"),
        item: "https://decimaltools.com/tools",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: t("breadcrumb.current"),
        item: pageUrl,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(webApplicationSchema) }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema) }}
      />
      {children}
      <RelatedTools slug={TOOL_SLUG} />
    </>
  )
}
