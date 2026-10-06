import { serializeJsonLd } from "@/lib/seo"
import { genPageMetadata, getShareImageUrl } from "@/lib/seo"
import { getPublishedPosts } from "@/lib/blog-seo"
import { sortPosts, allCoreContent } from "pliny/utils/contentlayer"
import { allBlogs } from "contentlayer/generated"
import Main from "../Main"
import { getTranslations } from "next-intl/server"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "HomePage" })
  return genPageMetadata({
    path: "/",
    title: t("home_seo_title"),
    description: t("home_seo_description"),
  })
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "HomePage" })
  const sortedPosts = sortPosts(getPublishedPosts(allBlogs))
  const posts = allCoreContent(sortedPosts)
  const baseUrl = "https://decimaltools.com"
  const url = `${baseUrl}${locale === "en" ? "" : `/${locale}`}`
  const localeMap: Record<string, string> = {
    en: "en-US",
    ja: "ja-JP",
    ko: "ko-KR",
    no: "nb-NO",
    "zh-cn": "zh-CN",
    da: "da-DK",
  }
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: t("home_seo_title"),
    description: t("home_seo_description"),
    isPartOf: { "@id": `${baseUrl}/#website` },
    about: { "@id": `${baseUrl}/#organization` },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: getShareImageUrl(),
    },
    inLanguage: localeMap[locale] || "en-US",
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(structuredData),
        }}
      />
      <Main posts={posts} />
    </>
  )
}
