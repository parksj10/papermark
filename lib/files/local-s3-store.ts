import { S3 } from "@aws-sdk/client-s3";
import slugify from "@sindresorhus/slugify";
import { S3Store } from "@tus/s3-store";
import path from "node:path";

/**
 * Simple S3Store implementation for local development with MinIO
 * This bypasses the complex multi-region setup and team-specific configurations
 */
export class LocalS3Store extends S3Store {
  constructor() {
    const s3ClientConfig = {
      region: process.env.NEXT_PRIVATE_UPLOAD_REGION || "us-east-1",
      endpoint:
        process.env.NEXT_PRIVATE_UPLOAD_ENDPOINT || "http://localhost:9000",
      credentials: {
        accessKeyId:
          process.env.NEXT_PRIVATE_UPLOAD_ACCESS_KEY_ID || "papermark",
        secretAccessKey:
          process.env.NEXT_PRIVATE_UPLOAD_SECRET_ACCESS_KEY || "papermark123",
      },
      forcePathStyle: true, // Required for MinIO
    };

    super({
      partSize: 8 * 1024 * 1024, // 8MiB parts
      s3ClientConfig: {
        ...s3ClientConfig,
        bucket: process.env.NEXT_PRIVATE_UPLOAD_BUCKET || "papermark-uploads",
      },
    });
  }
}
