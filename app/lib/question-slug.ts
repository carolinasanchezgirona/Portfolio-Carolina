/** A stable, database-safe URL anchor for a published anonymous question. */
export function slugifyQuestion(value: string): string {
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  // Trim after truncation, too: a 150-character cutoff can leave a trailing '-'.
  return normalized.slice(0, 150).replace(/-+$/g, "");
}
