import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const originalPrisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") global.prisma = originalPrisma;

// Apply overrides if needed
const BYPASS_PLAN_RESTRICTIONS =
  process.env.NEXT_PUBLIC_BYPASS_PLAN_RESTRICTIONS === "true";

const prisma = BYPASS_PLAN_RESTRICTIONS
  ? new Proxy(originalPrisma, {
      get(target, prop) {
        if (prop === "team") {
          return new Proxy(target.team, {
            get(teamTarget, teamProp) {
              if (
                ["findUnique", "findFirst", "findMany"].includes(
                  teamProp as string,
                )
              ) {
                return async function (args: any) {
                  // Remove plan restrictions from where clauses
                  if (args?.where?.plan) {
                    const { plan, ...restWhere } = args.where;
                    args = { ...args, where: restWhere };
                  }

                  const result = await (teamTarget as any)[teamProp](args);
                  if (result) {
                    if (Array.isArray(result)) {
                      return result.map((team) => ({
                        ...team,
                        plan: "datarooms-plus",
                      }));
                    } else {
                      return { ...result, plan: "datarooms-plus" };
                    }
                  }
                  return result;
                };
              }
              return (teamTarget as any)[teamProp];
            },
          });
        }
        return (target as any)[prop];
      },
    })
  : originalPrisma;

export default prisma;
