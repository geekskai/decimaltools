import { getTranslations } from "next-intl/server"
import Link from "next/link"
import HexaToDecimalConverter from "./components/HexaToDecimalConverter"

export default async function HexaToDecimalPage() {
  const t = await getTranslations("HexaToDecimal")

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:space-y-8 md:px-6 md:py-8 lg:px-8">
        <header className="space-y-4 text-center md:space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200 md:gap-3 md:px-4 md:py-2 md:text-sm">
            <span>🖥️</span>
            <span>{t("badge")}</span>
          </div>
          <h1 className="mx-auto max-w-7xl bg-gradient-to-r from-cyan-200 via-blue-100 to-purple-200 bg-clip-text text-3xl font-bold leading-tight text-transparent md:text-5xl">
            {t("h1")}
          </h1>
          <p className="mx-auto max-w-7xl text-sm leading-7 text-slate-300 md:text-lg">{t("intro")}</p>
        </header>

        <section className="rounded-3xl border border-white/10 bg-slate-900/40 p-5 md:p-6">
          <h2 className="text-lg font-semibold text-white md:text-xl">{t("quick_answer.title")}</h2>
          <p className="mt-2 text-sm leading-7 text-slate-300 md:text-base">{t("quick_answer.body")}</p>
        </section>

        <HexaToDecimalConverter />

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-5 md:p-6">
            <h2 className="text-xl font-semibold text-cyan-100">{t("geo_sections.core_facts.title")}</h2>
            <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-200 md:text-base">
              <li>{t("geo_sections.core_facts.fact_1")}</li>
              <li>{t("geo_sections.core_facts.fact_2")}</li>
              <li>{t("geo_sections.core_facts.fact_3")}</li>
              <li>{t("geo_sections.core_facts.fact_4")}</li>
            </ul>
          </article>
          <article className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-5 md:p-6">
            <h2 className="text-xl font-semibold text-emerald-100">{t("geo_sections.how_it_works.title")}</h2>
            <ol className="mt-3 space-y-2 text-sm leading-7 text-slate-200 md:text-base">
              <li>{t("geo_sections.how_it_works.step_1")}</li>
              <li>{t("geo_sections.how_it_works.step_2")}</li>
              <li>{t("geo_sections.how_it_works.step_3")}</li>
              <li>{t("geo_sections.how_it_works.step_4")}</li>
            </ol>
          </article>
        </section>

        <section className="rounded-3xl border border-purple-500/20 bg-purple-500/10 p-5 md:p-6">
          <h2 className="text-xl font-semibold text-purple-100">{t("geo_sections.use_cases.title")}</h2>
          <ul className="mt-3 grid gap-2 text-sm leading-7 text-slate-200 md:grid-cols-2 md:text-base">
            <li>{t("geo_sections.use_cases.case_1")}</li>
            <li>{t("geo_sections.use_cases.case_2")}</li>
            <li>{t("geo_sections.use_cases.case_3")}</li>
            <li>{t("geo_sections.use_cases.case_4")}</li>
          </ul>
        </section>

        <section className="rounded-3xl border border-orange-500/20 bg-orange-500/10 p-5 md:p-6">
          <h2 className="text-xl font-semibold text-orange-100">{t("geo_sections.limitations.title")}</h2>
          <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-200 md:text-base">
            <li>{t("geo_sections.limitations.item_1")}</li>
            <li>{t("geo_sections.limitations.item_2")}</li>
            <li>{t("geo_sections.limitations.item_3")}</li>
          </ul>
        </section>

        <section className="rounded-3xl border border-white/10 bg-slate-900/40 p-5 md:p-6">
          <h2 className="text-xl font-semibold text-white">{t("geo_sections.faq.title")}</h2>
          <div className="mt-4 space-y-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <article key={index} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <h3 className="text-sm font-semibold text-slate-100 md:text-base">
                  {t(`geo_sections.faq.question_${index + 1}`)}
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-300 md:text-base">
                  {t(`geo_sections.faq.answer_${index + 1}`)}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-slate-900/40 p-5 md:p-6">
          <h2 className="text-xl font-semibold text-white">{t("geo_sections.data_sources.title")}</h2>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link
              href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt"
              target="_blank"
              className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-xs text-cyan-100 transition hover:border-cyan-400 hover:text-white md:text-sm"
            >
              {t("geo_sections.data_sources.source_1")}
            </Link>
            <Link
              href="https://en.wikipedia.org/wiki/Two%27s_complement"
              target="_blank"
              className="rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-xs text-purple-100 transition hover:border-purple-400 hover:text-white md:text-sm"
            >
              {t("geo_sections.data_sources.source_2")}
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
