# DecimalTools Growth Plan

**Product:** DecimalTools (`decimaltools.com`)

**Status:** Approved direction

**Version:** 1.0

**Decision date:** August 12, 2026

**Planning horizon:** 8-week build followed by 30-day validation

## 1. Executive decision

DecimalTools will stop expanding as a generic calculator directory and reposition around **Workshop Math & Measurement** for machinists, fabricators, manufacturing technicians, and maintenance professionals.

The first flagship product will be **Drill Size Matcher** at the proposed route `/tools/drill-size-matcher`. It will let a user enter a measured diameter and compare the nearest nominal fractional-inch, number, letter, and metric drill sizes, including deviations and adjacent sizes.

The growth model is:

1. Use existing search demand to acquire relevant users.
2. Move them into a trustworthy, repeatable professional workflow.
3. Create useful outputs that can be copied, printed, or exported.
4. Distribute a branded free embed through relevant partner sites.
5. Monetize validated demand through limited content advertising and a per-domain white-label license.

AdSense submission is not the launch milestone. It happens only after the full **AdSense Readiness Gate** passes.

## 2. Why the direction changed

### Confirmed evidence snapshot

The evidence below was collected during the August 12, 2026 planning session. Dashboard data is a point-in-time snapshot and must be refreshed before using it as a later baseline.

- Search Console, May 10–August 9, 2026: **200 clicks, 58,435 impressions, 0.3% CTR, average position 28.1**.
- The strongest current page was `/tools/convert-inches-to-decimal` with **57 clicks and 7,527 impressions**.
- Other relevant pages already receiving clicks included gauge-to-decimal, decimal-to-inches, decimal-to-millimeter, and millimeters-to-decimal.
- `/tools/fraction-to-decimal` produced **15,492 impressions but only 10 clicks**, indicating visibility without a sufficiently strong result or intent match.
- The repository contained approximately **12 tools, about 110 fraction pSEO pages, and one MDX article** at the time of review.
- The live site contained unverified scale or social-proof claims, including `25K+ Happy Users` and structured data claiming `50+` tools despite the smaller observed catalog.
- The current gauge tolerance logic used broad thickness-only values while presenting them as standard manufacturing tolerance, even though applicable tolerances depend on material, product form, width, and governing specification.
- In the inspected AdSense account, `decimaltools.com` was not listed under Sites. It therefore had not been rejected in that account; it had not yet been submitted. A separate site in the account showed a `Low value content` issue.
- Professional-community research showed recurring needs around conversions, drill and tap sizes, thread dimensions, trigonometry, RPM/SFM, feeds, and niche measurement references. Community rules also make unsolicited surveys, advertising, and AI-generated posts an unsuitable primary distribution method.

### Strategic implication

The site has enough search exposure to reveal a useful professional measurement wedge, but not enough unique product and editorial value to justify continued broad pSEO expansion. The priority is to make one defensible workflow excellent, then use existing relevant pages as acquisition surfaces.

## 3. Product boundaries

### v1 includes

- A mobile-first Drill Size Matcher.
- Fractional-inch, number, letter, and metric nominal drill sizes.
- Nearest match, deviation, equivalent dimensions, and adjacent-size comparison.
- An optional tolerance entered by the user.
- A result stating whether the deviation is inside that user-entered tolerance.
- Local-only history and preferences.
- Copy, print, and basic CSV export.
- Visible data source, scope, dataset version, verification date, and correction contact.
- Anonymous journey analytics that exclude measurement values.

### v1 explicitly excludes

- Tap-drill or thread recommendations.
- Gauge or AWG data inside the flagship matcher.
- Claims that a match is safe, suitable, or an approved substitute.
- Accounts, cloud sync, projects, teams, seats, or shared history.
- APIs, custom development, traffic-based plans, or enterprise features.
- Offline/PWA promises.
- Multilingual routes or automated translation.
- New generic calculator categories or bulk pSEO generation.

Gauge and AWG pages may remain acquisition pages only after their sources, terminology, and calculation boundaries are audited. They are not part of the Drill Reference Set.

## 4. Primary user and job

The primary user is a **Shop Professional** working in a shop-floor or field context, often on a phone and sometimes with limited time or dexterity.

The core job is:

> Given a measured diameter, show the nearest known nominal drill sizes across common systems, quantify the difference, reveal neighboring choices, and let me record or export the comparison without implying a machining recommendation.

The public product name is **Drill Size Matcher**. **Shop Measurement Workspace** remains an internal model for a future multi-workflow product and must not obscure the first product's concrete purpose.

## 5. Experience and information architecture

### Primary flow

```mermaid
flowchart LR
    A["Enter measured diameter"] --> B["Match standard drill sizes"]
    B --> C["Compare nearest and adjacent sizes"]
    C --> D["Optionally check user tolerance"]
    D --> E["Save locally, copy, print, or export CSV"]
```

### Mobile requirements

- The input and primary result must be visible in the first useful mobile viewport.
- Primary touch targets must be at least 44 by 44 CSS pixels.
- Numeric entry and unit switching must work quickly with a mobile keyboard.
- Results must use high contrast and a clear hierarchy.
- Core matching must run locally and remain usable without waiting for a server calculation.
- Ads must never appear inside the input, result, comparison, or tolerance workflow.

### Site structure

- **Home:** Lead directly to Drill Size Matcher.
- **Measure & Match:** Flagship workflow and closely related measurement tools.
- **Drill Reference:** The four drill-size systems and professional guides.
- **Gauge & Materials:** Audited acquisition pages; not part of the matcher dataset.
- **Time & Payroll:** Existing utilities in maintenance mode.
- **Developer Utilities:** Existing utilities in maintenance mode.

The homepage primary CTA should be **Match a Drill Size**. The positioning line should communicate measurement and drill-size references for real shop work. DecimalTools remains the brand and `decimaltools.com` remains the domain.

## 6. Data and trust model

### Reference Dataset Version

Every Drill Reference Set release must record:

- source or governing reference;
- standard or publication version where applicable;
- included and excluded scope;
- date verified;
- raw nominal reference value;
- displayed inch and millimeter conversions;
- transformation and rounding rules;
- regression-test result;
- reviewer and change summary.

Use the exact relationship **1 inch = 25.4 millimeters** for conversions. Raw reference values and displayed conversions must remain separate so presentation rounding cannot silently alter matching behavior.

Dataset updates require a reviewed diff and a new version. They must never silently overwrite prior values.

### Claims and boundaries

- Use “nearest nominal size” rather than “recommended substitute.”
- Only report “inside tolerance” when the user has entered the tolerance.
- Do not invent or infer a standard tolerance.
- State that suitability depends on the material, operation, equipment, process, and applicable specification.
- Remove fabricated or unverified user counts, tool counts, ratings, testimonials, review schema, and professional credentials.
- Attribute a named professional reviewer only after a real review has occurred.

## 7. Acquisition-page governance

Each existing indexable URL must enter one of four queues using a reproducible 90-day Search Console snapshot.

| Queue              | Decision rule                                                                                                                                                | Action                                                                |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| Enhance            | At least one click, or at least 300 impressions; relevant to measurement, drills, or material reference; capable of unique examples, data, or workflow value | Retain URL and strengthen it                                          |
| Merge and redirect | Search intent substantially duplicates a stronger page                                                                                                       | Consolidate useful content and issue a 301 to the canonical page      |
| Noindex            | No confirmed demand, highly templated content, and weak relevance to the new position                                                                        | Remove from sitemap and add `noindex`; do not use it as an ad surface |
| Observe            | Insufficient data but strong strategic relevance                                                                                                             | Keep stable for one complete 90-day observation period                |

Operational rules:

- Existing URLs with meaningful clicks default to enhancement, not renaming.
- Process no more than 20% of indexable URLs in one batch.
- Observe Search Console for 14–28 days after each batch before continuing.
- The sitemap must contain only canonical, indexable URLs returning HTTP 200.
- Do not create replacement pSEO pages merely to preserve URL count.

The current `docs/PRD.md` describes an earlier generic math and large-scale pSEO strategy. It is retained as historical context but is superseded by this growth plan for product positioning, roadmap, indexation, and monetization decisions.

## 8. Editorial plan

The first eight English guides form one focused topic cluster.

### Core workflow guides

1. How to Find the Nearest Standard Drill Size from a Measured Diameter
2. Fractional, Number, Letter, and Metric Drill Sizes Explained
3. How to Convert Decimal Inches, Fractions, and Millimeters Accurately
4. Size Deviation, User Tolerance, and Why “Nearest” Does Not Mean “Suitable”

### Reference guides

5. Fractional Drill Sizes: Reference Chart and Worked Examples
6. Number Drill Sizes #1–#80: Reference and Neighbor Comparisons
7. Letter Drill Sizes A–Z: Reference and Neighbor Comparisons
8. Metric Drill Sizes: Reference and Inch Comparisons

Every guide must include:

- a real professional task;
- worked calculations or comparisons;
- original explanatory text and useful tables or diagrams;
- primary or authoritative sources;
- clear separation of standard facts, calculated values, and shop practice;
- scope and limitations;
- author or editor identity without invented expertise;
- review date, dataset version where relevant, and correction contact;
- a contextual path into Drill Size Matcher.

No guide should be split into thin pages solely to target keyword variants.

## 9. Distribution plan

### Primary channels

1. **Organic search:** Improve relevant pages already receiving impressions and connect them to Drill Size Matcher.
2. **Professional content:** Publish the eight source-driven guides.
3. **Embed partnerships:** Contact an initial list of 20 machining blogs, training sites, tool suppliers, and resource directories with a useful branded free embed.
4. **Technical demos:** Publish short videos showing real inputs, comparisons, and exports without exaggerated claims.

### Community boundary

Reddit and similar communities are research and reputation channels, not launch-blast channels. Participation must follow each community's rules. Do not post surveys, ads, fabricated shop stories, or AI-generated promotional content where prohibited. Ask moderators when the promotional boundary is unclear.

Paid acquisition and Product Hunt are not primary v1 channels.

## 10. Measurement and privacy

Allowed anonymous events:

- `workspace_view`
- `match_started`
- `match_completed`
- `neighbor_compared`
- `tolerance_checked`
- `record_saved`
- `result_copied`
- `result_printed`
- `csv_exported`
- `cross_day_repeat`

Allowed properties are limited to tool version, coarse unit type, success or failure, and an anonymous session identifier.

Never collect actual measurements, tolerance values, Measurement Records, local history, exported files, or browser fingerprints. Cross-day reuse must be measured with a privacy-respecting anonymous mechanism and documented before release.

## 11. Validation gate

The 30-day validation window begins only when the launch acceptance criteria in section 13 pass.

The workflow is validated only if all of these conditions are met within that window:

- at least **500 valid Drill Size Matcher visits**;
- at least **150 completed matches**;
- at least **30 users returning on different days**;
- at least **20 copy, print, or CSV export actions**;
- at least **5 substantive feedback items from target professionals**;
- **zero confirmed calculation errors**.

Before launch, document bot filtering, internal-traffic exclusion, event deduplication, and the definition of a valid visit. A confirmed calculation error blocks expansion even if all volume thresholds pass.

If validation fails, diagnose the constrained stage—qualified traffic, match completion, reuse, export, feedback, or accuracy. Do not respond by adding unrelated calculators.

## 12. Monetization

### AdSense

Advertising is secondary to the professional workflow.

- No ads in the matcher input, primary result, neighbor comparison, tolerance, or export surfaces.
- No ads on the homepage, navigation pages, empty states, error pages, or low-value pages.
- Only quality-approved acquisition pages and guides may carry limited in-content placements.
- Avoid overlays, deceptive buttons, layout shifts, and placements likely to cause accidental taps.
- Add and verify `ads.txt` only after the site is added to AdSense.
- Submit once after the complete readiness gate passes; if rejected, inspect the actual reason before making another submission.

### Embed and white-label

Build this only after the workflow passes 30-day validation.

**Free Embed**

- no account required;
- `Powered by DecimalTools` attribution;
- standard theme;
- personal and commercial embedding allowed;
- no SLA or custom support.

**White-label License**

- `$19/month/domain` or `$190/year/domain`;
- removes DecimalTools attribution;
- color, light/dark mode, and default-unit customization;
- defined browser compatibility and email support;
- no seats, traffic analytics, API, or custom development;
- the first 10 paying domains retain their original price while their subscriptions remain active and in good standing.

A future reproducible public link may include only user-chosen inputs. It should be built only after copy, print, or CSV behavior demonstrates real sharing demand.

## 13. Eight-week execution plan

| Period       | Deliverable                                                                  | Acceptance criteria                                                                                                                                                               |
| ------------ | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Week 1       | Source registry, Drill Reference Set v1, calculation contract, test baseline | All four drill systems have documented scope and sources; exact conversion and matching rules are specified; golden cases pass                                                    |
| Weeks 2–4    | Drill Size Matcher core workflow                                             | Measurement input, unit handling, nearest match, neighbors, deviation, optional user tolerance, local history, copy, print, and CSV work on supported mobile and desktop browsers |
| Week 5       | Product-quality pass                                                         | Mobile first viewport is task-first; accessibility checks pass; anonymous events contain no prohibited values; error and regression cases pass                                    |
| Week 6       | Positioning and controlled migration preparation                             | Homepage and navigation changes are ready; every current indexable URL is classified; no bulk URL changes ship without a recorded batch and baseline                              |
| Weeks 7–8    | Editorial and trust layer                                                    | Eight guides, source/method page, About, Contact, Privacy, Terms, correction route, and truthful structured data are complete; release checklist passes                           |
| Next 30 days | Validation                                                                   | Only blocker fixes and measurement corrections; collect the section 11 metrics without expanding scope                                                                            |

Single-person execution is the planning baseline. Product, implementation, SEO, and editorial assembly may be completed by the owner with Codex. A paid professional review of dataset accuracy and boundaries is desirable but not a launch dependency; without one, the site must describe the review status truthfully.

## 14. Launch acceptance criteria

### Product and data

- Drill Size Matcher completes the full v1 flow.
- All four drill systems are source-traceable and versioned.
- Golden, boundary, unit-conversion, tie, and malformed-input tests pass.
- The user can inspect sources, version, scope, and limitations.
- No known confirmed calculation error remains open.

### Experience

- The primary mobile viewport presents the task rather than a large marketing hero.
- Keyboard-only operation, accessible names, focus visibility, error announcement, and contrast have been checked.
- Touch targets meet the agreed minimum.
- Copy, print, CSV, and local-history behavior have been tested without an account.
- No known Poor Core Web Vitals URL group remains in Search Console before AdSense submission.

### Content and trust

- Eight guides meet the editorial requirements.
- Sources, methods, revision dates, and correction contact are public.
- About, Contact, Privacy, and Terms accurately describe the product.
- Unsupported user counts, tool counts, ratings, reviews, and credentials are removed.
- Structured data matches visible content and actual product capabilities.

### Search and advertising

- Every sitemap URL is canonical, indexable, valuable, and returns HTTP 200.
- Broken links, soft 404s, conflicting canonicals, and accidental index blocks are resolved.
- Acquisition-page classifications and migration batches are recorded.
- Ads are excluded from prohibited surfaces.
- AdSense is not submitted until every item above passes.

## 15. Decision rules after validation

| Outcome                                             | Decision                                                                                                                                   |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| All validation thresholds pass                      | Build the branded free embed, then the white-label license                                                                                 |
| Qualified traffic is low but completion is healthy  | Improve relevant acquisition pages, guides, demonstrations, and partner distribution                                                       |
| Completion is low                                   | Repair input clarity, unit handling, result hierarchy, speed, or error recovery                                                            |
| Completion is healthy but reuse/export is low       | Interview target professionals and improve the usefulness of records and comparison outputs                                                |
| Any confirmed calculation error occurs              | Stop expansion, correct the dataset or algorithm, publish the correction, and restart the accuracy observation                             |
| Demand consistently points to one adjacent workflow | Consider that workflow only after the current validation diagnosis is complete; tap/thread remains the leading candidate, not a commitment |

## 16. Known unknowns

- The current Search Console snapshot is small and must not be treated as stable market sizing.
- AdSense approval is not guaranteed even after the readiness gate passes.
- The best-performing partner category for embeds is unproven.
- White-label willingness to pay is a hypothesis until real domains purchase.
- Cross-day reuse measurement requires a final privacy and implementation review.
- A professional reviewer has not yet been engaged.

These unknowns are validation work, not reasons to broaden v1.

## 17. Source baseline

The implementation must record the exact editions and pages actually used. Initial authoritative source families include:

- NIST guidance for SI and inch–millimeter conversion.
- ASME B94.11M for twist-drill nomenclature, sizes, and tolerances where applicable.
- ASTM B258 for AWG nominal conductor diameters; AWG remains outside Drill Size Matcher v1.
- Applicable ASTM sheet-product specifications for gauge-related pages; do not use one thickness-only tolerance as a universal standard.
- Google AdSense program and publisher policies for valuable content, navigation, ad placement, and non-content screens.

This section identifies source families, not permission to copy proprietary tables or standards. Confirm licensing and quotation limits before publishing source-derived material.
