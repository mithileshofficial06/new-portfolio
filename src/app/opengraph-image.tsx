import { ImageResponse } from "next/og";

import { PROFILE } from "@/lib/content";

export const alt = "Mithilesh KS — Developer & Designer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The card that appears when the site is shared. Same monochrome system. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#050505",
          color: "#fafafa",
          padding: "68px 72px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 20,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#77777f",
          }}
        >
          <span>Portfolio — Edition 2026</span>
          <span>{PROFILE.location}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 132,
              lineHeight: 1,
              letterSpacing: -7,
              textTransform: "uppercase",
            }}
          >
            {PROFILE.name}
          </div>
          <div
            style={{
              marginTop: 26,
              fontSize: 40,
              letterSpacing: -1,
              color: "#a0a0a8",
              textTransform: "uppercase",
            }}
          >
            Developer &amp; Designer
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px solid #1e1e21",
            paddingTop: 26,
            fontSize: 20,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#77777f",
          }}
        >
          <span>Next.js · TypeScript · Python · FastAPI</span>
          <span>{PROFILE.email}</span>
        </div>
      </div>
    ),
    size,
  );
}
