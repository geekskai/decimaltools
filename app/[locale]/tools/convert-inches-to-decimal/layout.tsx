import RelatedTools from "@/components/RelatedTools"
import { genPageMetadata, getShareImageUrl, serializeJsonLd, SEO_ENTITY_IDS } from "@/lib/seo"
import type { Metadata } from "next"
// import { supportedLocales } from "app/i18n/routing"
import { getTranslations } from "next-intl/server"
import React from "react"
import { LAST_MODIFIED_ISO, TOOL_SLUG } from "./seoData"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "ConvertInchesToDecimal" })
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
  const t = await getTranslations({ locale, namespace: "ConvertInchesToDecimal" })
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
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    isAccessibleForFree: true,
    audience: {
      "@type": "Audience",
      audienceType: [
        t("structured_data.audience_type_1"),
        t("structured_data.audience_type_2"),
        t("structured_data.audience_type_3"),
        t("structured_data.audience_type_4"),
      ],
    },
    featureList: [
      t("structured_data.feature_1"),
      t("structured_data.feature_2"),
      t("structured_data.feature_3"),
      t("structured_data.feature_4"),
      t("structured_data.feature_5"),
      t("structured_data.feature_6"),
      t("structured_data.feature_7"),
      t("structured_data.feature_8"),
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
        name: t("breadcrumb.convert_inches_to_decimal"),
        item: pageUrl,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(webApplicationSchema),
        }}
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
