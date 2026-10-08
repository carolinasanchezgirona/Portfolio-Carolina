/**
 * Conservative, server-side preflight for obvious direct identifiers in notes
 * sent to external AI services. This is not anonymisation or a DLP guarantee:
 * clinicians must still review free text for names and contextual identifiers.
 */
export function containsDirectPatientIdentifiers(value: string): boolean {
  const text = value.normalize("NFKC");
  const condensed = text.replace(/[\s().-]/g, "");

  // Email, Spanish DNI/NIE, bank accounts and Spanish phone numbers.
  if (/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(text)) return true;
  if (/(?:^|[^a-z0-9])(?:\d{8}[a-z]|[xyz]\d{7}[a-z])(?:$|[^a-z0-9])/i.test(text)) return true;
  if (/(?:^|[^a-z0-9])es\d{22}(?:$|[^a-z0-9])/i.test(condensed)) return true;
  if (/(?:^|[^\d])(?:\+34|0034)?[6789]\d{8}(?!\d)/.test(condensed)) return true;

  // Clearly labelled identity, birth date and full street address.
  if (/(?:nombre completo|nombre y apellidos|apellidos)\s*[:=]\s*\S/iu.test(text)) return true;
  if (/(?:fecha de nacimiento|domicilio|direcci[oó]n postal)\s*[:=]\s*\S/iu.test(text)) return true;
  if (/\b(?:calle|carrer|avenida|avinguda|paseo|passeig|plaza|plaça)\s+[\p{L}.'-]+(?:\s+[\p{L}.'-]+){0,3}\s*,?\s+\d{1,4}\b/iu.test(text)) return true;

  return false;
}

export const CLINICAL_IDENTIFIERS_ERROR =
  "Antes de utilizar la IA, elimina nombres completos, DNI/NIE, teléfonos, correos, direcciones y otros datos que permitan identificar a la persona. Revisa también detalles contextuales: este filtro no detecta todos los identificadores.";
