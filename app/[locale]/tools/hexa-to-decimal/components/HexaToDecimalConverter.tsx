"use client"

import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import {
  convertHexToOmniResult,
  toggleBit,
  valueToFixedHex,
  type BitDepth,
  type EndianMode,
} from "../utils"

const BIT_OPTIONS: BitDepth[] = [8, 16, 32, 64]
const ENDIAN_OPTIONS: EndianMode[] = ["big", "little"]
const EXAMPLES = ["FF", "FFFE", "7FFFFFFF", "48 65 6C 6C 6F", "FF5733"]

export default function HexaToDecimalConverter() {
  const t = useTranslations("HexaToDecimal.converter")
  const [input, setInput] = useState("FF")
  const [bitDepth, setBitDepth] = useState<BitDepth>(16)
  const [endian, setEndian] = useState<EndianMode>("big")
  const [copyMessage, setCopyMessage] = useState("")

  const result = useMemo(() => convertHexToOmniResult(input, bitDepth, endian), [input, bitDepth, endian])

  const copyValue = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopyMessage(t("copied"))
      setTimeout(() => setCopyMessage(""), 1600)
    } catch {
      setCopyMessage(t("copy_failed"))
    }
  }

  const onFlipBit = (index: number) => {
    if (!result.ok) return
    const nextValue = toggleBit(result.value.maskedValue, bitDepth, index)
    setInput(valueToFixedHex(nextValue, bitDepth))
  }

  return (
    <section className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/18 via-blue-500/8 to-purple-500/18 p-4 shadow-lg md:p-6">
      <div className="space-y-5 md:space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-cyan-400/30 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 px-4 py-2 md:gap-3 md:px-5 md:py-2.5">
            <span className="text-2xl">🧠</span>
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
                  onChange={(event) => setInput(event.target.value)}
                  placeholder={t("placeholder")}
                  className="h-12 w-full rounded-2xl border border-cyan-500/30 bg-slate-950/80 px-4 font-mono text-sm text-cyan-100 placeholder-slate-500 transition-all duration-300 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 md:text-base"
                />
                <p className="mt-2 text-xs text-slate-400 md:text-sm">{t("helper")}</p>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-slate-200">{t("examples_title")}</p>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLES.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setInput(item)}
                      className="rounded-full border border-cyan-500/30 bg-slate-950/60 px-3 py-1.5 text-xs text-cyan-100 transition hover:border-cyan-400 hover:bg-cyan-500/10"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-slate-200">{t("bit_depth_label")}</p>
                <div className="grid grid-cols-4 gap-2">
                  {BIT_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setBitDepth(option)}
                      className={`rounded-xl border px-2 py-2 text-xs transition ${
                        bitDepth === option
                          ? "border-cyan-300 bg-cyan-500/20 text-white"
                          : "border-cyan-500/30 bg-slate-950/60 text-cyan-100 hover:border-cyan-400"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-slate-200">{t("endian_label")}</p>
                <div className="grid grid-cols-2 gap-2">
                  {ENDIAN_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setEndian(option)}
                      className={`rounded-xl border px-2 py-2 text-xs transition ${
                        endian === option
                          ? "border-cyan-300 bg-cyan-500/20 text-white"
                          : "border-cyan-500/30 bg-slate-950/60 text-cyan-100 hover:border-cyan-400"
                      }`}
                    >
                      {t(`endian_${option}`)}
                    </button>
                  ))}
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
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    {t("decimal_label")}
                  </p>
                  <p className="mt-1 text-xl font-bold text-white md:text-2xl">{result.value.unsignedDecimal}</p>
                  <p className="mt-1 text-xs text-slate-300">
                    {t("signed_label")}: {result.value.signedDecimal}
                  </p>
                  {result.value.bitDepthOverflow ? (
                    <p className="mt-2 text-xs text-amber-200">{t("overflow_hint")}</p>
                  ) : null}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                      {t("binary_label")}
                    </p>
                    <p className="mt-1 font-mono text-xs text-slate-100">{result.value.binaryGrouped}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                      {t("octal_label")}
                    </p>
                    <p className="mt-1 font-mono text-sm text-slate-100">{result.value.octal}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                      {t("ascii_label")}
                    </p>
                    <p className="mt-1 font-mono text-sm text-slate-100">{result.value.asciiPreview}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                      {t("utf8_label")}
                    </p>
                    <p className="mt-1 font-mono text-sm text-slate-100">{result.value.utf8Preview}</p>
                  </div>
                </div>

                {result.value.colorHex ? (
                  <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                      {t("color_preview_label")}
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="h-8 w-8 rounded border border-white/20" style={{ backgroundColor: result.value.colorHex }} />
                      <p className="text-sm text-slate-100">
                        {result.value.colorHex} · {result.value.rgbPreview}
                      </p>
                    </div>
                  </div>
                ) : null}

                <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    {t("bit_flip_label")}
                  </p>
                  <div className="mt-2 grid grid-cols-8 gap-1 md:grid-cols-16">
                    {result.value.binaryGrouped.replace(/\s/g, "").split("").map((bit, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => onFlipBit(index)}
                        className={`rounded border px-1 py-1 text-[10px] transition ${
                          bit === "1"
                            ? "border-cyan-300 bg-cyan-500/25 text-white"
                            : "border-slate-600 bg-slate-900/80 text-slate-300"
                        }`}
                      >
                        {bit}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => copyValue(result.value.unsignedDecimal)}
                    className="rounded-xl border border-white/15 bg-slate-900/50 px-3 py-2 text-xs text-slate-100 transition hover:bg-slate-800"
                  >
                    {t("copy_decimal")}
                  </button>
                  <button
                    type="button"
                    onClick={() => copyValue(result.value.displayHex)}
                    className="rounded-xl border border-white/15 bg-slate-900/50 px-3 py-2 text-xs text-slate-100 transition hover:bg-slate-800"
                  >
                    {t("copy_hex_array")}
                  </button>
                  <button
                    type="button"
                    onClick={() => copyValue(`0x${result.value.normalizedHex}`)}
                    className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-500/20"
                  >
                    {t("copy_c_style")}
                  </button>
                </div>
                {copyMessage ? <p className="text-xs text-slate-300">{copyMessage}</p> : null}
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
