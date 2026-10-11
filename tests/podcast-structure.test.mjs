import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");
test("podcast stays under Recursos in mobile and desktop, not top-level", () => {
  const shell = read("app/components/site-shell.tsx");
  assert.match(shell, /href: "\/podcast\/", label: "Psicología Incómoda · Podcast"/);
  assert.match(shell, /currentPath\.startsWith\("\/podcast\/"\)/);
  assert.match(shell, /resourceNavigation\.map/);
});
test("podcast landing, episode and SEO routes exist", () => {
  assert.match(read("app/podcast/page.tsx"), /PodcastSeries/);
  assert.match(read("app/podcast/[slug]/page.tsx"), /generateStaticParams/);
  assert.match(read("app/podcast/[slug]/page.tsx"), /PodcastEpisode/);
  assert.match(read("app/sitemap.ts"), /episodes\.map/);
});
test("podcast player never loads a third-party iframe before interaction", () => {
  const player = read("app/podcast/episode-player.tsx");
  assert.match(player, /showSpotify/);
  assert.match(player, /setShowSpotify\(true\)/);
  assert.match(player, /getSpotifyEpisodeId/);
  assert.match(player, /Tu navegador no admite/);
});
