// Plan overrides for bypassing plan restrictions in development
import { getLimits as originalGetLimits } from "../../ee/limits/server";
import { useLimits as originalUseLimits } from "../../ee/limits/swr-handler";
import { usePlan as originalUsePlan } from "../../lib/swr/use-billing";
import {
  BYPASS_PLAN_RESTRICTIONS,
  PLAN_OVERRIDE,
  UNLIMITED_LIMITS,
} from "./config";

export function usePlan(options?: any) {
  const originalResult = originalUsePlan(options);

  if (BYPASS_PLAN_RESTRICTIONS) {
    return {
      ...originalResult,
      ...PLAN_OVERRIDE,
    };
  }

  return originalResult;
}

export function useLimits() {
  const originalResult = originalUseLimits();

  if (BYPASS_PLAN_RESTRICTIONS) {
    return {
      showUpgradePlanModal: false,
      limits: UNLIMITED_LIMITS,
      canAddDocuments: true,
      canAddLinks: true,
      canAddUsers: true,
      error: null,
      loading: false,
    };
  }

  return originalResult;
}

export async function getLimits(params: any) {
  if (BYPASS_PLAN_RESTRICTIONS) {
    return UNLIMITED_LIMITS;
  }

  return originalGetLimits(params);
}
