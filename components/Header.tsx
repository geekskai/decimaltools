"use client"

import { useEffect, useRef, useState } from "react"
import type { KeyboardEvent } from "react"
import siteMetadata from "@/data/siteMetadata"
import headerNavLinks from "@/data/headerNavLinks"
import Link from "./Link"
import MobileNav from "./MobileNav"
import SearchButton from "./SearchButton"
import Image from "./Image"
import { ChevronDown } from "lucide-react"
import { useTranslations } from "next-intl"
import LinkNext from "next/link"
import MegaMenu from "./MegaMenu"

const Header = () => {
  const t = useTranslations("HomePage")
  const [isToolsOpen, setIsToolsOpen] = useState(false)
  const toolsMenuRef = useRef<HTMLDivElement>(null)
  const toolsButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isToolsOpen) {
      return
    }
    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !toolsMenuRef.current?.contains(event.target)) {
        setIsToolsOpen(false)
      }
    }
    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [isToolsOpen])

  // Return focus to the trigger when keyboard users dismiss the tools disclosure.
  const handleToolsKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Escape") {
      return
    }
    setIsToolsOpen(false)
    toolsButtonRef.current?.focus()
  }

  return (
    <header className="dt-header sticky top-0 z-70 border-b border-slate-800 bg-slate-950/95">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 xl:px-8">
        {/* Keep the existing logo asset and wordmark. */}
        <Link href="/" aria-label={siteMetadata.headerTitle}>
          <div className="flex min-h-[44px] items-center gap-1">
            <Image src="/static/decimaltools.png" alt="DecimalTools Logo" width={40} height={40} sizes="40px" className="h-10 w-10" />
            {typeof siteMetadata.headerTitle === "string" ? (
              <div className="hidden text-2xl font-bold text-white sm:block">{siteMetadata.headerTitle}</div>
            ) : siteMetadata.headerTitle}
          </div>
        </Link>

        <div className="hidden items-center gap-5 lg:flex">
          <nav aria-label="Main navigation" className="flex items-center gap-2">
            {headerNavLinks.map((link) => (
              <LinkNext key={link.title} href={link.href} className="inline-flex min-h-[44px] items-center rounded-lg px-3 text-base text-slate-300 hover:text-white">
                {t(link.title)}
              </LinkNext>
            ))}
            <div
              ref={toolsMenuRef}
              onKeyDown={handleToolsKeyDown}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  setIsToolsOpen(false)
                }
              }}
            >
              <button
                ref={toolsButtonRef}
                type="button"
                aria-expanded={isToolsOpen}
                aria-controls="header-tools-panel"
                onClick={() => setIsToolsOpen((isOpen) => !isOpen)}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-lg px-3 text-base text-slate-300 hover:bg-slate-900 hover:text-white"
              >
                {t("header_nav_tools")}
                <ChevronDown className={isToolsOpen ? "h-4 w-4 rotate-180" : "h-4 w-4"} aria-hidden="true" />
              </button>
              <div id="header-tools-panel" hidden={!isToolsOpen} className="absolute inset-x-0 top-full border-b border-slate-700 bg-slate-950 shadow-xl">
                <div className="mx-auto max-h-[75vh] max-w-7xl overflow-y-auto px-6 py-6">
                  <MegaMenu closeMenu={() => setIsToolsOpen(false)} />
                  <Link href="/tools" onClick={() => setIsToolsOpen(false)} className="dt-text-link mt-4">
                    {t("footer_view_all_tools")}
                  </Link>
                </div>
              </div>
            </div>
          </nav>
          <SearchButton />
        </div>

        {/* Retain the mobile dialog and its focus/scroll handling. */}
        <div className="flex items-center gap-3 lg:hidden">
          <SearchButton />
          <MobileNav />
        </div>
      </div>
    </header>
  )
}

export default Header
