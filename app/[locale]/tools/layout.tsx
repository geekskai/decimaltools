import React from "react"
import { hasLocale } from "next-intl"
import { routing } from "../../i18n/routing"
import { notFound } from "next/navigation"
// import { supportedLocales as supportedLocalesList } from "@/components/LanguageSelect"

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}
// const supportedLocales = supportedLocalesList
// const supportedLocales = ["en", "ja", "ko", "no", "zh-cn"] // Add more as you implement them

export default async function Layout({ children, params }: Props) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  return <div className="min-h-screen">{children}</div>
}
