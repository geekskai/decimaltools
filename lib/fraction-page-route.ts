import siteMetadata from "@/data/siteMetadata"
import {
  getPseoPath,
  getPseoSlug,
  isPseoWhitelisted,
  PSEO_ENABLED_LOCALES,
} from "@/data/pseo-fractions"
import { getFractionPageModel } from "@/lib/fraction-math"

function parsePositiveInteger(value: string): number | null {
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null
  }

  return parsed
}

function parseFractionSlug(slug: string): { numerator: number; denominator: number } | null {
  const parts = slug.split("-")
  if (parts.length !== 2) {
    return null
  }

  const numerator = parsePositiveInteger(parts[0])
  const denominator = parsePositiveInteger(parts[1])
  if (!numerator || !denominator) {
    return null
  }

  return { numerator, denominator }
}

function isEnabledLocale(locale: string): boolean {
  return PSEO_ENABLED_LOCALES.includes(locale as (typeof PSEO_ENABLED_LOCALES)[number])
}

export function getLocalizedFractionPath({
  locale,
  numerator,
  denominator,
}: {
  locale: string
  numerator: number
  denominator: number
}): string {
  const path = getPseoPath(numerator, denominator)
  return locale === "en" ? path : `/${locale}${path}`
}

export function resolveFractionPageRoute(params: { locale: string; slug: string }) {
  if (!isEnabledLocale(params.locale)) {
    return null
  }

  const pair = parseFractionSlug(params.slug)
  if (!pair) {
    return null
  }

  const model = getFractionPageModel(pair.numerator, pair.denominator)
  if (!model) {
    return null
  }

  const canonicalNumerator = model.canonicalNumerator
  const canonicalDenominator = model.canonicalDenominator
  const canonicalSlug = getPseoSlug(canonicalNumerator, canonicalDenominator)
  const isCanonical = params.slug === canonicalSlug
  const isWhitelisted = isPseoWhitelisted(canonicalNumerator, canonicalDenominator)

  const canonicalPath = getLocalizedFractionPath({
    locale: params.locale,
    numerator: canonicalNumerator,
    denominator: canonicalDenominator,
  })

  return {
    locale: params.locale,
    model,
    canonicalNumerator,
    canonicalDenominator,
    isCanonical,
    isWhitelisted,
    canonicalPath,
    canonicalUrl: `${siteMetadata.siteUrl}${canonicalPath}`,
  }
}
