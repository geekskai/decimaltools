import {
  Calculator,
  Palette,
  Monitor,
  Sparkles,
  Clock,
  ArrowLeftRight,
  Shield,
  Car,
  Table,
  Ruler,
  Zap,
  Music,
  Snowflake,
  Search,
  CreditCard,
  Banknote,
  Microscope,
  Hash,
  Printer,
} from "lucide-react"

export interface ToolData {
  id: string
  title: string
  description: string
  icon: any
  href: string
  features: string[]
  badge: string
  badgeColor: string
  gradient: string
  category: string
}

// Professional gradient color palette for tool cards
export const gradients = {
  productivity: "from-blue-500 to-purple-600",
  development: "from-emerald-500 to-teal-600",
  creative: "from-orange-500 to-red-500",
  entertainment: "from-purple-500 to-pink-500",
  communication: "from-pink-500 to-rose-500",
  analytics: "from-indigo-500 to-blue-600",
  education: "from-yellow-500 to-orange-500",
  utility: "from-teal-500 to-cyan-500",
  security: "from-red-500 to-pink-500",
  finance: "from-green-500 to-emerald-600",
}

export const toolsData: ToolData[] = [
  {
    id: "gauge-to-decimal",
    title: "Gauge to Decimal",
    description:
      "Convert gauge sizes to decimal inches and millimeters for sheet metal and wire standards. Fast material-specific results with tolerance ranges and quick search.",
    icon: Microscope,
    href: "/tools/gauge-to-decimal",
    features: [
      "Supports sheet steel, galvanized, stainless, aluminum, and AWG wire",
      "Shows inch + millimeter values with production-friendly precision",
      "Tolerance range and visual thickness reference included",
      "Free, fast, mobile-friendly",
    ],
    badge: "Manufacturing",
    badgeColor: "bg-emerald-500",
    gradient: gradients.utility,
    category: "Utility",
  },
  {
    id: "decimal-to-text",
    title: "Decimal to Text",
    description:
      "Decode decimal character codes into plain text instantly. Convert inputs like 72 101 108 108 111 to Hello for debugging, quick data checks, and encoding practice.",
    icon: Hash,
    href: "/tools/decimal-to-text",
    features: [
      "Supports space/comma/newline separated decimal codes",
      "ASCII and Unicode code point decoding",
      "Copy-ready output with normalized decimal + hex previews",
      "Free, fast, mobile-friendly",
    ],
    badge: "Writing",
    badgeColor: "bg-cyan-500",
    gradient: gradients.analytics,
    category: "Utility",
  },
  {
    id: "fraction-to-decimal",
    title: "Fraction to Decimal",
    description:
      "Convert proper fractions, improper fractions, and mixed numbers to decimals — and decimals back to simplified fractions. Built for homework and quick math (not tape-measure inches).",
    icon: Calculator,
    href: "/tools/fraction-to-decimal",
    features: [
      "Fraction ↔ decimal with clear repeating-decimal notes",
      "Shared math engine with our other converters",
      "Adjustable precision & one-tap copy",
      "Free, fast, mobile-friendly",
    ],
    badge: "Math",
    badgeColor: "bg-violet-500",
    gradient: gradients.education,
    category: "Education",
  },
  {
    id: "convert-inches-to-decimal",
    title: "Convert Inches to Decimal",
    description:
      "Professional inches to decimal converter for construction, woodworking, and manufacturing. Convert fractional inches (5 3/4) to decimal inches (5.75) instantly with visual ruler and precision control.",
    icon: Ruler,
    href: "/tools/convert-inches-to-decimal",
    features: [
      "Bidirectional Fraction ↔ Decimal Conversion",
      "Visual Ruler with Measurements",
      "Mobile-Optimized for Job Sites",
      "Conversion History & Export",
    ],
    badge: "Professional",
    badgeColor: "bg-orange-500",
    gradient: gradients.utility,
    category: "Utility",
  },
]

export default toolsData
