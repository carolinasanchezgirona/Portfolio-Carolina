import { mkdir, copyFile, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";

// Keep clinical PDFs strictly first party: the browser never loads a PDF
// renderer or a document from a third-party CDN. CI installs this pinned
// distribution before building and we publish the two viewer files as assets.
const require = createRequire(import.meta.url);
const packageFile = require.resolve("pdfjs-dist/package.json");
const pkg = JSON.parse(await readFile(packageFile, "utf8"));
const expectedVersion = "6.5.438";
if (pkg.version !== expectedVersion) {
  throw new Error("Se requiere pdfjs-dist@" + expectedVersion + " para mostrar PDFs clínicos dentro de Mi espacio.");
}
const source = dirname(packageFile);
const dest = join(process.cwd(), "public", "vendor", "pdfjs");
await mkdir(dest, { recursive: true });
for (const name of ["pdf.mjs", "pdf.worker.mjs"]) {
  await copyFile(join(source, "build", name), join(dest, name));
}
await copyFile(join(source, "LICENSE"), join(dest, "LICENSE"));
console.log("Visor PDF local preparado con pdfjs-dist@" + expectedVersion);
