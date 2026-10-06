import { getTranslations } from "next-intl/server"
import { genPageMetadata, getShareImageUrl } from "@/lib/seo"
import ToolsDirectory from "./ToolsDirectory"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "ToolsPage" })
  return genPageMetadata({
    path: "/tools",
    title: t("tools_seo_title"),
    description: t("tools_seo_description"),
    image: getShareImageUrl("tools"),
  })
}

export default function ToolsPage() {
  return <ToolsDirectory />
}
