/** Initialises VAPID exactly once on the Cloudflare Worker.
 * Keys NEVER enter Git, action logs, artifacts or browser storage.
 * Existing keys are left untouched on subsequent deployments.
 */
import { execFileSync } from "node:child_process";
import { generateKeyPairSync } from "node:crypto";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const wrangler = (args) => execFileSync("npx", ["--yes", "wrangler@4.51.0", ...args], {
  encoding:"utf8", env:process.env, maxBuffer:1024*1024, timeout:90000, stdio:["ignore","pipe","pipe"],
});
if (!process.env.CLOUDFLARE_API_TOKEN || !process.env.CLOUDFLARE_ACCOUNT_ID) {
  throw new Error("Missing Cloudflare deployment credentials");
}
const raw = wrangler(["secret","list","--format","json"]);
const secrets = JSON.parse(raw.trim());
const names = new Set(secrets.map(item=>item.name));
const existingPublic = names.has("VAPID_PUBLIC_KEY");
const existingPrivate = names.has("VAPID_PRIVATE_JWK");
if (existingPublic !== existingPrivate) {
  throw new Error("Incomplete VAPID configuration: refusing to rotate a pre-existing key. Repair both keys manually.");
}
if (existingPublic) {
  process.stdout.write("VAPID already configured; preserving the current subscriptions.\n");
  process.exit(0);
}
const { publicKey, privateKey } = generateKeyPairSync("ec", {namedCurve:"prime256v1"});
const publicJwk = publicKey.export({format:"jwk"});
const privateJwk = privateKey.export({format:"jwk"});
const x = Buffer.from(publicJwk.x,"base64url");
const y = Buffer.from(publicJwk.y,"base64url");
if (x.length!==32 || y.length!==32) throw new Error("Invalid P-256 coordinates");
const vapidPublic = Buffer.concat([Buffer.from([4]),x,y]).toString("base64url");
const tmp = mkdtempSync(join(tmpdir(),"dememoria-vapid-"));
try {
  const keyFile = join(tmp,"worker-secrets.json");
  writeFileSync(keyFile,JSON.stringify({
    VAPID_PUBLIC_KEY:vapidPublic,
    VAPID_PRIVATE_JWK:JSON.stringify(privateJwk)
  }),{mode:0o600,flag:"wx"});
  wrangler(["secret","bulk",keyFile]);
  process.stdout.write("VAPID keys generated and stored only as Cloudflare Worker secrets.\n");
} finally {
  rmSync(tmp,{recursive:true,force:true});
}
