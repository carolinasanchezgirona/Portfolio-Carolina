import test from 'node:test';
import assert from 'node:assert/strict';
import { analyticsPage, consentFromRecord, CONSENT_VERSION, CONSENT_MAX_AGE, cookieDomains } from '../app/components/analytics-privacy.ts';
import { createNewsletterHandler } from '../supabase/functions/newsletter-subscribe/handler.ts';
import { NEWSLETTER_POLICY_VERSION, NEWSLETTER_LIST_NAME, NEWSLETTER_TEMPLATE_NAME, NEWSLETTER_CONSENT_TEXT } from '../supabase/functions/newsletter-subscribe/policy.ts';

const env = { SUPABASE_URL: 'https://test.supabase.co', SUPABASE_SERVICE_ROLE_KEY: 'test-service-secret', BREVO_API_KEY: 'test-brevo-secret' };
const payload = { email: 'person@example.invalid', consent: true, policyVersion: NEWSLETTER_POLICY_VERSION };
function request(body = payload, method = 'POST', token = env.SUPABASE_SERVICE_ROLE_KEY) {
  return new Request('https://test.supabase.co/functions/v1/newsletter-subscribe', { method, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'X-Newsletter-Client-IP': '192.0.2.1' }, body: method === 'POST' ? JSON.stringify(body) : undefined });
}
function mockProvider(t, { limited = false, deliveryStatus = 201, provision = false } = {}) {
  const calls = [];
  t.mock.method(globalThis, 'fetch', async (url, init = {}) => {
    const body = init.body ? JSON.parse(init.body) : undefined;
    calls.push({ url: String(url), method: init.method || 'GET', body });
    if (String(url).includes('/rpc/consume_website_newsletter_limit')) return Response.json(!limited);
    if (String(url).includes('/contacts/lists?')) return Response.json({ lists: [{ id: 7, name: NEWSLETTER_LIST_NAME }], count: 1 });
    if (String(url).endsWith('/contacts/attributes')) return Response.json({ attributes: provision ? [] : Object.entries({ CG_NEWSLETTER_CONSENT: 'boolean', CG_NEWSLETTER_VERSION: 'text', CG_NEWSLETTER_REQUESTED_AT: 'text', CG_NEWSLETTER_SOURCE: 'text', CG_NEWSLETTER_TEXT: 'text' }).map(([name,type]) => ({ name, type, category: 'normal' })) });
    if (String(url).includes('/contacts/attributes/normal/')) return Response.json({}, { status: 201 });
    if (String(url).endsWith('/smtp/templates?limit=1000')) return Response.json({ templates: provision ? [] : [{ id: 12, name: NEWSLETTER_TEMPLATE_NAME, isActive: true, htmlContent: '<a href="{{ doubleoptin }}">Confirmar</a>' }] });
    if (String(url).endsWith('/smtp/templates') && init.method === 'POST') return Response.json({ id: 12 }, { status: 201 });
    if (String(url).endsWith('/contacts/doubleOptinConfirmation')) return Response.json({}, { status: deliveryStatus });
    throw Error('Unexpected upstream request: ' + url);
  });
  return calls;
}
test('sensitive and unknown routes never qualify for Analytics', () => {
  for (const path of ['/cita/', '/mi-espacio/', '/mi-espacio/prueba/', '/admin/clinica/', '/entre-sesiones/app/', '/suscribete/', '/suscripcion/confirmada/', '/pregunta-a-carolina/', '/ansiedad/', '/articulos/trauma/', '/recursos/gracias/', '/new-health-feature/']) assert.equal(analyticsPage(path), null, path);
  assert.deepEqual(analyticsPage('/sobre-mi'), { path: '/sobre-mi/', title: 'Sobre la profesional' });
});
test('consent fails closed for old versions, future timestamps, corruption and expiry', () => {
  const now = 2_000_000_000_000;
  const record = values => JSON.stringify({ choice:'accepted', updatedAt:now, version:CONSENT_VERSION, ...values });
  assert.equal(consentFromRecord(record({}), now), 'accepted');
  for (const value of [null, 'broken', 'null', record({ version:'old' }), record({ choice:'maybe' }), record({ updatedAt:now+1 }), record({ updatedAt:now-CONSENT_MAX_AGE }), record({ updatedAt:'yesterday' })]) assert.equal(consentFromRecord(value, now), null);
  assert.equal(consentFromRecord(record({choice:'rejected'}),now),'rejected');
});
test('cookie deletion covers parent domains, not just www host', () => {
  assert.ok(cookieDomains('www.carolinasanchezgirona.com').includes('.carolinasanchezgirona.com'));
  assert.ok(!cookieDomains('www.carolinasanchezgirona.com').includes('.com'));
});
test('subscription rejects unauthorized calls and missing/stale consent without upstream activity', async t => {
  const calls = mockProvider(t); const handler = createNewsletterHandler(env);
  assert.equal((await handler(request(payload,'POST','wrong'))).status,401);
  assert.equal((await handler(request({...payload,consent:false}))).status,400);
  assert.equal((await handler(request({...payload,policyVersion:'old'}))).status,400);
  assert.equal((await handler(request({...payload,email:'bad'}))).status,400);
  assert.equal((await handler(request(null))).status,400);
  assert.equal(calls.length,0);
});
test('honeypot and persistent rate limit prevent confirmation emails', async t => {
  const calls = mockProvider(t,{limited:true}); const handler=createNewsletterHandler(env);
  assert.equal((await handler(request({...payload,website:'spam'}))).status,202);
  assert.equal(calls.length,0);
  assert.equal((await handler(request())).status,429);
  assert.equal(calls.length,1);
  const encoded=JSON.stringify(calls);
  assert.ok(!encoded.includes(payload.email)); assert.ok(!encoded.includes('192.0.2.1'));
});
test('accepted submission uses native DOI, stores exact consent, never directly adds a campaign contact', async t => {
  const calls=mockProvider(t); const result=await createNewsletterHandler(env)(request());
  assert.equal(result.status,202);
  const sent=calls.filter(call=>call.url.endsWith('/contacts/doubleOptinConfirmation'));
  assert.equal(sent.length,1); assert.deepEqual(sent[0].body.includeListIds,[7]);
  assert.equal(sent[0].body.attributes.CG_NEWSLETTER_TEXT,NEWSLETTER_CONSENT_TEXT);
  assert.equal(sent[0].body.attributes.CG_NEWSLETTER_VERSION,NEWSLETTER_POLICY_VERSION);
  assert.equal(sent[0].body.contactPixelTrackingConsent,false);
  assert.ok(!calls.some(call=>call.url.endsWith('/contacts') && call.method==='POST'));
  assert.ok(!JSON.stringify(sent).includes('192.0.2.1'));
  assert.match(result.headers.get('Cache-Control'),/no-store/);
});
test('provider failures do not falsely report a confirmation was sent', async t => {
  mockProvider(t,{deliveryStatus:500});
  assert.equal((await createNewsletterHandler(env)(request())).status,502);
});
test('readiness provisions dedicated metadata only and never sends a message', async t => {
  const calls=mockProvider(t,{provision:true});
  const result=await createNewsletterHandler(env)(request(undefined,'GET'));
  assert.equal(result.status,200); assert.deepEqual(await result.json(),{available:true});
  assert.equal(calls.filter(call=>call.url.includes('/contacts/attributes/normal/')).length,5);
  const template=calls.find(call=>call.url.endsWith('/smtp/templates'));
  assert.ok(template.body.htmlContent.includes('{{ doubleoptin }}'));
  assert.ok(template.body.htmlContent.includes('/privacidad/'));
  assert.ok(!calls.some(call=>call.url.includes('doubleOptinConfirmation')||call.url.endsWith('/smtp/email')));
});
