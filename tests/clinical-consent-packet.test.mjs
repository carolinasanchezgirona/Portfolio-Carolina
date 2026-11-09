import test from 'node:test';
import assert from 'node:assert/strict';
import { buildClinicalConsentPdf } from '../clinical-consent-pdf.ts';
test('individual consent packets are PDF files and not signatures', async () => {
  for (const kind of ['psicologico', 'neuro_evaluacion', 'neuro_intervencion']) {
    const pdf = await buildClinicalConsentPdf({full_name:'Persona de prueba', birth_date:'2000-01-01'}, kind, 'TEST-0001');
    assert.equal(Buffer.from(pdf).subarray(0,5).toString(), '%PDF-');
    assert.ok(pdf.byteLength > 2000);
  }
});
