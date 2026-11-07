const issuer = 'https://token.actions.githubusercontent.com';
const audience = 'https://carolinasanchezgirona.com/api/automation/psychology-digest';
const repository = 'carolinasanchezgirona/Portfolio-Carolina';
const branch = 'refs/heads/main';
const algorithm = { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' };

function base64url(value: string) {
  return Uint8Array.from(atob(value.replace(/-/g, '+').replace(/_/g, '/')), character => character.charCodeAt(0));
}

export async function isPsychologyDigestWorkflow(authorization: string | null): Promise<boolean> {
  if (!authorization || authorization.length > 16000) return false;
  const token = /^Bearer ([\w-]+)\.([\w-]+)\.([\w-]+)$/i.exec(authorization);
  if (!token) return false;

  const [, headerPart, claimsPart, signature] = token;
  const decoder = new TextDecoder();
  try {
    const header = JSON.parse(decoder.decode(base64url(headerPart))) as { alg?: string; kid?: string };
    if (header.alg !== 'RS256' || !header.kid) return false;

    const claims = JSON.parse(decoder.decode(base64url(claimsPart))) as Record<string, unknown>;
    const now = Math.floor(Date.now() / 1000);
    if (claims.iss !== issuer || claims.aud !== audience || claims.repository !== repository
      || claims.repository_id !== '1363891704' || claims.ref !== branch
      || claims.workflow_ref !== `${repository}/.github/workflows/psychology-digest.yml@${branch}`
      || !['schedule', 'workflow_dispatch', 'push'].includes(String(claims.event_name))
      || typeof claims.exp !== 'number' || claims.exp <= now
      || typeof claims.nbf !== 'number' || claims.nbf > now + 30
      || typeof claims.iat !== 'number' || claims.iat > now + 30 || claims.exp - claims.iat > 600) return false;

    const response = await fetch(`${issuer}/.well-known/jwks`, {
      signal: AbortSignal.timeout(8_000), redirect: 'error',
    });
    if (!response.ok) return false;
    const { keys } = await response.json() as { keys: (JsonWebKey & { kid?: string })[] };
    const signingKey = keys.find(key => key.kid === header.kid && key.kty === 'RSA' && key.use === 'sig');
    if (!signingKey) return false;
    const key = await crypto.subtle.importKey('jwk', signingKey, algorithm, false, ['verify']);
    return await crypto.subtle.verify(algorithm, key, base64url(signature), new TextEncoder().encode(`${headerPart}.${claimsPart}`));
  } catch {
    return false;
  }
}
