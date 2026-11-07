const issuer = 'https://token.actions.githubusercontent.com';
const audience = 'https://carolinasanchezgirona.com/api/automation/psychology-digest';
const repository = 'carolinasanchezgirona/Portfolio-Carolina';
const branch = 'refs/heads/main';
const algorithm = { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' };

function base64url(value: string) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  return Uint8Array.from(atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')), character => character.charCodeAt(0));
}

export async function checkPsychologyDigestToken(value: string | null) {
  if (!value || value.length > 16000) return 'token';
  const token = /^([\w-]+)\.([\w-]+)\.([\w-]+)$/.exec(value);
  if (!token) return 'token';

  const [, headerPart, claimsPart, signature] = token;
  const decoder = new TextDecoder();
  let header: { alg?: string; kid?: string };
  let claims: Record<string, unknown>;
  try {
    header = JSON.parse(decoder.decode(base64url(headerPart))) as typeof header;
    claims = JSON.parse(decoder.decode(base64url(claimsPart))) as typeof claims;
  } catch {
    return 'token';
  }
  if (header?.alg !== 'RS256' || !header.kid || !claims) return 'token';
  const now = Math.floor(Date.now() / 1000);
  if (claims.iss !== issuer || claims.aud !== audience || claims.repository !== repository
    || claims.repository_id !== '1363891704' || claims.ref !== branch
    || claims.workflow_ref !== `${repository}/.github/workflows/psychology-digest.yml@${branch}`
    || !['schedule', 'workflow_dispatch', 'push'].includes(String(claims.event_name))) return 'identity';
  if (typeof claims.exp !== 'number' || claims.exp <= now
    || typeof claims.nbf !== 'number' || claims.nbf > now + 30
    || typeof claims.iat !== 'number' || claims.iat > now + 30 || claims.exp - claims.iat > 600) return 'time';

  let signingKey: JsonWebKey | undefined;
  try {
    const response = await fetch(`${issuer}/.well-known/jwks`, {
      signal: AbortSignal.timeout(8_000), redirect: 'error',
    });
    if (!response.ok) return 'key-service';
    const { keys } = await response.json() as { keys: (JsonWebKey & { kid?: string })[] };
    signingKey = keys.find(key => key.kid === header.kid && key.kty === 'RSA' && key.use === 'sig');
  } catch {
    return 'key-service';
  }
  if (!signingKey) return 'key-id';
  try {
    const key = await crypto.subtle.importKey('jwk', signingKey, algorithm, false, ['verify']);
    const valid = await crypto.subtle.verify(algorithm, key, base64url(signature), new TextEncoder().encode(`${headerPart}.${claimsPart}`));
    return valid ? 'ok' : 'signature';
  } catch {
    return 'signature';
  }
}
