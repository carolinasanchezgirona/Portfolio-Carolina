import test from 'node:test';
import assert from 'node:assert/strict';
import {residenceOrganizationDocument} from '../residence-organization-document.ts';
const request=new Request('https://example.test/api/residence/organization-document');
test('organization document requires an authenticated owner and is never cacheable',async()=>{
 const denied=await residenceOrganizationDocument(request,async()=>false);assert.equal(denied.status,401);assert.match(denied.headers.get('cache-control'),/no-store/);assert.ok(!(await denied.text()).includes('%PDF'));
 const allowed=await residenceOrganizationDocument(request,async()=>true);assert.equal(allowed.status,200);assert.equal(allowed.headers.get('content-type'),'application/pdf');assert.match(allowed.headers.get('content-disposition'),/attachment; filename="Horario_/);const data=new Uint8Array(await allowed.arrayBuffer());assert.equal(new TextDecoder().decode(data.slice(0,5)),'%PDF-');assert.ok(data.length>50000);
});
test('document download accepts only GET',async()=>{const r=await residenceOrganizationDocument(new Request(request.url,{method:'POST'}),async()=>true);assert.equal(r.status,405);assert.equal(r.headers.get('allow'),'GET');});
