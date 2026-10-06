import { ImageResponse } from "next/og"

export const SHARE_IMAGE_SIZE = { width: 1200, height: 630 }

export function createShareImage({ title, description }: { title: string; description: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          padding: "70px",
          background: "linear-gradient(135deg, #020617, #0c3150)",
          color: "white",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: "#67e8f9", marginBottom: 30 }}>
          DecimalTools · Free online converters
        </div>
        <div style={{ display: "flex", fontSize: 64, fontWeight: 700, lineHeight: 1.12 }}>
          {title}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            lineHeight: 1.4,
            color: "#cbd5e1",
            marginTop: 28,
          }}
        >
          {description}
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#67e8f9", marginTop: 36 }}>
          decimaltools.com
        </div>
      </div>
    ),
    SHARE_IMAGE_SIZE
  )
}
