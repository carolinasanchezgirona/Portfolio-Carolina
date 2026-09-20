import { NextResponse } from "next/server";
import { createCheckoutSession, getPublishedResourceById } from "../../../lib/commerce-server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let resourceId = "";

    if (contentType.includes("application/json")) {
      const body = await request.json();
      resourceId = String(body?.resourceId || "");
    } else {
      const form = await request.formData();
      resourceId = String(form.get("resourceId") || "");
    }

    if (!resourceId) return NextResponse.json({ error: "Falta el recurso." }, { status: 400 });

    const resource = await getPublishedResourceById(resourceId);
    if (!resource || !resource.file_path) {
      return NextResponse.json({ error: "Este recurso no está disponible para compra." }, { status: 404 });
    }

    const requestUrl = new URL(request.url);
    const origin = process.env.NEXT_PUBLIC_SITE_URL || `${requestUrl.protocol}//${requestUrl.host}`;
    const session = await createCheckoutSession(resource, origin);

    if (!session.url) return NextResponse.json({ error: "Stripe no ha devuelto una página de pago." }, { status: 502 });
    return NextResponse.redirect(session.url, 303);
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se ha podido iniciar el pago.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
