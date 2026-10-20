// Run against `npm run dev`, or use RESIDENCE_START_SERVER=1 to start one.
// RESIDENCE_STATIC=1 tests the compiled `out` export instead (requires Python 3).
const assert = require('node:assert/strict');
const {spawn} = require('node:child_process');
const path = require('node:path');
const screenshot = name => path.join(process.env.RESIDENCE_SCREENSHOT_DIR || require('node:os').tmpdir(), name);
const {chromium} = require('playwright');

(async () => {
  const port = process.env.RESIDENCE_START_SERVER ? 3100 : 3000;
  const base = `http://127.0.0.1:${port}`;
  let server, browser;
  const errors = [];
  let writes = 0;
  try {
    if (process.env.RESIDENCE_START_SERVER) {
      server = process.env.RESIDENCE_STATIC ? spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1', '--directory', 'out'], {stdio: ['ignore', 'pipe', 'pipe']}) : spawn(process.execPath, [require.resolve('next/dist/bin/next'), 'dev', '--hostname', '127.0.0.1', '--port', String(port)], {stdio: ['ignore', 'pipe', 'pipe']});
      server.stdout.on('data', chunk => {if(process.env.RESIDENCE_DEBUG)process.stdout.write(chunk)});
      server.stderr.on('data', chunk => {if(process.env.RESIDENCE_DEBUG)process.stderr.write(chunk)});
      for (let i = 0; i < 90; i++) {
        try { if ((await fetch(base + '/admin/residencia/', {signal: AbortSignal.timeout(4000)})).ok) break; } catch {}
        if (i === 89) throw Error('Development server did not start');
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    browser = await chromium.launch({headless: true, executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--no-sandbox', '--disable-dev-shm-usage']});
    const context = await browser.newContext({viewport: {width: 1440, height: 1000}, serviceWorkers: 'block'});
    const registries = () => Object.fromEntries(['assessments', 'scales', 'goals', 'followups', 'reports', 'interviews', 'attendance', 'incidents', 'meetings', 'documents'].map(k => [k, []]));
    let residents = [{id: 'fictitious-1', code: 'R-001', center: 'Centro ficticio', status: 'active', revision: 1, data: {...registries(), profile: {name: 'Residente ficticia', admission: '2026-01-01'}, goals: [{id: 'goal-1', date: '2026-01-01', next: '2026-01-02', state: 'En curso', objective: 'Objetivo ficticio pendiente'}]}}];
    await context.route('https://grgyvdxkjdstdyumdfyg.supabase.co/**', async route => {
      const req = route.request(), url = new URL(req.url());
      let body;
      if (url.pathname === '/auth/v1/user') body = {id: '9d2cfdb1-fed6-4f76-b47a-d58507eb14f2'};
      else if (url.pathname === '/rest/v1/residence_records') {
        if (req.method() === 'GET') body = residents;
        else {
          writes++;
          const row = req.postDataJSON();
          residents = residents.map(r => r.id === row.id ? row : r);
          body = [row];
        }
      } else if (['/rest/v1/residence_schedule', '/rest/v1/residence_schedule_types'].includes(url.pathname)) body = [];
      else throw Error('Unexpected API request: ' + url.pathname);
      await route.fulfill({json: body});
    });
    await context.addInitScript(() => sessionStorage.setItem('dememoria_admin_session', JSON.stringify({access_token: 'FAKE_TEST_TOKEN'})));
    const page = await context.newPage();
    page.setDefaultTimeout(15000);
    if(process.env.RESIDENCE_DEBUG) console.log('Browser launched');
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(base + '/admin/residencia/');
    const nav = page.getByRole('navigation', {name: 'Secciones de residencia'});
    await page.getByRole('heading', {name: 'Tu trabajo en residencia'}).waitFor();
    assert.deepEqual(await nav.getByRole('button').allTextContents(), ['Inicio', 'Residentes', 'Horario']);
    assert.equal(writes, 0);
    assert.equal(await page.getByRole('heading', {name: 'Residente ficticia', exact: true}).count(), 0);
    assert.equal(await page.locator('#res-pending-goals .res-review-item').count(), 1);
    await page.screenshot({path: screenshot('residence-menu-desktop.png'), fullPage: true});
    await nav.getByRole('button', {name: 'Residentes', exact: true}).click();
    assert.equal(await page.getByRole('navigation', {name: 'Áreas clínicas del historial'}).count(), 0);
    await page.getByRole('button', {name: /Residente ficticia/}).click();
    const clinical = page.getByRole('navigation', {name: 'Áreas clínicas del historial'});
    assert.deepEqual(await clinical.getByRole('button').allTextContents(), ['Historia clínica', 'Valoraciones', 'PIAI', 'Diario', 'Informes']);
    await page.locator('summary').filter({hasText: 'Perfil clínico por dominios'}).click();
    await page.getByRole('heading', {name: /Perfil clínico por dominios/}).waitFor();
    await clinical.getByRole('button', {name: 'Valoraciones', exact: true}).click();
    await page.getByLabel('Elegir prueba para nueva aplicación').waitFor();
    await page.getByRole('button', {name: 'Revisiones clínicas', exact: true}).click();
    await page.getByRole('button', {name: '+ Añadir registro', exact: true}).click();
    await page.getByRole('combobox', {name: 'Tipo de valoración', exact: true}).selectOption('Semestral');
    await page.getByLabel('Síntesis e implicaciones para el PIAI', {exact: true}).fill('Síntesis ficticia de prueba.');
    await page.getByRole('button', {name: 'Guardar registro', exact: true}).click();
    await page.getByText('Guardado correctamente.', {exact: true}).waitFor();
    assert.equal(residents[0].data.assessments.length, 1);
    assert.equal(residents[0].data.assessments[0].type, 'Semestral');
    await clinical.getByRole('button', {name: 'Diario', exact: true}).click();
    await page.getByRole('button', {name: '+ Nueva entrada', exact: true}).click();
    await page.getByLabel('Cognición', {exact: true}).check();
    await page.getByLabel('Entrada del diario *', {exact: true}).fill('Entrada ficticia para verificar navegación y guardado.');
    page.once('dialog', async d => {if(process.env.RESIDENCE_DEBUG)console.log('Dismiss dialog:',d.message());await d.dismiss()});
    await nav.getByRole('button', {name: 'Inicio', exact: true}).click();
    assert.equal(await page.locator('.res-diary-editor textarea').first().inputValue(), 'Entrada ficticia para verificar navegación y guardado.');
    await page.getByRole('button', {name: 'Guardar registro', exact: true}).click();
    await page.getByText('Guardado correctamente.', {exact: true}).waitFor();
    assert.equal(residents[0].data.followups.length, 1);
    assert(residents[0].data.followups[0].createdAt);
    await clinical.getByRole('button', {name: 'Informes', exact: true}).click();
    await page.getByRole('button', {name: '+ Nuevo informe', exact: true}).waitFor();
    await clinical.getByRole('button', {name: 'PIAI', exact: true}).click();
    await page.getByText('Objetivo ficticio pendiente', {exact: false}).waitFor();
    await page.getByText('Entrevistas, actividades y documentación', {exact: true}).click();
    for (const kind of ['interviews', 'attendance', 'incidents', 'meetings', 'documents']) {
      await page.getByLabel('Apartado del historial', {exact: true}).selectOption(kind);
      assert.equal(await page.getByRole('button', {name: '+ Añadir registro', exact: true}).count(), 1);
    }
    await nav.getByRole('button', {name: 'Horario', exact: true}).click();
    await page.getByRole('heading', {name: 'Horario de residencia', exact: true}).waitFor();
    await nav.getByRole('button', {name: 'Inicio', exact: true}).click();
    await page.getByRole('button', {name: 'Revisar objetivo', exact: true}).click();
    await page.getByLabel('Objetivo significativo para la persona', {exact: true}).waitFor();
    // Discard the editor to inspect mobile layouts without altering more records.
    page.once('dialog', d => d.accept());
    await nav.getByRole('button', {name: 'Inicio', exact: true}).click();
    for (const width of [360, 390, 768, 1024, 1440]) {
      await page.setViewportSize({width, height: 844});
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Overflow at width ' + width);
      const numbers = await page.locator('.res-stats strong').evaluateAll(els => els.map(el => Math.round(el.getBoundingClientRect().top)));
      assert.equal(new Set(numbers).size, 1, 'Stat figures must align at width ' + width);
      const position = await nav.evaluate(el => getComputedStyle(el).position);
      assert.equal(position, width <= 760 ? 'fixed' : 'sticky');
    }
    await page.setViewportSize({width: 390, height: 844});
    await page.screenshot({path: screenshot('residence-menu-mobile.png'), fullPage: true});
    await nav.getByRole('button', {name: 'Residentes', exact: true}).click();
    await page.getByRole('button', {name: /Residente ficticia/}).click();
    for (const label of ['Historia clínica', 'Valoraciones', 'PIAI', 'Diario', 'Informes']) {
      await clinical.getByRole('button', {name: label, exact: true}).click();
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Resident overflow in ' + label);
    }
    await page.screenshot({path: screenshot('residence-resident-mobile.png'), fullPage: true});
    const anon = await browser.newPage();
    await anon.goto(base + '/admin/residencia/');
    await anon.getByText('Inicia sesión en el administrador para acceder.', {exact: true}).waitFor();
    assert.equal(await anon.getByRole('button', {name: '+ Nuevo residente', exact: true}).count(), 0);
    assert.equal(writes, 2);
    assert.deepEqual(errors, []);
    console.log('PASS: three main destinations; resident-only clinical areas; assessments and diary saved; unsaved editor preserved; all secondary records accessible; direct pending links; five responsive widths; anonymous access blocked. All data fictitious.');
  } finally {
    if (browser) await browser.close();
    if (server) {server.kill('SIGTERM');server.stdout.destroy();server.stderr.destroy();server.unref();}
  }
})().catch(e => {console.error(e); process.exitCode = 1;});
