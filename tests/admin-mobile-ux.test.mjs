import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const art = read("app/admin/articulos/page.tsx");
const res = read("app/admin/recursos/page.tsx");
const ques = read("app/admin/preguntas/page.tsx");
const artCss = read("app/admin/articulos/admin-articles.css");
const resCss = read("app/admin/recursos/recursos.css");
const quesCss = read("app/admin/preguntas/questions-admin.css");
const commonNav = read("app/admin/workspace-nav.tsx");
const artJs = read("public/admin-articles.js");
const resJs = read("public/admin-resources.js");

test("secondary modules share global navigation, with no link dump in headers", () => {
  for (const [page, active] of [[art,"articulos"],[res,"recursos"],[ques,"preguntas"]]) {
    assert.ok(page.includes('<AdminWorkspaceNav active="' + active + '" />'));
    assert.match(page, /workspace-context-menu/);
    assert.doesNotMatch(page, /<a[^>]*href="\/admin\/agenda\/"[^>]*>Agenda<\/a>/);
    assert.doesNotMatch(page, /<a[^>]*href="\/admin\/clinica\/\?panel=1"[^>]*>Historiales<\/a>/);
  }
  assert.doesNotMatch(commonNav, />Agenda de pacientes<\/a>/);
  for (const link of ["/admin/economia/", "/admin/articulos/", "/admin/recursos/", "/admin/preguntas/"]) {
    assert.ok(commonNav.includes(link), "missing " + link);
  }
});

test("mobile article and resource editors use only one visible pane", () => {
  for (const css of [artCss, resCss]) {
    assert.match(css, /max-width:900px/);
    assert.match(css, /workspace-show-editor/);
    assert.match(css, /grid-template-columns:minmax\(0,1fr\)!important/);
  }
  assert.match(artJs, /classList\.add\("workspace-show-editor"\)/);
  assert.match(resJs, /classList\.add\("workspace-show-editor"\)/);
  assert.match(art, /id="articles-back-to-list"/);
  assert.match(res, /id="resources-back-to-list"/);
});

test("question buzón and editor have a mobile back flow, no clipped empty panel", () => {
  assert.match(ques, /mobileEditorOpen/);
  assert.match(ques, /setMobileEditorOpen\(true\)/);
  assert.match(ques, /Volver al buzón/);
  assert.match(quesCss, /mobile-show-editor/);
  assert.match(quesCss, /grid-template-columns:minmax\(0,1fr\)!important/);
});

test("resources authentication cannot show login and admin panel together", () => {
  assert.match(res, /id="resources-login" className="resources-login-shell" hidden/);
  assert.match(res, /id="resources-app" className="resources-app" hidden/);
  assert.match(res, /id="resources-auth-loading"/);
  assert.match(resCss, /resources-login-shell\[hidden\],\.resources-admin-page \.resources-app\[hidden\]/);
  assert.match(resJs, /resources-auth-loading/);
  assert.match(art, /id="articles-login" className="articles-login-shell" hidden/);
});
