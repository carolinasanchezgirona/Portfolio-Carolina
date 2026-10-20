#!/usr/bin/env python3
"""Import only the checksum-pinned, already signed Android delivery bundle."""
from pathlib import Path
from urllib.parse import urlparse
import hashlib, io, json, re, urllib.request, zipfile

root = Path(__file__).resolve().parents[2]
manifest = json.loads((root / "android/miclinica/release-import.json").read_text())
parsed = urlparse(manifest["bundle_url"])
if parsed.scheme != "https" or not parsed.hostname or not parsed.hostname.endswith(".vercel.run"):
    raise SystemExit("Unexpected bundle origin")
with urllib.request.urlopen(manifest["bundle_url"], timeout=60) as response:
    payload = response.read(25 * 1024 * 1024 + 1)
if len(payload) > 25 * 1024 * 1024:
    raise SystemExit("Bundle too large")
if hashlib.sha256(payload).hexdigest() != manifest["bundle_sha256"]:
    raise SystemExit("Bundle checksum mismatch")
web = {
    "app/admin/layout.tsx", "app/admin/clinica/layout.tsx", "app/admin/page.tsx",
    "app/admin/clinica/page.tsx", "public/clinic-pwa.js",
    "public/clinic-manifest.webmanifest", "app/admin/admin-palette.css",
    "public/clinic-pwa-icon.svg",
}
def permitted(path):
    return path in web or bool(re.fullmatch(
        r"public/clinic-pwa-icon-(180|192|512)\.png|"
        r"public/downloads/mi-clinica-1\.0\.0\.(apk|sha256)|"
        r"android/miclinica/app/src/main/res/mipmap-(mdpi|hdpi|xhdpi|xxhdpi|xxxhdpi)/(ic_launcher|ic_launcher_round|ic_foreground)\.png",
        path))
entries = manifest["files"]
if len(entries) > 50 or sum(e["size"] for e in entries) > 25 * 1024 * 1024:
    raise SystemExit("Unexpected bundle contents")
with zipfile.ZipFile(io.BytesIO(payload)) as archive:
    if set(archive.namelist()) != {e["path"] for e in entries}:
        raise SystemExit("Unlisted archive contents")
    ready = []
    for entry in entries:
        name = entry["path"]
        if not permitted(name) or name.startswith("/") or ".." in Path(name).parts:
            raise SystemExit("Disallowed delivery path")
        body = archive.read(name)
        if len(body) != entry["size"] or hashlib.sha256(body).hexdigest() != entry["sha256"]:
            raise SystemExit("File checksum mismatch: " + name)
        dest = root / name
        if not dest.resolve().is_relative_to(root):
            raise SystemExit("Path escapes repository")
        if dest.exists():
            current = hashlib.sha256(dest.read_bytes()).hexdigest()
            if current not in (entry.get("previous_sha256"), entry["sha256"]):
                raise SystemExit("File changed since bundle preparation: " + name)
        elif entry.get("previous_sha256") is not None:
            raise SystemExit("Existing source disappeared: " + name)
        ready.append((dest, body))
    for dest, body in ready:
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(body)
print("Imported", len(ready), "verified Android and web files")
