import type { Metadata } from "next";
import {
  createSignedDownload,
  getPublishedResourceById,
  retrieveCheckoutSession,
  upsertPaidOrder,
} from "../../lib/commerce-server";

export const metadata: Metadata = {
  title: "Compra completada",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default async function CompraCompletadaPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;

  let title = "Estamos verificando tu compra";
  let message = "No hemos podido localizar una sesión de pago válida.";
  let downloadUrl: string | null = null;

  if (sessionId) {
    try {
      const session = await retrieveCheckoutSession(sessionId);
      const resourceId = session.metadata?.resource_id;

      if (session.payment_status === "paid" && resourceId) {
        const resource = await getPublishedResourceById(resourceId);
        if (resource?.file_path) {
          await upsertPaidOrder(session).catch(() => undefined);
          downloadUrl = await createSignedDownload(resource.file_path, 600);
          title = "Compra completada";
          message = `Tu recurso “${resource.title}” está preparado. El enlace de descarga caduca en 10 minutos.`;
        } else {
          message = "El pago está confirmado, pero el archivo no está disponible. Contacta con nosotros para que podamos resolverlo.";
        }
      } else if (session.status === "complete") {
        message = "La compra se ha completado, pero el pago todavía está pendiente de confirmación.";
      }
    } catch {
      message = "No hemos podido verificar la compra en este momento.";
    }
  }

  return (
    <main className="resources-success-page">
      <section className="resources-success-card">
        <p className="editorial-eyebrow">Recursos digitales</p>
        <h1>{title}</h1>
        <p>{message}</p>
        {downloadUrl ? (
          <a className="editorial-btn editorial-btn-primary" href={downloadUrl}>
            Descargar recurso
          </a>
        ) : null}
        <a className="resources-success-back" href="/recursos/">
          Volver a recursos
        </a>
      </section>
    </main>
  );
}
