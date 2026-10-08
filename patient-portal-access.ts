/**
 * Pure portal access policy. No clinical history is exposed by this function.
 * Enforcement is deliberately opt-in, disabled until verified billing exists.
 */
export type PortalMode = "therapy_included" | "subscription" | "ended" | "pending" | "temporarily_unavailable";
export type PortalAccess = {
  mode: PortalMode;
  can_access: boolean;
  enforcement_enabled: boolean;
  subscription_status: string | null;
  current_period_end: string | null;
};
export type PortalSubscription = { status?: string | null; current_period_end?: string | null } | null;

export function evaluatePortalEntitlement(
  patientStatus: string,
  subscription: PortalSubscription,
  enforcement: boolean,
  now: number,
  subscriptionQueryFailed = false,
): PortalAccess {
  const status = typeof subscription?.status === "string" ? subscription.status : null;
  const periodEnd = typeof subscription?.current_period_end === "string" ? subscription.current_period_end : null;
  if (patientStatus === "active") {
    return {
      mode: "therapy_included", can_access: true, enforcement_enabled: enforcement,
      subscription_status: null, current_period_end: null,
    };
  }
  if (subscriptionQueryFailed) {
    return {
      mode: "temporarily_unavailable", can_access: !enforcement, enforcement_enabled: enforcement,
      subscription_status: null, current_period_end: null,
    };
  }
  const until = periodEnd ? Date.parse(periodEnd) : NaN;
  const subscribed = (status === "active" || status === "trialing") &&
    Number.isFinite(until) && until > now;
  const mode: PortalMode = subscribed ? "subscription" :
    patientStatus === "discharged" ? "ended" : "pending";
  return {
    mode, can_access: subscribed || !enforcement, enforcement_enabled: enforcement,
    subscription_status: status, current_period_end: periodEnd,
  };
}
