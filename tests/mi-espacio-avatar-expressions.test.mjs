import {test} from "node:test";
import {readFileSync} from "node:fs";
import assert from "node:assert/strict";
const source=readFileSync("app/mi-espacio/mood-tracker.tsx","utf8");
test("all eight avatars select complete rendered expressions",()=>{
 assert.match(source,/backgroundSize: "500% 800%"/);
 assert.match(source,/\(expression - 1\) \* 25/);
 assert.match(source,/index \* 100 \/ 7/);
 assert.doesNotMatch(source,/CompanionExpression|FACE_LANDMARKS|mood-expression-layer/);
 assert.match(source,/<MoodFriend mood={selected \|\| 3} avatarId={avatar}/);
});
test("avatar choice previews use the same identity with a warm expression",()=>{
 assert.match(source,/portraitOnly \? 4/);
 assert.ok(source.includes("<MoodFriend mood={4} avatarId={avatar.id} portraitOnly"));
});
