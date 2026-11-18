import TOCInline from "pliny/ui/TOCInline.js"
import Pre from "pliny/ui/Pre.js"
import BlogNewsletterForm from "pliny/ui/BlogNewsletterForm.js"
import type { MDXComponents } from "mdx/types"
import Image from "@/components/Image"
import CustomLink from "@/components/Link"
import TableWrapper from "@/components/TableWrapper"

import GoogleAdUnitWrap from "@/components/GoogleAdUnitWrap"

export const components: MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  table: TableWrapper,
  BlogNewsletterForm,
  GoogleAdUnitWrap,
}
