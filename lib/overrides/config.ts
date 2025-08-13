// Configuration for development overrides
export const BYPASS_PLAN_RESTRICTIONS =
  process.env.NEXT_PUBLIC_BYPASS_PLAN_RESTRICTIONS === "true";

// Default limits for unrestricted access
export const UNLIMITED_LIMITS = {
  users: Infinity,
  links: null,
  documents: null,
  domains: Infinity,
  datarooms: Infinity,
  customDomainOnPro: true,
  customDomainInDataroom: true,
  advancedLinkControlsOnPro: true,
  conversationsInDataroom: true,
  watermarkOnBusiness: true,
  usage: { documents: 0, links: 0, users: 0 },
  dataroomUpload: true,
  fileSizeLimits: {
    video: Infinity,
    document: Infinity,
    image: Infinity,
    excel: Infinity,
    maxFiles: Infinity,
    maxPages: Infinity,
  },
} as const;

// Plan override configuration
export const PLAN_OVERRIDE = {
  plan: "datarooms-plus" as const,
  planName: "Data Rooms Plus",
  originalPlan: "datarooms-plus",
  trial: null,
  isTrial: false,
  isOldAccount: false,
  isCustomer: true,
  isAnnualPlan: true,
  isFree: false,
  isStarter: false,
  isPro: false,
  isBusiness: false,
  isDatarooms: true,
  isDataroomsPlus: true,
  loading: false,
  error: null,
} as const;
