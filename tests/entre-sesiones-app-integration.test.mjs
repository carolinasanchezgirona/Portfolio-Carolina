import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const route = readFileSync("app/entre-sesiones/app/espacio/page.tsx", "utf8");
const app = readFileSync("app/entre-sesiones/app/panel.tsx", "utf8");
const portal = readFileSync("public/mi-espacio.js", "utf8");
const portalPage = readFileSync("app/mi-espacio/page.tsx", "utf8");
const css = readFileSync("app/entre-sesiones/app/espacio/portal-app.css", "utf8");
const appCss = readFileSync("app/entre-sesiones/app/app.css", "utf8");
const manifest = JSON.parse(readFileSync("public/entre-sesiones-app.webmanifest", "utf8"));

test("protected patient portal is reused inside the installable application's scope", () => {
  assert.match(route, /import MiEspacioPage from "\.\.\/\.\.\/\.\.\/mi-espacio\/page"/);
  assert.match(route, /<MiEspacioPage \/>/);
  assert.match(route, /robots: \{ index: false/);
  assert.match(route, /manifest: "\/entre-sesiones-app\.webmanifest"/);
  assert.equal(manifest.scope, "/entre-sesiones/app/");
  assert.equal(manifest.start_url, "/entre-sesiones/app/");
  assert.match(route, /\/entre-sesiones\/app\/espacio\/\?vista=/);
  assert.doesNotMatch(route, /<iframe\b/i);
});

test("home and portal navigation use only installed-app scope", () => {
  assert.match(app, /const workspace = "\/entre-sesiones\/app\/espacio\/\?vista=terapia"/);
  assert.match(app, /const wellness = "\/entre-sesiones\/app\/espacio\/\?vista=wellness"/);
  assert.match(app, /const progress = "\/entre-sesiones\/app\/espacio\/\?vista=progreso"/);
  assert.match(app, /className="esapp-home-bottom-nav"/);
  assert.match(route, /className="esapp-bottom-nav"/);
  assert.match(css, /safe-area-inset-bottom/);
  assert.match(css, /@media\(max-width:760px\)/);
  assert.match(appCss, /esapp-home-bottom-nav/);
  for (const view of ["terapia", "wellness", "progreso", "configuracion"]) {
    assert.match(route, new RegExp('base \\+ "' + view + '"'));
  }
});

test("existing public login keeps separate-tab behavior but installed app stays in the same page", () => {
  assert.match(portal, /insideEntreSesionesApp = window\.location\.pathname\.startsWith\("\/entre-sesiones\/app\/espacio"\)/);
  assert.match(portal, /insideEntreSesionesApp \? null : window\.open\("about:blank", "_blank"\)/);
  assert.match(portal, /if \(insideEntreSesionesApp\) \{\s*renderPatientPortal\(session\)/);
  assert.match(portal, /if \(newTab && !newTab\.closed\) \{\s*newTab\.location\.replace\(url\)/);
  assert.match(portal, /const requestedPanels = \{ terapia: "therapy", wellness: "wellness", progreso: "progress"/);
  assert.match(portal, /if \(name !== "wellness"\) document\.dispatchEvent\(new Event\("wellness:interactive-reset"\)\)/);
  assert.match(portalPage, /src="\/mi-espacio\.js\?v=20261017-[a-z0-9-]+"/);
});

test("patient confidentiality and underlying portal features remain unchanged", () => {
  assert.match(portal, /fetch\("\/api\/patient-portal\/session"/);
  assert.match(portal, /credentials: "include"/);
  assert.match(portal, /fetch\("\/api\/patient-portal\/response"/);
  assert.match(portalPage, /id="space-login-form"/);
  assert.match(portalPage, /id="wellness-interactive"/);
  assert.match(portalPage, /data-space-panel="therapy"/);
  assert.match(portalPage, /data-space-panel="wellness"/);
  assert.match(portalPage, /data-space-panel="progress"/);
});


test("installed app tabs navigate in place, preserve history and guard protected controls", () => {
  assert.match(portal, /function navigateToView\(name\)/);
  assert.match(portal, /window\.history\.pushState/);
  assert.match(portal, /window\.addEventListener\("popstate"/);
  assert.match(portal, /event\.preventDefault\(\);\s*navigateToView\(name\)/);
  assert.match(portal, /if \(!state\.portalAuthenticated/);
  assert.match(portal, /button\.setAttribute\("aria-pressed", String\(active\)\)/);
  assert.match(portal, /tabs\.hidden = true/);
  assert.match(portal, /tabs\.hidden = false/);
  assert.match(route, /className="esapp-bottom-nav"[^>]+hidden/);
  assert.match(css, /\.esapp-bottom-nav\[hidden\]\{display:none!important\}/);
});


test("Home and protected portal use consistent SVG navigation", () => {
  const homeNav = app.match(/<nav className="esapp-home-bottom-nav"[\s\S]*?<\/nav>/)?.[0];
  const portalNav = route.match(/<nav className="esapp-bottom-nav"[\s\S]*?<\/nav>/)?.[0];
  assert.ok(homeNav && portalNav, "Both navigation bars must exist");
  assert.equal((homeNav.match(/<svg\b/g) || []).length, 5);
  assert.equal((portalNav.match(/<svg\b/g) || []).length, 5);
  for (const label of ["Inicio", "Mi terapia", "Wellness", "Progreso", "Cuenta"]) {
    assert.ok(homeNav.includes(label) && portalNav.includes(label), label + " missing from navigation");
  }
  assert.match(homeNav, /esapp-nav-heart/);
  assert.match(portalNav, /esapp-nav-heart/);
  assert.doesNotMatch(homeNav, /<span aria-hidden="true">[⌂▤◉☷]/);
});
