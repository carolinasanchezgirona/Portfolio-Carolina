import assert from "node:assert/strict";
import { test } from "node:test";
import { evaluatePortalEntitlement } from "../patient-portal-access.ts";
const now = Date.parse("2026-10-09T00:00:00Z");
const future = "2026-11-01T00:00:00Z";
const past = "2026-09-01T00:00:00Z";

test("Active clinical treatment includes tools without paid subscription", () => {
  const result = evaluatePortalEntitlement("active", null, true, now);
  assert.equal(result.mode, "therapy_included");
  assert.equal(result.can_access, true);
});
test("Discharged patient without subscription cannot use gated digital service", () => {
  const result = evaluatePortalEntitlement("discharged", null, true, now);
  assert.equal(result.mode, "ended");
  assert.equal(result.can_access, false);
});
test("Verified active subscription grants post-therapy access before period end", () => {
  const result = evaluatePortalEntitlement("discharged", {status:"active",current_period_end:future}, true, now);
  assert.equal(result.mode, "subscription");
  assert.equal(result.can_access, true);
});
test("Expired or canceled subscription is denied when enforcement is enabled", () => {
  for (const status of ["active","canceled","past_due","unpaid","incomplete"]) {
    const result = evaluatePortalEntitlement("discharged", {status,current_period_end:past}, true, now);
    assert.equal(result.can_access,false,status);
  }
});
test("Trials need nonexpired period end; malformed dates fail closed", () => {
  assert.equal(evaluatePortalEntitlement("discharged",{status:"trialing",current_period_end:future},true,now).can_access,true);
  assert.equal(evaluatePortalEntitlement("discharged",{status:"trialing",current_period_end:"not-a-date"},true,now).can_access,false);
  assert.equal(evaluatePortalEntitlement("discharged",{status:"trialing",current_period_end:null},true,now).can_access,false);
});
test("Staged rollout never blocks currently entitled patient without activation", () => {
  const result = evaluatePortalEntitlement("discharged",null,false,now);
  assert.equal(result.mode,"ended");
  assert.equal(result.enforcement_enabled,false);
  assert.equal(result.can_access,true);
});
test("Subscription data unavailable reports a distinct outage, rather than inventing a status", () => {
  const result = evaluatePortalEntitlement("discharged",null,true,now,true);
  assert.equal(result.mode,"temporarily_unavailable");
  assert.equal(result.can_access,false);
});
