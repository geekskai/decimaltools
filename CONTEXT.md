# DecimalTools

DecimalTools provides calculation workflows for practical measurement and shop-math tasks.

## Language

**Workshop Math & Measurement**:
The primary product domain for machinists, fabricators, woodworkers, technicians, and estimators who need practical measurement calculations.
_Avoid_: Generic calculator site, all-purpose decimal tools

**Shop Professional**:
The primary user: a machinist, fabricator, manufacturing technician, or maintenance professional making measurement and tooling decisions.
_Avoid_: General user, everyone, student

**Shop-floor Session**:
A short, mobile-first Workspace visit performed in a workshop or field environment where rapid input, high legibility, and an immediate result take priority over dense analysis.
_Avoid_: Dashboard session, desktop project

**Shop Measurement Workspace**:
The flagship product where a Shop Professional carries a measurement through related conversions, comparisons, and reusable outputs in one continuous task.
_Avoid_: Calculator collection, tools directory, converter page

**Drill Size Matcher**:
The public name of the v1 flagship product. It accepts a measured diameter and compares the closest fractional-inch, number, letter, and metric nominal drill sizes. The proposed canonical route is `/tools/drill-size-matcher`.
_Avoid_: Workspace, AI matcher, smart recommendation

**Nearest Standard Match**:
The primary Workspace result: the closest known shop size to a measured value, shown with its system, equivalent dimensions, deviation, and neighboring sizes.
_Avoid_: Conversion result, recommended substitute

**Signed Deviation**:
The nominal drill size minus the measured value. A negative value is smaller than the measurement; a positive value is larger.
_Avoid_: Error, tolerance, difference without direction

**Adjacent Nominal Size**:
The closest known nominal size strictly below or strictly above the measured value within one drill-size system. An exact match is excluded from both adjacent positions.
_Avoid_: Alternative, substitute, recommendation

**Drill Reference Set**:
The v1 collection of nominal fractional-inch, number, letter, and metric drill sizes used for Nearest Standard Match results.
_Avoid_: Gauge table, tap-drill recommendation, machining standard database

**Metric Comparison Series**:
The explicitly bounded metric subset included in a Reference Dataset Version for cross-system comparison. It does not claim that every included diameter belongs to one product standard or is stocked by every manufacturer.
_Avoid_: Standard metric drill set, complete ISO series

**Reference Dataset Version**:
An identified, source-traceable release of the Drill Reference Set with a stated scope and verification date.
_Avoid_: Latest data, scraped table, silent update

**User Tolerance**:
An optional deviation limit supplied by the Shop Professional. DecimalTools may report whether a match falls inside this entered limit but does not declare the match an acceptable substitute.
_Avoid_: Standard tolerance, safe tolerance, recommended tolerance

**Local Measurement History**:
Recent measurements and Workspace preferences stored only on the Shop Professional's current device without requiring an account.
_Avoid_: Account history, cloud project, analytics record

**Measurement Record**:
A locally saved or exported match containing the entered measurement, unit, nearest nominal size, deviation, optional User Tolerance result, and selected neighboring comparisons.
_Avoid_: Project, report, inspection approval

**Reproducible Match Link**:
A future public link containing only user-chosen match inputs so another person can reproduce and continue the comparison. It is added only after exported Measurement Records demonstrate real sharing behavior.
_Avoid_: Shared history, cloud record, collaboration link

**Validated Workflow**:
A Workspace workflow that meets its agreed thresholds for completed matches, cross-day reuse, result exports, target-user feedback, and confirmed calculation accuracy.
_Avoid_: Traffic growth, indexed page, launched feature

**Anonymous Journey Event**:
A product-usage signal that describes a Workspace step and coarse outcome without including measurements, tolerances, Measurement Records, local history, or a browser fingerprint.
_Avoid_: Measurement analytics, user input log, tracking profile

**Embedded Matcher**:
The Nearest Standard Match experience placed on a third-party website. The free edition retains DecimalTools attribution; a commercial white-label license may remove it and customize presentation.
_Avoid_: API, copied calculator, advertisement

**White-label License**:
A per-domain commercial entitlement for an Embedded Matcher without DecimalTools attribution and with limited presentation customization.
_Avoid_: Subscription seat, custom development, traffic plan

**Acquisition Page**:
A search-focused page that answers a narrow calculation question and leads users into the Shop Measurement Workspace. Each page must earn its place through distinct user value or demonstrated search demand.
_Avoid_: Product, flagship tool

**Maintenance Utility**:
An existing non-core calculator retained for current users and search demand but excluded from active product expansion and the homepage's primary path.
_Avoid_: Flagship feature, product line

**AdSense Readiness Gate**:
The minimum product-quality and content-quality standard DecimalTools must meet before `decimaltools.com` is submitted to AdSense.
_Avoid_: AdSense application, launch date

**Professional Guide**:
An original, English-language article centered on a real shop task, with worked examples, authoritative sources, explicit scope, revision information, and a contextual path into Drill Size Matcher.
_Avoid_: SEO article, AI content, keyword page
