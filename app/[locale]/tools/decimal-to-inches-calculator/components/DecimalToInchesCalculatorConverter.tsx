"use client"

import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import {
  convertDecimalToInches,
  normalizeDecimalInput,
  type FractionPrecision,
  type RoundingMode,
} from "../utils"

const PRECISION_OPTIONS: FractionPrecision[] = [4, 8, 16, 32, 64]
const ROUNDING_OPTIONS: RoundingMode[] = ["nearest", "up", "down"]
const EXAMPLES = ["0.3125", "0.75", "0.32", "1.125", "14.5", "25.9375"]

export default function DecimalToInchesCalculatorConverter() {
  const t = useTranslations("DecimalToInchesCalculator.converter")
  const [input, setInput] = useState("0.3125")
  const [precision, setPrecision] = useState<FractionPrecision>(16)
  const [roundingMode, setRoundingMode] = useState<RoundingMode>("nearest")
  const [copyMessage, setCopyMessage] = useState("")

  const result = useMemo(
    () => convertDecimalToInches(input, precision, roundingMode),
    [input, precision, roundingMode]
  )

  const copyOutput = async (type: "exact" | "nearest" | "feet") => {
    if (!result.ok) return
    const text =
      type === "exact"
        ? result.value.exactFraction.label
        : type === "nearest"
          ? result.value.nearestFraction.label
          : result.value.feetInchLabel

    try {
      await navigator.clipboard.writeText(text)
      setCopyMessage(t("copied"))
      setTimeout(() => setCopyMessage(""), 1800)
    } catch {
      setCopyMessage(t("copy_failed"))
    }
  }

  const onInputChange = (value: string) => {
    setInput(normalizeDecimalInput(value))
  }

  return (
    <section className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/18 via-blue-500/8 to-purple-500/18 p-4 shadow-lg md:p-6">
      <div className="space-y-5 md:space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-cyan-400/30 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 px-4 py-2 md:gap-3 md:px-5 md:py-2.5">
            <span className="text-2xl">📐</span>
            <h2 className="bg-gradient-to-r from-cyan-300 via-blue-200 to-purple-300 bg-clip-text text-xl font-bold text-transparent md:text-2xl">
              {t("title")}
            </h2>
          </div>
          <p className="mx-auto mt-3 max-w-5xl text-xs leading-6 text-slate-300 md:mt-4 md:text-base">
            {t("description")}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 md:items-stretch">
          <div className="rounded-2xl border border-cyan-500/20 bg-slate-950/45 p-3.5 md:p-5">
            <div className="flex h-full flex-col gap-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-cyan-100">{t("input_label")}</label>
                <input
                  value={input}
                  onChange={(event) => onInputChange(event.target.value)}
                  placeholder={t("placeholder")}
                  className="h-12 w-full rounded-2xl border border-cyan-500/30 bg-slate-950/70 px-4 text-sm text-white placeholder-slate-500 transition-all duration-300 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 md:text-base"
                  inputMode="decimal"
                  aria-label={t("input_label")}
                />
                <p className="mt-2 text-xs text-slate-400 md:text-sm">{t("helper")}</p>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-slate-200">{t("examples_title")}</p>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLES.map((example) => (
                    <button
                      key={example}
                      type="button"
                      onClick={() => setInput(example)}
                      className="rounded-full border border-cyan-500/30 bg-slate-950/60 px-3.5 py-2 text-xs text-cyan-100 transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-500/10 hover:text-white md:px-4 md:py-2 md:text-sm"
                    >
                      {example}"
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-sm font-semibold text-slate-200">{t("precision_label")}</p>
                  <div className="grid grid-cols-3 gap-2">
                    {PRECISION_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setPrecision(option)}
                        className={`rounded-xl border px-2 py-2 text-xs transition ${
                          precision === option
                            ? "border-cyan-300 bg-cyan-500/20 text-white"
                            : "border-cyan-500/30 bg-slate-950/60 text-cyan-100 hover:border-cyan-400"
                        }`}
                      >
                        1/{option}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-sm font-semibold text-slate-200">{t("rounding_mode_label")}</p>
                  <div className="grid grid-cols-3 gap-2">
                    {ROUNDING_OPTIONS.map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setRoundingMode(mode)}
                        className={`rounded-xl border px-2 py-2 text-xs transition ${
                          roundingMode === mode
                            ? "border-cyan-300 bg-cyan-500/20 text-white"
                            : "border-cyan-500/30 bg-slate-950/60 text-cyan-100 hover:border-cyan-400"
                        }`}
                      >
                        {t(`rounding_${mode}`)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/12 to-teal-500/8 p-3.5 md:p-5">
            <p className="pb-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200 md:text-sm md:tracking-[0.18em]">
              {t("result_label")}
            </p>

            {result.ok ? (
              <div className="space-y-3">
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 md:text-xs md:tracking-[0.16em]">
                    {t("exact_fraction_label")}
                  </p>
                  <div className="mt-2 flex items-center gap-3">
                    <p className="text-2xl font-bold text-white md:text-4xl">{result.value.exactFraction.whole}</p>
                    {result.value.exactFraction.numerator ? (
                      <span className="inline-flex flex-col items-center text-lg leading-tight text-cyan-100 md:text-2xl">
                        <span>{result.value.exactFraction.numerator}</span>
                        <span className="h-px w-8 bg-cyan-200/70" />
                        <span>{result.value.exactFraction.denominator}</span>
                      </span>
                    ) : null}
                    <p className="text-lg text-slate-200 md:text-2xl">"</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 md:text-xs md:tracking-[0.16em]">
                      {t("nearest_fraction_label")}
                    </p>
                    <p className="mt-1.5 text-base text-slate-100 md:text-lg">
                      {result.value.nearestFraction.label}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 md:text-xs md:tracking-[0.16em]">
                      {t("offset_label")}
                    </p>
                    <p className="mt-1.5 text-base text-slate-100 md:text-lg">
                      {result.value.nearestOffsetLabel}" {t("offset_suffix")}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 md:text-xs md:tracking-[0.16em]">
                    {t("feet_inch_label")}
                  </p>
                  <p className="mt-1.5 text-base text-slate-100 md:text-lg">{result.value.feetInchLabel}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 md:text-xs md:tracking-[0.16em]">
                    {t("ruler_title")}
                  </p>
                  <div className="mt-3 rounded-xl border border-white/10 bg-slate-900/70 px-3 py-3">
                    <div className="relative h-6">
                      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-cyan-400/50" />
                      {Array.from({ length: precision + 1 }).map((_, index) => (
                        <div
                          key={index}
                          className="absolute top-1/2 h-3 w-px -translate-y-1/2 bg-white/25"
                          style={{ left: `${(index / precision) * 100}%` }}
                        />
                      ))}
                      <div
                        className="absolute bottom-0 top-0 w-0.5 bg-rose-300"
                        style={{ left: `${result.value.rulerMarkerPercent}%` }}
                      />
                    </div>
                    <div className="mt-1 flex justify-between text-[11px] text-slate-400">
                      <span>{result.value.rulerStart}"</span>
                      <span>{result.value.rulerEnd}"</span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => copyOutput("exact")}
                    className="rounded-xl border border-white/15 bg-slate-900/50 px-3 py-2 text-xs text-slate-100 transition hover:bg-slate-800 md:text-sm"
                  >
                    {t("copy_exact")}
                  </button>
                  <button
                    type="button"
                    onClick={() => copyOutput("nearest")}
                    className="rounded-xl border border-white/15 bg-slate-900/50 px-3 py-2 text-xs text-slate-100 transition hover:bg-slate-800 md:text-sm"
                  >
                    {t("copy_nearest")}
                  </button>
                  <button
                    type="button"
                    onClick={() => copyOutput("feet")}
                    className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-500/20 md:text-sm"
                  >
                    {t("copy_feet_inch")}
                  </button>
                </div>

                {copyMessage ? <p className="text-xs text-slate-300 md:text-sm">{copyMessage}</p> : null}
              </div>
            ) : (
              <div className="mt-2 flex min-h-[11rem] items-center rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-xs text-slate-300 md:min-h-[12rem] md:p-5 md:text-sm">
                {t(result.error)}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
