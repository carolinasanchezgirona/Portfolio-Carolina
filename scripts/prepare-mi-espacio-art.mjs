// Unpacks a small, reviewed art archive with Node built-ins only.
// The assets are illustrative, not patient or clinical data.
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { inflateRawSync } from "node:zlib";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const archive = readFileSync(resolve(root, "assets/mi-espacio/personajes-3d.zip"));
const output = resolve(root, "public/mi-espacio/characters");
let offset = 0;
let written = 0;
while (offset + 30 <= archive.length && archive.readUInt32LE(offset) === 0x04034b50) {
  const flags = archive.readUInt16LE(offset + 6);
  const method = archive.readUInt16LE(offset + 8);
  const compressedSize = archive.readUInt32LE(offset + 18);
  const uncompressedSize = archive.readUInt32LE(offset + 22);
  const nameLength = archive.readUInt16LE(offset + 26);
  const extraLength = archive.readUInt16LE(offset + 28);
  const name = archive.subarray(offset + 30, offset + 30 + nameLength).toString("utf8");
  const contentStart = offset + 30 + nameLength + extraLength;
  const contentEnd = contentStart + compressedSize;
  if (flags & 0x08 || ![0, 8].includes(method) || contentEnd > archive.length) {
    throw new Error("Unsupported or malformed character asset archive");
  }
  if (!name.endsWith("/") && name.endsWith(".webp")) {
    let destination;
    if (/^personajes\/[a-z_]+\.webp$/.test(name)) {
      destination = resolve(output, name.replace("personajes/", ""));
    } else if (/^emociones_hombre_mayor\/[1-5]_[a-z_]+\.webp$/.test(name)) {
      destination = resolve(output, "moods/senior-man", name.split("/")[1]);
    } else {
      throw new Error("Unrecognized character asset name: " + name);
    }
    if (!destination.startsWith(output + "/") || uncompressedSize > 2 * 1024 * 1024) {
      throw new Error("Unsafe character asset");
    }
    const compressed = archive.subarray(contentStart, contentEnd);
    const bytes = method === 0 ? compressed : inflateRawSync(compressed);
    if (bytes.length !== uncompressedSize || bytes.subarray(0, 4).toString() !== "RIFF") {
      throw new Error("Invalid 3D artwork resource: " + name);
    }
    mkdirSync(dirname(destination), { recursive: true });
    writeFileSync(destination, bytes);
    written++;
  }
  offset = contentEnd;
}
if (written !== 13) throw new Error("Expected eight avatars and five emotion illustrations, got " + written);
console.log("3D character artwork extracted: " + written + " images.");
