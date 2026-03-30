import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Mendix Prep - Intermediate Certification Study Guide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          backgroundImage:
            "radial-gradient(circle at 25% 25%, #0595DB22 0%, transparent 50%), radial-gradient(circle at 75% 75%, #0595DB15 0%, transparent 50%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          <svg
            width="80"
            height="80"
            viewBox="0 0 32 32"
            fill="none"
            style={{ marginRight: 20 }}
          >
            <rect width="32" height="32" rx="6" fill="#0595DB" />
            <path
              d="M8 22V12L16 8L24 12V22L16 26L8 22Z"
              stroke="white"
              strokeWidth="2"
              fill="none"
            />
            <path d="M8 12L16 16L24 12" stroke="white" strokeWidth="2" />
            <path d="M16 16V26" stroke="white" strokeWidth="2" />
            <circle cx="16" cy="12" r="2" fill="white" />
          </svg>
          <span
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: "white",
              letterSpacing: "-0.02em",
            }}
          >
            Mendix Prep
          </span>
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#a1a1aa",
            textAlign: "center",
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          Intermediate Certification Study Guide
        </div>
        <div
          style={{
            display: "flex",
            gap: 24,
            marginTop: 48,
          }}
        >
          {["Practice Exams", "Study Materials", "Progress Tracking"].map(
            (item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  backgroundColor: "#18181b",
                  padding: "12px 24px",
                  borderRadius: 9999,
                  border: "1px solid #27272a",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "#0595DB",
                  }}
                />
                <span style={{ color: "#e4e4e7", fontSize: 18 }}>{item}</span>
              </div>
            )
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
