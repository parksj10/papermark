import { Ratelimit } from "@upstash/ratelimit";
import { Redis as UpstashRedis } from "@upstash/redis";
import IORedis from "ioredis";

// Optional local Redis support
let useLocal = false;
if (
  !process.env.UPSTASH_REDIS_REST_URL ||
  !process.env.UPSTASH_REDIS_REST_TOKEN ||
  process.env.USE_LOCAL_REDIS === "true"
) {
  useLocal = true;
}

// Minimal KV interface used across the app
type KVAdapter = {
  get: (key: string) => Promise<string | null>;
  set: (
    key: string,
    value: string,
    options?: { ex?: number; px?: number; nx?: boolean },
  ) => Promise<any>;
  del: (key: string) => Promise<number>;
};

let redis: KVAdapter;
let lockerRedisClient: KVAdapter;

// Exported ratelimit factory signature compatible with existing calls
const createNoopRatelimit =
  () =>
  (
    requests: number = 10,
    _seconds:
      | `${number} ms`
      | `${number} s`
      | `${number} m`
      | `${number} h`
      | `${number} d` = "10 s",
  ) => {
    return {
      async limit(_key: string) {
        return {
          success: true,
          limit: requests,
          remaining: requests,
          reset: Math.floor(Date.now() / 1000) + 60,
        } as const;
      },
    };
  };

export const ratelimit = useLocal
  ? createNoopRatelimit()
  : (
      requests: number = 10,
      seconds:
        | `${number} ms`
        | `${number} s`
        | `${number} m`
        | `${number} h`
        | `${number} d` = "10 s",
    ) => {
      return new Ratelimit({
        redis: new UpstashRedis({
          url: process.env.UPSTASH_REDIS_REST_URL as string,
          token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
        }),
        limiter: Ratelimit.slidingWindow(requests, seconds),
        analytics: true,
        prefix: "papermark",
      });
    };

if (useLocal) {
  const url = process.env.LOCAL_REDIS_URL || "redis://redis:6379";
  const client = new IORedis(url);

  const adapter: KVAdapter = {
    async get(key) {
      // Return raw string to match Upstash behavior
      return client.get(key);
    },
    async set(key, value, options) {
      // Support PX (ms), EX (s), and NX flags
      const args: any[] = [];
      if (options?.px) {
        args.push("PX", options.px);
      } else if (options?.ex) {
        args.push("EX", options.ex);
      }
      if (options?.nx) {
        args.push("NX");
      }
      return client.set(key, value, ...args);
    },
    async del(key) {
      return client.del(key);
    },
  };

  redis = adapter;
  lockerRedisClient = adapter;
} else {
  // Upstash default
  const upstash = new UpstashRedis({
    url: process.env.UPSTASH_REDIS_REST_URL as string,
    token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
  });
  const upstashLocker = new UpstashRedis({
    url: process.env.UPSTASH_REDIS_REST_LOCKER_URL as string,
    token: process.env.UPSTASH_REDIS_REST_LOCKER_TOKEN as string,
  });

  // Upstash client already implements get/set/del signatures used above
  redis = upstash as unknown as KVAdapter;
  lockerRedisClient = upstashLocker as unknown as KVAdapter;
}

export { redis, lockerRedisClient };
