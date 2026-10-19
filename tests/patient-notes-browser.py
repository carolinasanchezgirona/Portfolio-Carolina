import json
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
A='11111111-1111-4111-8111-111111111111';B='22222222-2222-4222-8222-222222222222'
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,args=['--no-sandbox']);page=browser.new_page()
 # Use an actual origin, with a fully synthetic clinical API and no real patient records.
 page.route('https://notes.test/',lambda r:r.fulfill(content_type='text/html',body='''<textarea id="clinic-private-notes-body"></textarea><button id="clinic-private-notes-save">Guardar notas</button><button id="clinic-private-notes-reload">Recargar</button><p id="clinic-private-notes-status"></p><span id="clinic-private-notes-date"></span>'''))
 rows={A:{'patient_id':A,'body':'Preparar informe','revision':1,'updated_at':'2026-10-19T17:00:00Z'}};calls=[];conflict=False
 def api(route):
  req=route.request;calls.append(req)
  from urllib.parse import urlparse,parse_qs
  query=parse_qs(urlparse(req.url).query);pid=query.get('patient_id',[''])[0].replace('eq.','');result=[]
  if req.method=='GET': result=[rows[pid]] if pid in rows else []
  elif req.method=='PATCH':
   data=req.post_data_json
   if not conflict and str(rows[pid]['revision'])==query['revision'][0].replace('eq.',''):rows[pid].update(data);result=[rows[pid]]
  elif req.method=='POST':data=req.post_data_json;rows[data['patient_id']]=data;result=[data]
  route.fulfill(status=200,content_type='application/json',body=json.dumps(result))
 page.route('**/rest/v1/clinical_patient_notes**',api);page.goto('https://notes.test/');page.evaluate("sessionStorage.setItem('dememoria_admin_session',JSON.stringify({access_token:'FAKE-TEST'}))");page.add_script_tag(content=(root/'public/clinic-patient-notes.js').read_text())
 def open_patient(pid):page.evaluate('(id)=>window.dispatchEvent(new CustomEvent("clinical:patient-opened",{detail:{patientId:id}}))',pid)
 field=page.locator('#clinic-private-notes-body');save=page.locator('#clinic-private-notes-save')
 open_patient(A);page.wait_for_function("document.querySelector('#clinic-private-notes-body').value==='Preparar informe'");field.fill('Revisar escala');save.click();page.wait_for_function("document.querySelector('#clinic-private-notes-status').textContent==='Notas guardadas.'");assert rows[A]['body']=='Revisar escala';assert rows[A]['revision']==2
 field.fill('Borrador A');open_patient(B);page.wait_for_function("!document.querySelector('#clinic-private-notes-body').disabled");assert field.input_value()=='';field.fill('Notas B');save.click();page.wait_for_function("document.querySelector('#clinic-private-notes-status').textContent==='Notas guardadas.'");assert rows[B]['body']=='Notas B'
 open_patient(A);assert field.input_value()=='Borrador A';conflict=True;save.click();page.wait_for_function("document.querySelector('#clinic-private-notes-status').textContent.includes('otra ventana')");assert field.input_value()=='Borrador A';assert rows[A]['body']=='Revisar escala'
 assert all(r.headers.get('authorization')=='Bearer FAKE-TEST' for r in calls)
 print('PASS: load, save, patient isolation, preserved drafts and concurrent-edit conflict; synthetic data only')
 page.evaluate("document.querySelector('#clinic-private-notes-reload').click()");browser.close()
