import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

const SUPABASE_URL = "https://grgyvdxkjdstdyumdfyg.supabase.co";
const SUPABASE_PUBLIC_KEY = "sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";

type Resource = {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  description: string | null;
  category: "psicologia" | "neuropsicologia" | "profesionales";
  audience: "general" | "pacientes" | "familias" | "profesionales";
  format_label: string;
  price_cents: number;
  status: "draft" | "published" | "archived";
  featured: boolean;
  cover_url: string | null;
  cover_alt: string | null;
  file_path: string | null;
  related_page: string | null;
  related_article_id: string | null;
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
  updated_at: string;
};

export type StripeCheckoutSession = {
  id: string;
  url?: string | null;
  payment_status?: string | null;
  status?: string | null;
  amount_total?: number | null;
  currency?: string | null;
  payment_intent?: string | null;
  livemode?: boolean;
  customer_details?: { email?: string | null } | null;
  metadata?: Record<string, string>;
};

function serviceRoleKey() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY no está configurada.");
  return key;
}

function stripeSecretKey() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY no está configurada.");
  return key;
}

export function commerceConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function getPublishedResources(): Promise<Resource[]> {
  const select = "id,title,slug,subtitle,description,category,audience,format_label,price_cents,status,featured,cover_url,cover_alt,file_path,related_page,related_article_id,seo_title,seo_description,published_at,updated_at";
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/digital_resources?select=${encodeURIComponent(select)}&status=eq.published&order=featured.desc,created_at.desc`,
    { headers: { apikey: SUPABASE_PUBLIC_KEY }, next: { revalidate: 60 } },
  );
  if (!response.ok) return [];
  return response.json();
}

export async function getPublishedResourceById(id: string): Promise<Resource | null> {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/digital_resources?select=*&id=eq.${encodeURIComponent(id)}&status=eq.published&limit=1`,
    { headers: { apikey: SUPABASE_PUBLIC_KEY }, cache: "no-store" },
  );
  if (!response.ok) return null;
  const rows = await response.json();
  return rows?.[0] ?? null;
}

export async function createCheckoutSession(resource: Resource, origin: string): Promise<StripeCheckoutSession> {
  if (!resource.file_path) throw new Error("Este recurso todavía no tiene archivo descargable.");

  const body = new URLSearchParams();
  body.set("mode", "payment");
  body.set("locale", "es");
  body.set("success_url", `${origin}/recursos/compra-completada/?session_id={CHECKOUT_SESSION_ID}`);
  body.set("cancel_url", `${origin}/recursos/?compra=cancelada`);
  body.set("client_reference_id", resource.id);
  body.set("metadata[resource_id]", resource.id);
  body.set("metadata[resource_slug]", resource.slug);
  body.set("line_items[0][quantity]", "1");
  body.set("line_items[0][price_data][currency]", "eur");
  body.set("line_items[0][price_data][unit_amount]", String(resource.price_cents));
  body.set("line_items[0][price_data][product_data][name]", resource.title);
  if (resource.subtitle) body.set("line_items[0][price_data][product_data][description]", resource.subtitle.slice(0, 500));

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeSecretKey()}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
    cache: "no-store",
  });
  const json = await response.json();
  if (!response.ok) throw new Error(json?.error?.message || "Stripe no ha podido crear la sesión de pago.");
  return json;
}

export async function retrieveCheckoutSession(sessionId: string): Promise<StripeCheckoutSession> {
  const response = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, {
    headers: { Authorization: `Bearer ${stripeSecretKey()}` },
    cache: "no-store",
  });
  const json = await response.json();
  if (!response.ok) throw new Error(json?.error?.message || "No se ha podido verificar el pago.");
  return json;
}

export async function upsertPaidOrder(session: StripeCheckoutSession) {
  const resourceId = session.metadata?.resource_id || session.id && undefined;
  if (!resourceId) return;

  const paid = session.payment_status === "paid";
  const payload = {
    resource_id: resourceId,
    stripe_session_id: session.id,
    stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : null,
    customer_email: session.customer_details?.email || null,
    amount_total: session.amount_total || 0,
    currency: session.currency || "eur",
    payment_status: session.payment_status || "unknown",
    livemode: Boolean(session.livemode),
    paid_at: paid ? new Date().toISOString() : null,
  };

  const key = serviceRoleKey();
  const response = await fetch(`${SUPABASE_URL}/rest/v1/digital_resource_orders?on_conflict=stripe_session_id`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("No se ha podido registrar la compra.");
}

export async function createSignedDownload(filePath: string, expiresIn = 600) {
  const key = serviceRoleKey();
  const response = await fetch(
    `${SUPABASE_URL}/storage/v1/object/sign/resource-files/${filePath.split("/").map(encodeURIComponent).join("/")}`,
    {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ expiresIn }),
      cache: "no-store",
    },
  );
  const json = await response.json();
  if (!response.ok || !json?.signedURL) throw new Error(json?.message || "No se ha podido preparar la descarga.");
  return `${SUPABASE_URL}/storage/v1${json.signedURL}&download=${encodeURIComponent(filePath.split("/").pop() || "recurso")}`;
}

export function verifyStripeSignature(payload: string, signatureHeader: string, secret: string, toleranceSeconds = 300) {
  const pieces = signatureHeader.split(",").map((part) => part.trim());
  const timestampPart = pieces.find((part) => part.startsWith("t="));
  const signatures = pieces.filter((part) => part.startsWith("v1=")).map((part) => part.slice(3));
  if (!timestampPart || !signatures.length) return false;

  const timestamp = Number(timestampPart.slice(2));
  if (!Number.isFinite(timestamp)) return false;
  if (Math.abs(Math.floor(Date.now() / 1000) - timestamp) > toleranceSeconds) return false;

  const expected = createHmac("sha256", secret).update(`${timestamp}.${payload}`).digest("hex");
  const expectedBuffer = Buffer.from(expected, "hex");

  return signatures.some((signature) => {
    try {
      const received = Buffer.from(signature, "hex");
      return received.length === expectedBuffer.length && timingSafeEqual(received, expectedBuffer);
    } catch {
      return false;
    }
  });
}
