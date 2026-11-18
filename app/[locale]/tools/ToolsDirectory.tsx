"use client"

import { serializeJsonLd } from "@/lib/seo"

import Link from "next/link"
import React, { useState, useMemo } from "react"
import { ExternalLink } from "lucide-react"
import { toolsData } from "@/data/toolsData"
import { useLocale, useTranslations } from "next-intl"

export default function ToolsPage() {
  // State management for search and filtering
  const t = useTranslations("ToolsPage")
  const locale = useLocale()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  // Use imported tools data
  const tools = useMemo(() => toolsData, [])

  // Get unique categories from tools
  const categories = useMemo(() => {
    const cats = Array.from(new Set(tools.map((tool) => tool.category)))
    return ["All", ...cats.sort()]
  }, [tools])

  // Filter tools based on search term and selected category
  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesSearch =
        searchTerm === "" ||
        tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.features.some((feature) => feature.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === "All" || tool.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [tools, searchTerm, selectedCategory])

  const baseUrl = "https://decimaltools.com"
  const localizedBaseUrl = `${baseUrl}${locale === "en" ? "" : `/${locale}`}`
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
    "@type": "CollectionPage",
    "@id": `${localizedBaseUrl}/tools#collection`,
    name: t("tools_seo_title"),
    description: t("tools_seo_description"),
    url: `${localizedBaseUrl}/tools`,
    isPartOf: { "@id": `${baseUrl}/#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: tools.length,
      itemListElement: tools.map((tool, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "SoftwareApplication",
          name: tool.title,
          description: tool.description,
          url: `${localizedBaseUrl}${tool.href}`,
          applicationCategory: "UtilityApplication",
          operatingSystem: "Any",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        },
      })),
    },
    provider: { "@id": `${baseUrl}/#organization` },
    isAccessibleForFree: true,
    inLanguage: localeMap[locale] || "en-US",
  }

  return (
    <div className="dt-interface dt-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
      />
      <header className="dt-page-header">
        <h1>Decimal, measurement &amp; time converters</h1>
        <p>Choose a converter for fractions, measurements, time or character codes.</p>
        <p className="text-sm text-slate-400">{tools.length} free tools. No account required.</p>
      </header>

      <section id="tools-section" aria-label="Find a converter" className="space-y-5">
        <div className="max-w-2xl">
          <label htmlFor="tool-search" className="mb-2 block text-sm font-medium text-slate-200">
            Search tools
          </label>
          <div className="flex gap-2">
            <input
              id="tool-search"
              type="search"
              placeholder="Name, conversion or feature"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="min-w-0 flex-1 rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-white placeholder-slate-400"
            />
            {searchTerm && (
              <button type="button" onClick={() => setSearchTerm("")} className="dt-button">
                Clear search
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Tool categories">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              aria-pressed={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "dt-button dt-button-primary" : "dt-button"}
            >
              {category}
            </button>
          ))}
        </div>
        <p role="status" className="text-sm text-slate-400">
          {filteredTools.length} of {tools.length} tools
        </p>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              target="_blank"
              rel="noopener noreferrer"
              className="dt-panel dt-tool-link flex flex-col gap-3"
            >
              <p className="text-sm text-slate-400">{tool.category}</p>
              <h2 className="text-lg font-semibold text-white">{tool.title}</h2>
              <p className="text-sm leading-6 text-slate-300">{tool.description}</p>
              <p className="border-t border-slate-800 pt-3 text-sm leading-6 text-slate-400">
                {tool.features[0]}
              </p>
              <span className="mt-auto inline-flex items-center gap-2 pt-1 text-sm font-medium text-primary-300">
                Open converter <ExternalLink className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </span>
            </Link>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="dt-panel space-y-3">
            <h2 className="text-lg font-semibold text-white">{t("tools_no_tools_found")}</h2>
            <p className="text-slate-300">{t("tools_try_adjusting_your_search_or_filter_criteria")}</p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("All")
              }}
              className="dt-button"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      <section className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-slate-800 pt-5">
        <h2 className="text-base font-medium text-white">Need another conversion?</h2>
        <Link href="mailto:geeks.kai@gmail.com" className="dt-text-link">Suggest a tool</Link>
        <Link href="https://github.com/geekskai" target="_blank" rel="noopener noreferrer" className="dt-text-link">
          Contribute on GitHub
        </Link>
      </section>
    </div>
  )
}
