import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const read = (path) => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

async function renderList({ category = 'all', search = '', rows, fail = false, cards = [] } = {}) {
  const links = ['all', 'psicologia', 'neuropsicologia'].map((value) => ({
    dataset: { category: value }, active: false, current: null,
    classList: { toggle(name, active) { links.find((link) => link.dataset.category === value).active = active; } },
    setAttribute(name, value) { this.current = value; }, removeAttribute() { this.current = null; },
  }));
  const status = { hidden: false, textContent: '' };
  const grid = { cards: cards.map((category) => ({ dataset: { articleCategory: category }, hidden: false })),
    querySelectorAll(selector) { return selector === '[data-article-category]' ? this.cards : []; },
    replaceChildren() { this.cards = []; }, append(card) { this.cards.push(card); },
  };
  const document = {
    querySelector(selector) { return ({ '[data-articles-view]': { dataset: { articlesView: 'list', articleFilter: category } }, '#articles-grid': grid, '#articles-status': status })[selector]; },
    querySelectorAll() { return links; },
    createElement() { return { dataset: {}, textContent: '', innerHTML: '' }; },
  };
  vm.runInNewContext(read('public/articles-public.js'), {
    document, window: { location: { search, origin: 'https://carolinasanchezgirona.com' } }, URL, URLSearchParams, Intl,
    fetch: async () => { if (fail) throw new Error('offline'); return { ok: true, json: async () => rows || [] }; },
  });
  await new Promise(setImmediate);
  return { grid, status, links };
}

test('legacy category filters exported cards even if the live request fails', async () => {
  const { grid, status, links } = await renderList({ search: '?categoria=neuropsicologia', fail: true, cards: ['psicologia', 'neuropsicologia'] });
  assert.deepEqual(grid.cards.map((card) => card.hidden), [true, false]);
  assert.equal(status.hidden, true);
  assert.equal(links.find((link) => link.active).dataset.category, 'neuropsicologia');
});

test('empty neuropsychology category never displays psychology articles offline', async () => {
  const { grid, status } = await renderList({ category: 'neuropsicologia', fail: true, cards: ['psicologia'] });
  assert.equal(grid.cards[0].hidden, true);
  assert.equal(status.hidden, false);
  assert.match(status.textContent, /Todavía no hay artículos publicados de Neuropsicología/);
});

test('canonical category remains selected and filters live updates', async () => {
  const { grid, links } = await renderList({ category: 'neuropsicologia', search: '?categoria=psicologia', rows: [
    { slug: 'memoria', category: 'neuropsicologia', content: '' },
    { slug: 'ansiedad', category: 'psicologia', content: '' },
  ] });
  assert.equal(grid.cards.length, 1);
  assert.equal(grid.cards[0].dataset.articleCategory, 'neuropsicologia');
  assert.equal(links.find((link) => link.current === 'page').dataset.category, 'neuropsicologia');
});

test('unknown category leaves the complete list selected', async () => {
  const { grid, links } = await renderList({ search: '?categoria=otra', fail: true, cards: ['psicologia', 'neuropsicologia'] });
  assert.equal(grid.cards.every((card) => !card.hidden), true);
  assert.equal(links.find((link) => link.active).dataset.category, 'all');
});

const output = ts.transpileModule(read('worker.ts'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const exports = {};
vm.runInNewContext(output, { exports, require: () => ({}), TextEncoder, URL, Response, Request, Headers });
const worker = exports.default;

test('legacy category URLs permanently redirect and preserve campaign parameters', async () => {
  for (const category of ['psicologia', 'neuropsicologia']) {
    for (const method of ['GET', 'HEAD']) {
      const response = await worker.fetch(new Request(`https://carolinasanchezgirona.com/articulos/?categoria=${category}&utm_source=instagram`, { method }), {});
      assert.equal(response.status, 301);
      assert.equal(response.headers.get('Location'), `https://carolinasanchezgirona.com/articulos/categoria/${category}/?utm_source=instagram`);
    }
  }
});

test('general and unrelated asset URLs keep their existing behavior', async () => {
  for (const path of ['/articulos/', '/articulos/?categoria=otra', '/articulos/categoria/psicologia/', '/psicologia/?categoria=neuropsicologia']) {
    let called = false;
    const request = new Request('https://carolinasanchezgirona.com' + path);
    const response = await worker.fetch(request, { ASSETS: { fetch: async (received) => { called = received === request; return new Response('asset'); } } });
    assert.equal(called, true);
    assert.equal(await response.text(), 'asset');
  }
});
