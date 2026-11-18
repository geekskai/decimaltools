import Link from "./Link"
import SocialIcon from "./social-icons"
import siteMetadata from "@/data/siteMetadata"
import Image from "./Image"
import { useTranslations } from "next-intl"
import LinkNext from "next/link"
import { toolsData } from "@/data/toolsData"
import React from "react"

// Popular tools data for footer
// const popularTools = toolsData.slice(0, 4)

//   {
//     id: "html-to-markdown",
//     title: "HTML to Markdown",
//     href: "/tools/html-to-markdown",
//     icon: FileText,
//     badge: "New",
//   },
//   {
//     id: "discord-time-converter",
//     title: "Discord Time Converter",
//     href: "/tools/discord-time-converter",
//     icon: ArrowLeftRight,
//     badge: "Popular",
//   },
//   {
//     id: "job-worth-calculator",
//     title: "Job Worth Calculator",
//     href: "/tools/job-worth-calculator",
//     icon: Calculator,
//     badge: "Popular",
//   },
//   {
//     id: "pdf-to-markdown",
//     title: "PDF to Markdown",
//     href: "/tools/pdf-to-markdown",
//     icon: FileText,
//     badge: "Pro",
//   },
// ]

const SiteFooter = () => {
  const t = useTranslations("HomePage")
  return (
    <footer className="dt-footer mt-12 border-t border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div>
            <Link href="/" className="inline-flex min-h-[44px] items-center gap-1">
              <Image src="/static/decimaltools.png" alt="DecimalTools Logo" width={40} height={40} sizes="40px" className="h-10 w-10" />
              <span className="text-xl font-bold text-white">DecimalTools</span>
            </Link>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Free converters for fractions, measurements, time and number formats.
            </p>
          </div>

          {/* Popular Tools */}
          <div>
            <h3 className="mb-2 font-semibold text-white">Tools</h3>
            {toolsData.slice(0, 4).map((tool) => (
              <Link key={tool.id} href={tool.href} target="_blank" rel="noopener noreferrer" className="flex min-h-[44px] items-center text-sm text-slate-300 hover:text-primary-300">
                {tool.title}
                <span className="sr-only">(opens in a new tab)</span>
              </Link>
            ))}
            <Link href="/tools" target="_blank" rel="noopener noreferrer" className="dt-text-link">
              {t("footer_view_all_tools")}
            </Link>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-2 font-semibold text-white">{t("footer_resources")}</h3>
            <LinkNext href="/blog" className="flex min-h-[44px] items-center text-sm text-slate-300 hover:text-primary-300">{t("footer_blog")}</LinkNext>
            <LinkNext href="/tags" className="flex min-h-[44px] items-center text-sm text-slate-300 hover:text-primary-300">{t("footer_tags")}</LinkNext>
            <LinkNext href="/about" className="flex min-h-[44px] items-center text-sm text-slate-300 hover:text-primary-300">{t("footer_about")}</LinkNext>
            <LinkNext href="/privacy/" className="flex min-h-[44px] items-center text-sm text-slate-300 hover:text-primary-300">{t("footer_privacy_policy")}</LinkNext>
            <LinkNext href="/terms" className="flex min-h-[44px] items-center text-sm text-slate-300 hover:text-primary-300">{t("footer_terms_of_service")}</LinkNext>
          </div>

          {/* Connect */}
          <div>
            <h3 className="mb-3 font-semibold text-white">{t("footer_connect_with_us")}</h3>
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center"><SocialIcon kind="mail" href={
                "mailto:" + siteMetadata.email
              } size={6} /></span>
              <span className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center"><SocialIcon kind="github" href={siteMetadata.github} size={6} /></span>
              <span className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center"><SocialIcon kind="twitter" href={siteMetadata.twitter} size={6} /></span>
              <span className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center"><SocialIcon kind="linkedin" href={siteMetadata.linkedin} size={6} /></span>
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-slate-800 pt-5 text-sm text-slate-400">
          <span>© {new Date().getFullYear()}</span>
          <Link href="/" className="inline-flex min-h-[44px] items-center text-slate-200 hover:text-primary-300">DecimalTools</Link>
          <span>• {t("footer_all_rights_reserved")}</span>
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter
