import createMiddleware from "next-intl/middleware"
import { NextRequest, NextResponse } from "next/server"
import { resolveFractionPageRoute } from "@/lib/fraction-page-route"
import { routing } from "./app/i18n/routing"

const handleLocaleRouting = createMiddleware(routing)

export default function proxy(request: NextRequest) {
  const fractionMatch = request.nextUrl.pathname.match(/^\/tools\/as-a-decimal\/([^/]+)$/)
  const fractionRoute = fractionMatch
    ? resolveFractionPageRoute({ locale: "en", slug: fractionMatch[1] })
    : null
  // Redirect aliases before rendering to keep a single Location header on cold requests.
  if (fractionRoute?.isWhitelisted && !fractionRoute.isCanonical) {
    return NextResponse.redirect(new URL(fractionRoute.canonicalPath, request.url), 308)
  }
  return handleLocaleRouting(request)
}

export const config = {
  // 优化匹配器以减少 Edge Proxy 调用
  // 排除静态资源、API 路由、已缓存的路径等
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - love (love page)
     * - blog (blog pages)
     * - privacy (privacy page)
     * - tags (tags pages)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - _vercel (Vercel internal)
     * - favicon.ico, robots.txt, sitemap.xml (static files)
     * - files with extensions (images, fonts, etc.)
     */
    "/((?!og/|api|love|blog|terms|privacy|tags|_next/static|_next/image|_vercel|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
}
