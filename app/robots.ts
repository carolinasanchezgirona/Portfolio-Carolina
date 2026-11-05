import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin/"] },
      // Permitir explícitamente el rastreo para los resultados de ChatGPT Search.
      // Esta directiva no autoriza el entrenamiento de modelos.
      { userAgent: "OAI-SearchBot", allow: "/", disallow: ["/admin/"] },
    ],
    sitemap: "https://carolinasanchezgirona.com/sitemap.xml",
  };
}
