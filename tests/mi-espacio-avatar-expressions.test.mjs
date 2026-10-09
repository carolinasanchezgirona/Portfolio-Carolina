import { test } from "node:test";
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
const source = readFileSync("app/mi-espacio/mood-tracker.tsx","utf8");
test("all eight characters have distinct expression coordinate presets",()=>{
  const block=source.slice(source.indexOf("const FACE_LANDMARKS:"),source.indexOf("function CompanionExpression("));
  const avatars=["boy","girl","teen-boy","teen-girl","adult-man","adult-woman","senior-man","senior-woman"];
  for (const avatar of avatars) assert.ok(block.includes(`"${avatar}":`),avatar);
});
test("selected mood drives companion expression, not just the mood buttons",()=>{
  assert.match(source, /function CompanionExpression\(/);
  assert.match(source, /<CompanionExpression mood={mood} avatarId={avatarId}/);
  assert.match(source, /<MoodFriend mood={selected \|\| 3} avatarId={avatar}/);
  assert.match(source, /mood === 1/);
  assert.match(source, /mood === 2/);
  assert.match(source, /mood === 3/);
  assert.match(source, /mood === 4/);
  assert.match(source, /mood === 5/);
});
test("avatar selection previews still show the clean portrait",()=>{
  assert.match(source, /portraitOnly/);
  assert.match(source, /!portraitOnly && !isOlderMan/);
});
