import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

const size = {
  width: 1200,
  height: 630,
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name") || "Founding Member";
  const code = searchParams.get("code") || "VIP-ACCESS";
  const role = searchParams.get("role") || "Software Engineer";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 70px",
          backgroundColor: "#05050A",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
        }}
      >
        {/* Ambient Glows */}
        <div
          style={{
            position: "absolute",
            top: "-15%",
            left: "-10%",
            width: "550px",
            height: "550px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(168, 85, 247, 0.35) 0%, rgba(0,0,0,0) 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-15%",
            right: "-10%",
            width: "550px",
            height: "550px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.35) 0%, rgba(0,0,0,0) 70%)",
          }}
        />

        {/* Top Header Row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                backgroundColor: "#181826",
                border: "1px solid rgba(168, 85, 247, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#A855F7",
                fontSize: "22px",
                fontWeight: "bold",
              }}
            >
              ⚡
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "24px", fontWeight: "900", color: "#FFFFFF", letterSpacing: "-0.5px" }}>
                SlotMyInterview
              </span>
              <span style={{ fontSize: "12px", color: "#A1A1AA", fontFamily: "monospace", letterSpacing: "1px" }}>
                PROOF-BASED TALENT NETWORK
              </span>
            </div>
          </div>

          {/* Glowing Priority Tag */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              borderRadius: "999px",
              backgroundColor: "rgba(168, 85, 247, 0.15)",
              border: "1px solid rgba(168, 85, 247, 0.35)",
              color: "#E9D5FF",
              fontSize: "13px",
              fontFamily: "monospace",
              fontWeight: "bold",
              letterSpacing: "1px",
            }}
          >
            <span>🔥 VIP PRIORITY PASS</span>
          </div>
        </div>

        {/* Center Main Ticket Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", zIndex: 10 }}>
          <div
            style={{
              fontSize: "14px",
              color: "#C084FC",
              fontFamily: "monospace",
              textTransform: "uppercase",
              letterSpacing: "2px",
              fontWeight: "bold",
            }}
          >
            OFFICIAL FOUNDING INVITATION
          </div>
          
          <div
            style={{
              fontSize: "56px",
              fontWeight: "900",
              color: "#FFFFFF",
              letterSpacing: "-1.5px",
              lineHeight: 1.1,
            }}
          >
            {name}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginTop: "4px" }}>
            <span
              style={{
                fontSize: "16px",
                color: "#38BDF8",
                backgroundColor: "rgba(56, 189, 248, 0.12)",
                padding: "6px 16px",
                borderRadius: "8px",
                border: "1px solid rgba(56, 189, 248, 0.25)",
                fontWeight: "600",
              }}
            >
              {role}
            </span>
            <span
              style={{
                fontSize: "16px",
                color: "#34D399",
                backgroundColor: "rgba(52, 211, 153, 0.12)",
                padding: "6px 16px",
                borderRadius: "8px",
                border: "1px solid rgba(52, 211, 153, 0.25)",
                fontWeight: "600",
              }}
            >
              ⚡ Priority Interview Slotting
            </span>
          </div>
        </div>

        {/* Bottom Details Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "24px",
            borderTop: "1px solid rgba(255, 255, 255, 0.12)",
            zIndex: 10,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "12px", color: "#71717A", fontFamily: "monospace" }}>INVITATION CODE</span>
            <span style={{ fontSize: "20px", color: "#F59E0B", fontFamily: "monospace", fontWeight: "bold" }}>
              #{code}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 24px",
              borderRadius: "12px",
              background: "linear-gradient(90deg, #9333EA 0%, #4F46E5 100%)",
              color: "#FFFFFF",
              fontSize: "15px",
              fontWeight: "bold",
            }}
          >
            <span>Jump 50 Spots Ahead in Queue →</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
