import { ImageResponse } from "next/og";

export const alt = "Carolina Sánchez, psicóloga sanitaria y neuropsicóloga";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          padding: "72px 78px",
          background: "#FBF9F5",
          color: "#173A5E",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            borderLeft: "14px solid #08A6A0",
            paddingLeft: "50px",
          }}
        >
          <div style={{ display: "flex", color: "#08A6A0", fontFamily: "Arial, sans-serif", fontSize: 28, fontWeight: 700 }}>
            PSICOLOGÍA SANITARIA · NEUROPSICOLOGÍA
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", maxWidth: 920, fontSize: 76, lineHeight: 1.02 }}>
              Carolina Sánchez Girona
            </div>
            <div style={{ display: "flex", marginTop: 24, fontFamily: "Arial, sans-serif", fontSize: 34, color: "#48647D" }}>
              Consulta en Arenys de Mar y atención online
            </div>
          </div>
          <div style={{ display: "flex", fontFamily: "Arial, sans-serif", fontSize: 25, color: "#48647D" }}>
            Psicóloga General Sanitaria · Neuropsicóloga · COPC 24892
          </div>
        </div>
      </div>
    ),
    size,
  );
}
