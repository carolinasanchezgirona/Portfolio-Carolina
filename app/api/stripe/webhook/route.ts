import { NextResponse } from "next/server";
import { upsertPaidOrder, verifyStripeSignature } from "../../../lib/commerce-server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook no configurado." }, { status: 503 });

  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Firma ausente." }, { status: 400 });

  const rawBody = await request.text();
  if (!verifyStripeSignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: "Firma no válida." }, { status: 400 });
  }

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Payload no válido." }, { status: 400 });
  }

  try {
    if (
      event?.type === "checkout.session.completed" ||
      event?.type === "checkout.session.async_payment_succeeded"
    ) {
      const session = event.data?.object;
      if (session?.payment_status === "paid") await upsertPaidOrder(session);
    }
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "No se ha podido procesar el evento." }, { status: 500 });
  }
}
