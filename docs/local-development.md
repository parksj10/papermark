# Local Development with MinIO

This guide explains how to run Papermark locally with MinIO for S3-compatible file storage.

## Quick Start

1. **Clone and enter the repository:**
   ```bash
   git clone https://github.com/mfts/papermark.git
   cd papermark
   ```

2. **Copy the local development environment file:**
   ```bash
   cp .env.local.example .env
   ```

3. **Start all services with Docker Compose:**
   ```bash
   docker compose up
   ```

4. **Access the application:**
   - **Papermark App:** http://localhost:3000
   - **MinIO Console:** http://localhost:9001 (papermark / papermark123)

## What's included

The Docker Compose setup includes:

- **PostgreSQL Database** (port 5432)
- **MinIO S3-compatible Storage** (port 9000 for API, 9001 for console)
- **Automatic bucket creation** (`papermark-uploads`)
- **Next.js Application** (port 3000)

## MinIO Configuration

The included MinIO setup provides:

- **API Endpoint:** http://localhost:9000
- **Console URL:** http://localhost:9001
- **Access Key:** papermark
- **Secret Key:** papermark123
- **Bucket:** papermark-uploads (auto-created)

## File Upload Testing

Once everything is running:

1. Visit http://localhost:3000
2. Create an account or login
3. Upload a document - it will be stored in MinIO
4. Check the MinIO console at http://localhost:9001 to see your uploaded files

## Troubleshooting

### Services not starting

If you encounter issues:

```bash
# Stop all services
docker compose down

# Remove volumes (this will delete data)
docker compose down -v

# Restart
docker compose up --build
```

### Checking service logs

```bash
# All services
docker compose logs

# Specific service
docker compose logs minio
docker compose logs app
docker compose logs papermark-db
```

### MinIO bucket issues

If the bucket creation fails, you can create it manually:

1. Visit http://localhost:9001
2. Login with `papermark` / `papermark123`
3. Click "Create Bucket"
4. Name it `papermark-uploads`
5. Set policy to public (or leave as private for secure uploads)

## Production Deployment

For production, you should:

1. Use a managed S3 service (AWS S3, DigitalOcean Spaces, etc.)
2. Use a managed PostgreSQL database
3. Set up proper authentication and secrets
4. Configure proper CORS and security headers

See the main README.md for production deployment instructions.
