import { createNewsletterHandler } from "./handler.ts";
declare const Deno: { env: { get(name: string): string | undefined }; serve(handler: (request: Request) => Promise<Response>): void };
Deno.serve(createNewsletterHandler({
  SUPABASE_URL: Deno.env.get("SUPABASE_URL") || "",
  SUPABASE_SERVICE_ROLE_KEY: Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
  BREVO_API_KEY: Deno.env.get("BREVO_API_KEY") || "",
}));
