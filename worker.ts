interface Env {
  STRIPE_WEBHOOK_SECRET: string;
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
}

const encoder = new TextEncoder();

function hexToBytes(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) throw new Error("Invalid hex");
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

async function verifyStripeSignature(
  payload: string,
  signatureHeader: string,
  secret: string,
): Promise<boolean> {
  const parts = signatureHeader.split(",");
  const timestampPart = parts.find((part) => part.startsWith("t="));
  const signatures = parts
    .filter((part) => part.startsWith("v1="))
    .map((part) => part.slice(3));

  if (!timestampPart || signatures.length === 0) return false;

  const timestamp = timestampPart.slice(2);
  const timestampNumber = Number(timestamp);
  if (!Number.isFinite(timestampNumber)) return false;

  const toleranceSeconds = 300;
  const age = Math.abs(Date.now() / 1000 - timestampNumber);
  if (age > toleranceSeconds) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signedPayload = `${timestamp}.${payload}`;
  const digest = new Uint8Array(
    await crypto.subtle.sign("HMAC", key, encoder.encode(signedPayload)),
  );

  return signatures.some((signature) => {
    try {
      return timingSafeEqual(digest, hexToBytes(signature));
    } catch {
      return false;
    }
  });
}

async function handleStripeWebhook(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  if (!env.STRIPE_WEBHOOK_SECRET) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing Stripe-Signature header", { status: 400 });
  }

  const body = await request.text();
  const valid = await verifyStripeSignature(body, signature, env.STRIPE_WEBHOOK_SECRET);

  if (!valid) {
    return new Response("Invalid Stripe signature", { status: 400 });
  }

  let event: {
    id?: string;
    type?: string;
    data?: { object?: Record<string, unknown> };
  };

  try {
    event = JSON.parse(body);
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded":
    case "checkout.session.async_payment_failed": {
      const session = event.data?.object ?? {};
      console.log("Stripe event received", {
        eventId: event.id,
        type: event.type,
        sessionId: session.id,
        paymentStatus: session.payment_status,
      });
      break;
    }
    default:
      console.log("Unhandled Stripe event", {
        eventId: event.id,
        type: event.type,
      });
  }

  return Response.json({ received: true });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (
      url.pathname === "/api/stripe/webhook" ||
      url.pathname === "/api/stripe/webhook/"
    ) {
      return handleStripeWebhook(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};
