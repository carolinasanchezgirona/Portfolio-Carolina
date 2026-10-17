import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/entre-sesiones/app/",
    name: "Entre Sesiones · Carolina Sánchez",
    short_name: "Entre Sesiones",
    description: "Material terapéutico y seguimiento en tu espacio privado.",
    lang: "es",
    start_url: "/entre-sesiones/app/",
    scope: "/entre-sesiones/app/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#173a5e",
    icons: [{ src: "/clinic-pwa-icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
