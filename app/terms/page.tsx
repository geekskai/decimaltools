import PageSchema from "@/components/PageSchema"
import { genPageMetadata } from "app/seo"
import React from "react"
import Link from "@/components/Link"

export const metadata = genPageMetadata({
  path: "/terms",
  title: "DecimalTools Terms of Service | Free Online Calculators and Converters",
  description:
    "Read the DecimalTools Terms of Service for its free math, measurement, time, and character-code calculators and converters.",
})

const SITE_URL = "https://decimaltools.com"
const LAST_UPDATED = "April 12, 2026"

export default function TermsOfServicePage() {
  return (
    <>
      <PageSchema
        path="/terms"
        name="Terms of Service"
        description={String(metadata.description)}
        type="WebPage"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Terms", path: "/terms" },
        ]}
      />
      <div className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
        <article className="mx-auto max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl">
          <div className="px-6 py-8 sm:px-8">
            <header className="mb-10 text-center">
              <h1 className="mb-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                DecimalTools Terms of Service
              </h1>
              <p className="text-sm uppercase tracking-wide text-gray-500">
                <strong className="font-semibold text-gray-700">Last updated:</strong>{" "}
                {LAST_UPDATED}
              </p>
            </header>

            <div className="mb-10 rounded-lg border-l-4 border-primary-500 bg-gray-50 p-6 text-gray-800 shadow-sm">
              <h2 className="mb-3 text-xl font-bold text-gray-900">
                Our Core Promise: 100% Free Service
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                DecimalTools provides free online calculators and converters for fractions,
                measurements, time, and character codes. These Terms describe use of the site and
                its tools.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Support Contact:</strong>{" "}
                <Link
                  href="mailto:postmaster@decimaltools.com"
                  className="font-medium text-primary-600 transition-colors hover:text-primary-500 hover:underline"
                  aria-label="Email DecimalTools Support"
                >
                  postmaster@decimaltools.com
                </Link>
              </p>
            </div>

            <div className="space-y-6 leading-relaxed text-gray-700">
              <p>
                By accessing our website located at{" "}
                <Link
                  href={SITE_URL}
                  className="font-medium text-primary-600 hover:text-primary-500"
                  rel="noopener noreferrer"
                >
                  {SITE_URL}
                </Link>{" "}
                (the &quot;Service&quot;), you assume full acceptance of these terms and conditions.
                Do not continue to use DecimalTools if you do not agree to abide by all the terms
                stated on this page.
              </p>
            </div>

            <section className="mt-12" aria-labelledby="section-1">
              <h2
                id="section-1"
                className="mb-4 border-b border-gray-200 pb-2 text-2xl font-bold text-gray-900"
              >
                1. Description of Free Services
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                DecimalTools provides free online tools for fraction and decimal calculations,
                measurement and time conversions, and character-code conversions. Available tools
                and supported inputs are described on their respective pages.
              </p>
              <p className="leading-relaxed text-gray-700">
                We reserve the right to upgrade, modify, or discontinue any part of our free service
                at any time without prior notice. Our primary goal is to provide a robust, reliable,
                and continuously free user experience.
              </p>
            </section>

            <section className="mt-12" aria-labelledby="section-2">
              <h2
                id="section-2"
                className="mb-4 border-b border-gray-200 pb-2 text-2xl font-bold text-gray-900"
              >
                2. User Eligibility & Acceptance
              </h2>
              <p className="leading-relaxed text-gray-700">
                By utilizing DecimalTools's suite of free online tools, you confirm that you are at
                least 13 years of age. Use of this Service is void where prohibited. You represent
                and warrant that your access to our platform complies with all applicable local,
                state, national, and international laws and regulations.
              </p>
            </section>

            <section className="mt-12" aria-labelledby="section-3">
              <h2
                id="section-3"
                className="mb-4 border-b border-gray-200 pb-2 text-2xl font-bold text-gray-900"
              >
                3. Acceptable Use Policy
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                You agree to access the Service solely for
                legal and ethical purposes.
              </p>
              <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">
                Your Responsibilities:
              </h3>
              <ul className="mb-8 list-disc space-y-2 pl-6 text-gray-700">
                <li>
                  Using the tools for lawful purposes and checking that inputs are appropriate.
                </li>
                <li>
                  Avoiding attempts to disrupt or overload the site.
                </li>
                <li>
                  Respecting the fundamental rights of content creators, authors, and publishers.
                </li>
              </ul>
              <h3 className="mb-3 text-lg font-semibold text-gray-900">Prohibited Activities:</h3>
              <ul className="list-disc space-y-2 pl-6 text-gray-700">
                <li>
                  Leveraging the Service to pirate, illegally distribute, or infringe upon
                  copyrighted materials.
                </li>
                <li>
                  Deploying malicious bots, scrapers, or automated exploits to overload our free
                  infrastructure.
                </li>
                <li>
                  Reverse engineering, decompiling, or otherwise tampering with DecimalTools’s
                  software.
                </li>
                <li>
                  Misusing the site or interfering with its operation.
                </li>
              </ul>
            </section>

            <section className="mt-12" aria-labelledby="section-4">
              <h2
                id="section-4"
                className="mb-4 border-b border-gray-200 pb-2 text-2xl font-bold text-gray-900"
              >
                4. Intellectual Property Rights
              </h2>
              <p className="leading-relaxed text-gray-700">
                Unless otherwise stated, DecimalTools and/or its licensors own the intellectual
                property rights for all original material on this website (including branding, UI/UX
                design, text, logos, and custom code). You may access this for your own personal use
                subject to the restrictions set in these terms and conditions.
              </p>
            </section>

            <section className="mt-12" aria-labelledby="section-5">
              <h2
                id="section-5"
                className="mb-4 border-b border-gray-200 pb-2 text-2xl font-bold text-gray-900"
              >
                5. Third-Party Websites & External Content
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
              Some pages link to external references. Those sites have their own content and privacy
              practices; a link does not mean DecimalTools endorses their content.
              </p>
            </section>

            <section className="mt-12" aria-labelledby="section-6">
              <h2
                id="section-6"
                className="mb-4 border-b border-gray-200 pb-2 text-2xl font-bold text-gray-900"
              >
                6. 100% Free Service Guarantee
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                We stand by our commitment that all core features on DecimalTools are{" "}
                free to use at this time. Pricing or availability may change in the future.
              </p>
              <p className="rounded-md border border-gray-100 bg-gray-50 p-4 text-sm text-gray-600">
                * Note: While DecimalTools is entirely free to use, standard data and internet
                browsing charges from your personal network provider still apply.
              </p>
            </section>

            <section className="mt-12" aria-labelledby="section-7">
              <h2
                id="section-7"
                className="mb-4 border-b border-gray-200 pb-2 text-2xl font-bold text-gray-900"
              >
                7. Operational Limits & Fair Use
              </h2>
              <p className="leading-relaxed text-gray-700">
                We may apply reasonable technical limits to protect the site and maintain its
                operation.
              </p>
            </section>

            <section className="mt-12" aria-labelledby="section-8">
              <h2
                id="section-8"
                className="mb-4 border-b border-gray-200 pb-2 text-2xl font-bold text-gray-900"
              >
                8. Disclaimer of Warranties
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                Calculation and conversion results are provided for general informational use. For
                fraction-to-decimal conversion, the exact value is the reduced fraction; repeating
                decimal displays are rounded to the selected precision. Reference tables cover
                only their stated ranges and assumptions. Independently verify results used for
                engineering, safety, financial, or other consequential decisions.
              </p>
              <p className="mb-4 leading-relaxed text-gray-700">
                To the maximum extent permitted by applicable law, we exclude all representations,
                warranties, and conditions relating to our website. DecimalTools is provided on an{" "}
                <strong>&quot;AS IS&quot;</strong> and <strong>&quot;AS AVAILABLE&quot;</strong>{" "}
                basis.
              </p>
              <p className="leading-relaxed text-gray-700">
                We do not guarantee or warrant that the Service will remain uninterrupted,
                continuously perfectly secure, or completely error-free at all times.
              </p>
            </section>

            <section className="mt-12" aria-labelledby="section-9">
              <h2
                id="section-9"
                className="mb-4 border-b border-gray-200 pb-2 text-2xl font-bold text-gray-900"
              >
                9. Limitation of Liability
              </h2>
              <p className="leading-relaxed text-gray-700">
                Because our website, tools, and services are provided completely free of charge, we
                will not be held liable for any loss or damage of any nature. In no event shall
                DecimalTools or its operators be responsible for indirect, consequential, or
                incidental damages resulting from your use of, or inability to use, our platform.
              </p>
            </section>

            <section className="mt-12" aria-labelledby="section-10">
              <h2
                id="section-10"
                className="mb-4 border-b border-gray-200 pb-2 text-2xl font-bold text-gray-900"
              >
                10. Intellectual Property Questions
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                If you have an intellectual property concern about material on this site, contact us
                with the relevant page URL and a description of the concern.
              </p>
              <p className="leading-relaxed text-gray-700">
                Please include the relevant URL and email us directly
                at
                <Link
                  href="mailto:postmaster@decimaltools.com"
                  className="ml-1 font-medium text-primary-600 hover:text-primary-500"
                >
                  postmaster@decimaltools.com
                </Link>
                .
              </p>
            </section>

            <section className="mt-12" aria-labelledby="section-11">
              <h2
                id="section-11"
                className="mb-4 border-b border-gray-200 pb-2 text-2xl font-bold text-gray-900"
              >
                11. Modifications to Terms
              </h2>
              <p className="leading-relaxed text-gray-700">
                We maintain the right to revise or modify these Terms of Service at any given time
                to reflect new features or legal requirements. By continuing to use DecimalTools
                following the publication of any modifications, you implicitly agree to be legally
                bound by the most recent updated terms.
              </p>
            </section>

            <section className="mt-12" aria-labelledby="section-12">
              <h2
                id="section-12"
                className="mb-4 border-b border-gray-200 pb-2 text-2xl font-bold text-gray-900"
              >
                12. Governing Law
              </h2>
              <p className="leading-relaxed text-gray-700">
                These terms do not specify a governing jurisdiction. Applicable law may depend on
                the circumstances and the parties involved.
              </p>
            </section>
          </div>
        </article>
      </div>
    </>
  )
}
