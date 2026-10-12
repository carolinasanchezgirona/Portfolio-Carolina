import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { slugifyQuestion } from "../app/lib/question-slug.ts";

test("published question anchors match the database constraint", () => {
  const inputs = [
    "¿Es normal que cada vez me apetezca menos quedar con gente?",
    "¿Necesito un psicólogo? ¡Tengo ansiedad! 😅",
    "Esto   tiene   espacios y símbolos / ¿@#",
    "a".repeat(149) + " más-palabras",
    "¿".repeat(100) + "Una pregunta",
    "¿Estás bien? 2026/10/12",
  ];
  for (const input of inputs) {
    const slug = slugifyQuestion(input);
    assert.match(slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(slug.length <= 150);
  }
});

test("a long question cannot be truncated onto a trailing hyphen", () => {
  assert.equal(slugifyQuestion("a".repeat(149) + " palabras"), "a".repeat(149));
});

test("the editorial draft does not use clinical reasoning model settings", () => {
  const worker = readFileSync(new URL("../worker.ts", import.meta.url), "utf8");
  const handler = worker.split("async function handleQuestionDraft")[1]?.split("function hexToBytes")[0] || "";
  assert.match(handler, /model: env\.OPENAI_TEXT_MODEL \|\| "gpt-4\.1-mini"/);
  assert.doesNotMatch(handler, /OPENAI_CLINICAL_MODEL|temperature:/);
  assert.match(handler, /store: false/);
  assert.match(handler, /response\.status === 429/);
  assert.match(handler, /publicQuestion\.length < 20 \|\| answer\.length < 80/);
});
