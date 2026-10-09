import { test } from "node:test";
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const source = readFileSync("app/mi-espacio/mood-tracker.tsx", "utf8");
const avatars = ["boy", "girl", "teen-boy", "teen-girl", "adult-man", "adult-woman", "senior-man", "senior-woman"];

test("all eight avatars are represented without changing stored identifiers", () => {
  for (const avatar of avatars) assert.ok(source.includes(`id: "${avatar}"`), avatar);
  assert.equal((source.match(/stage: "/g) || []).length, 8);
});
test("five emotion states pick five complete images, not facial overlays", () => {
  assert.match(source, /backgroundImage: 'url\("\/mi-espacio-art\/40-estados-3d\.webp"\)'/);
  assert.match(source, /backgroundSize: "500% 800%"/);
  assert.match(source, /\(displayedMood - 1\) \* 25/);
  assert.match(source, /\(portraitRow \/ 7\) \* 100/);
  assert.match(source, /<MoodFriend mood={selected \|\| 3} avatarId={avatar}/);
  assert.doesNotMatch(source, /CompanionExpression|FACE_LANDMARKS|mood-expression-layer/);
});
test("initial character and settings use the same identity as mood check-in", () => {
  assert.match(source, /portraitOnly \? 3/);
  assert.match(source, /<MoodFriend mood={4} avatarId={avatar.id} portraitOnly/);
  assert.match(source, /async function saveAvatar/);
});
