"use client"

import React from "react"
// import Link from "@/components/Link"
import { Link } from "@/app/i18n/navigation"
import { toolsData, ToolData } from "@/data/toolsData"
import { useTranslations } from "next-intl"

const MegaMenu = ({ closeMenu }: { closeMenu?: () => void }) => {
  const t = useTranslations("HomePage")

  // Improved grouping logic to balance columns
  const groups = toolsData.reduce(
    (acc, tool) => {
      let category = tool.category

      // Split large categories
      if (category === "Development") {
        if (tool.title.includes("Converter") || tool.title.includes("to")) {
          category = "Converters"
        } else {
          category = "Dev Tools"
        }
      } else if (["Education", "Entertainment", "Finance"].includes(category)) {
        category = "Others"
      } else if (["Productivity", "Communication"].includes(category)) {
        category = "Productivity"
      }

      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(tool)
      return acc
    },
    {} as Record<string, ToolData[]>
  )

  // Sort categories to put larger ones first or specific order
  const sortedCategories = [
    "Converters",
    "Dev Tools",
    "Utility",
    "Creative",
    "Productivity",
    "Others",
  ]

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {sortedCategories.map((category) => {
        const tools = groups[category]
        if (!tools) return null

        return (
          <div key={category} className="flex flex-col space-y-2">
            <h3 className="border-b border-slate-800 pb-2 text-sm font-medium text-slate-400">
              {category}
            </h3>
            <ul className="space-y-1">
              {tools.map((tool) => (
                <li key={tool.id}>
                  <Link
                    href={tool.href}
                    target="_blank"
                    onClick={closeMenu}
                    className="flex min-h-[44px] select-none items-center rounded-lg px-2 text-sm text-slate-200 transition-colors hover:bg-slate-900 hover:text-primary-300"
                  >
                    <span className="min-w-0">
                      {tool.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

export default MegaMenu