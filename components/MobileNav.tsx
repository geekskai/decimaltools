"use client"

import { Dialog, Transition } from "@headlessui/react"
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock"
import { Fragment, useState, useEffect, useRef } from "react"
import Link from "./Link"
import headerNavLinks from "@/data/headerNavLinks"
import { ChevronDown, Zap, Menu, X } from "lucide-react"
import { toolsData } from "@/data/toolsData"
import LanguageSelect from "./LanguageSelect"
import LinkNext from "next/link"
import { useTranslations } from "next-intl"

const MobileNav = () => {
  const t = useTranslations("HomePage")
  const [navShow, setNavShow] = useState(false)
  const [toolsExpanded, setToolsExpanded] = useState(false)
  const navRef = useRef(null)

  const onToggleNav = () => {
    setNavShow((status) => {
      if (status) {
        enableBodyScroll(navRef.current)
        setToolsExpanded(false) // Reset tools expansion when closing
      } else {
        // Prevent scrolling
        disableBodyScroll(navRef.current)
      }
      return !status
    })
  }

  const onToolsToggle = () => {
    setToolsExpanded(!toolsExpanded)
  }

  useEffect(() => {
    return clearAllBodyScrollLocks
  })

  return (
    <>
      <button
        aria-label="Toggle Menu"
        aria-expanded={navShow}
        aria-controls="mobile-navigation"
        onClick={onToggleNav}
        className="min-h-[44px] min-w-[44px] rounded-lg p-2 transition-colors duration-300 hover:bg-slate-800/50 lg:hidden"
      >
        <Menu className="h-6 w-6 text-slate-300 hover:text-white" />
      </button>

      <Transition appear show={navShow} as={Fragment} unmount={false}>
        <Dialog as="div" onClose={onToggleNav} unmount={false}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            unmount={false}
          >
            <div className="fixed inset-0 z-80 bg-black/50 backdrop-blur-sm" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-x-full opacity-0"
            enterTo="translate-x-0 opacity-100"
            leave="transition ease-in duration-200 transform"
            leaveFrom="translate-x-0 opacity-100"
            leaveTo="translate-x-full opacity-0"
            unmount={false}
          >
            <Dialog.Panel id="mobile-navigation" className="dt-interface dt-mobile-nav fixed right-0 top-0 z-80 flex h-full w-80 max-w-[calc(100vw-16px)] flex-col border-l border-slate-800/50 bg-slate-950/95 shadow-2xl backdrop-blur-xl">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800/50 p-6">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-400" />
                  <Dialog.Title className="text-lg font-semibold text-white">Navigation</Dialog.Title>
                </div>
                <button
                  onClick={onToggleNav}
                  className="rounded-lg p-2 transition-colors duration-300 hover:bg-slate-800/50"
                  aria-label="Close Menu"
                >
                  <X className="h-5 w-5 text-slate-300 hover:text-white" />
                </button>
              </div>

              {/* Navigation */}
              <nav ref={navRef} className="min-h-0 flex-1 overflow-y-auto p-4">
                <div className="space-y-2">
                  {headerNavLinks.map((link) => (
                    <LinkNext
                      key={link.title}
                      href={link.href}
                      onClick={onToggleNav}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-lg font-medium text-slate-300 transition-all duration-300 hover:bg-slate-800/50 hover:text-white"
                    >
                      {t(link.title)}
                    </LinkNext>
                  ))}

                  {/* Tools Section */}
                  <div className="my-2">
                    <button
                      onClick={onToolsToggle}
                      aria-expanded={toolsExpanded}
                      className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-lg font-medium text-slate-300 transition-all duration-300 hover:bg-slate-800/50 hover:text-white"
                    >
                      <span>{t("header_nav_tools")}</span>
                      <ChevronDown
                        className={`h-5 w-5 transition-transform duration-300 ${
                          toolsExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Tools Categorized for Mobile */}
                    <Transition
                      show={toolsExpanded}
                      enter="transition-all duration-300 ease-out"
                      enterFrom="opacity-0 max-h-0"
                      enterTo="opacity-100 max-h-[80vh]"
                      leave="transition-all duration-200 ease-in"
                      leaveFrom="opacity-100 max-h-[80vh]"
                      leaveTo="opacity-0 max-h-0"
                    >
                      <div className="custom-scrollbar ml-4 mt-2 space-y-4 overflow-hidden overflow-y-auto border-l-2 border-slate-800/50 pl-4">
                        {Object.entries(
                          toolsData.reduce(
                            (acc, tool) => {
                              let category = tool.category
                              if (category === "Development") {
                                category =
                                  tool.title.includes("Converter") || tool.title.includes("to")
                                    ? "Converters"
                                    : "Dev Tools"
                              } else if (
                                ["Education", "Entertainment", "Finance"].includes(category)
                              ) {
                                category = "Others"
                              } else if (["Productivity", "Communication"].includes(category)) {
                                category = "Productivity"
                              }
                              if (!acc[category]) acc[category] = []
                              acc[category].push(tool)
                              return acc
                            },
                            {} as Record<string, typeof toolsData>
                          )
                        ).map(([category, tools]) => (
                          <div key={category} className="space-y-2">
                            <h4 className="text-sm font-medium text-slate-400">
                              {category}
                            </h4>
                            <div className="space-y-1">
                              {tools.map((tool) => {
                                return (
                                  <Link
                                    key={tool.id}
                                    href={tool.href}
                                    onClick={onToggleNav}
                                    className="group flex min-h-[44px] items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-900 hover:text-white"
                                  >
                                    <span className="truncate group-hover:text-blue-300">
                                      {tool.title
                                        .split(" - ")[0]
                                        .replace(
                                          / Converter| Generator| Tracker| Calculator| Decoder & Lookup| Test/g,
                                          ""
                                        )}
                                    </span>
                                  </Link>
                                )
                              })}
                            </div>
                          </div>
                        ))}

                        {/* View All Tools */}
                        <Link
                          href="/tools"
                          onClick={onToggleNav}
                          className="mt-4 flex items-center gap-2 rounded-xl bg-slate-800/50 px-4 py-3 text-sm font-medium text-blue-400 transition-all duration-300 hover:bg-blue-500/20 hover:text-white"
                        >
                          <Zap className="h-4 w-4" />
                          {t("footer_view_all_tools")}
                        </Link>
                      </div>
                    </Transition>
                  </div>

                  {/* Language Select */}
                  <LanguageSelect />
                </div>
              </nav>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  )
}

export default MobileNav
