import { ReactNode } from "react"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { supportedLocales } from "./i18n/routing"
import { toolsData } from "@/data/toolsData"
// import { supportedLocales } from "@/components/LanguageSelect"

type Props = {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({
    locale: locale,
  }))
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { locale } = await params
  const t = await getTranslations("HomePage")

  const isDefaultLocale = locale === "en"
  const title = t("home_seo_title")
  const description = t("home_seo_description")
  const keywords = t("home_seo_keywords")

  // 语言映射
  const localeMap: Record<string, string> = {
    en: "en_US",
    ja: "ja_JP",
    ko: "ko_KR",
    no: "no_NO",
    "zh-cn": "zh_CN",
    da: "da_DK",
  }

  const ogLocale = localeMap[locale] || "en_US"
  const baseUrl = "https://decimaltools.com"
  const url = `${baseUrl}${locale === "en" ? "" : `/${locale}`}/`

  const languages = {
    "x-default": "https://decimaltools.com/",
  }

  // supportedLocales.forEach((locale) => {
  //   languages[locale] = `https://decimaltools.com/${locale}/`
  // })

  return {
    title: title,
    description: description,
    keywords: keywords.split(", ").length > 1 ? keywords.split(", ") : [keywords],
    openGraph: {
      title: title,
      description: description,
      type: "website",
      url: url,
      siteName: "DecimalTools",
      images: [
        {
          url: "/static/images/og/decimaltools-home.png",
          width: 1200,
          height: 630,
          alt: "DecimalTools - Free AI-Powered Tools and Useful Online Utilities",
        },
      ],
      locale: ogLocale,
    },
    twitter: {
      title: title,
      description: description,
      card: "summary_large_image",
      images: ["/static/images/og/decimaltools-home.png"],
      creator: "@decimaltools",
      site: "@decimaltools",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    authors: [{ name: "DecimalTools" }],
    creator: "DecimalTools",
    publisher: "DecimalTools",
    alternates: {
      canonical: isDefaultLocale
        ? "https://decimaltools.com/"
        : `https://decimaltools.com/${locale}/`,
      // languages: {
      //   ...languages,
      // },
    },
    category: "Tools",
    classification: "Tools",
    other: {
      "application-name": "DecimalTools",
      "apple-mobile-web-app-title": "DecimalTools",
      "format-detection": "telephone=no",
      "mobile-web-app-capable": "yes",
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "black-translucent",
      "theme-color": "#0f172a",
      "DC.language": ogLocale.replace("_", "-"),
    },
  }
}

// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
export default async function RootLayout({ children, params }: Props) {
  return <>{children}</>
}
