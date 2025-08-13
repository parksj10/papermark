<div align="center">
  <h1 align="center">Papermark</h1>
  <h3>The open-source DocSend alternative.</h3>

<a target="_blank" href="https://www.producthunt.com/posts/papermark-3?utm_source=badge-top-post-badge&amp;utm_medium=badge&amp;utm_souce=badge-papermark"><img src="https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=411605&amp;theme=light&amp;period=daily" alt="Papermark - The open-source DocSend alternative | Product Hunt" style="width:250px;height:40px"></a>

</div>

<div align="center">
  <a href="https://www.papermark.com">papermark.com</a>
</div>

<br/>

<div align="center">
  <a href="https://github.com/mfts/papermark/stargazers"><img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/mfts/papermark"></a>
  <a href="https://twitter.com/papermarkio"><img alt="Twitter Follow" src="https://img.shields.io/twitter/follow/papermarkio"></a>
  <a href="https://github.com/mfts/papermark/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/badge/license-AGPLv3-purple"></a>
</div>

<br/>

Papermark is the open-source document-sharing alternative to DocSend, featuring built-in analytics and custom domains.

## Features

- **Shareable Links:** Share your documents securely by sending a custom link.
- **Custom Branding:** Add a custom domain and your own branding.
- **Analytics:** Gain insights through document tracking and soon page-by-page analytics.
- **Self-hosted, Open-source:** Host it yourself and customize it as needed.

## Demo

![Papermark Welcome GIF](.github/images/papermark-welcome.gif)

## Tech Stack

- [Next.js](https://nextjs.org/) – Framework
- [TypeScript](https://www.typescriptlang.org/) – Language
- [Tailwind](https://tailwindcss.com/) – CSS
- [shadcn/ui](https://ui.shadcn.com) - UI Components
- [Prisma](https://prisma.io) - ORM [![Made with Prisma](https://made-with.prisma.io/dark.svg)](https://prisma.io)
- [PostgreSQL](https://www.postgresql.org/) - Database
- [NextAuth.js](https://next-auth.js.org/) – Authentication
- [Tinybird](https://tinybird.co) – Analytics
- [Resend](https://resend.com) – Email
- [Stripe](https://stripe.com) – Payments
- [Vercel](https://vercel.com/) – Hosting

## Getting Started

### Prerequisites

Here's what you need to run Papermark:

- Node.js (version >= 18.17.0)
- PostgreSQL Database
- Blob storage (currently [AWS S3](https://aws.amazon.com/s3/) or [Vercel Blob](https://vercel.com/storage/blob))
- [Resend](https://resend.com) (for sending emails)

### 1. Clone the repository

```shell
git clone https://github.com/mfts/papermark.git
cd papermark
```

### Without Docker

#### 2. Install npm dependencies

```shell
npm install
```

#### 3. Copy the environment variables to `.env` and change the values

```shell
cp .env.example .env
```

#### 4. Initialize the database

```shell
npx prisma generate
npx prisma migrate deploy
```

#### 5. Run the dev server

```shell
npm run dev
```

#### 6. Open the app in your browser

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### with Docker

#### 2. Copy the environment variables to `.env` and update for local development

For a quick start with MinIO (S3-compatible storage), copy the local development template:

```shell
cp .env.local.example .env
```

This will automatically configure MinIO for local file storage.

**Alternative:** If you prefer to start from the main example and configure manually:

```shell
cp .env.example .env
```

**Important:** For Docker development, you need to add the database variables to your `.env` file. Add these lines to your `.env` file:

```env
DATABASE_URL="postgresql://postgres:mysecretpassword@papermark-db:5432/paper?schema=public"
POSTGRES_PRISMA_URL="postgresql://postgres:mysecretpassword@papermark-db:5432/paper?schema=public"
POSTGRES_PRISMA_URL_NON_POOLING="postgresql://postgres:mysecretpassword@papermark-db:5432/paper?schema=public"
```

The other required variables for a minimal local setup are:

```env
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_MARKETING_URL=http://localhost:3000
NEXT_PUBLIC_APP_BASE_HOST=localhost
NEXT_PRIVATE_DOCUMENT_PASSWORD_KEY=your-document-password-secret-here
```

**File Storage Options:**

1. **MinIO (Recommended for local development)** - S3-compatible storage that runs locally:
```env
NEXT_PUBLIC_UPLOAD_TRANSPORT="s3"
NEXT_PRIVATE_UPLOAD_ENDPOINT="http://localhost:9000"
NEXT_PRIVATE_UPLOAD_REGION="us-east-1"
NEXT_PRIVATE_UPLOAD_BUCKET="papermark-uploads"
NEXT_PRIVATE_UPLOAD_ACCESS_KEY_ID="papermark"
NEXT_PRIVATE_UPLOAD_SECRET_ACCESS_KEY="papermark123"
NEXT_PRIVATE_UPLOAD_DISTRIBUTION_HOST="localhost:9000"
```

2. **Vercel Blob** (requires Vercel account):
```env
NEXT_PUBLIC_UPLOAD_TRANSPORT="vercel"
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
NEXT_PRIVATE_UPLOAD_DISTRIBUTION_HOST="your-blob-store.public.blob.vercel-storage.com"
```

3. **AWS S3** (requires AWS account):
```env
NEXT_PUBLIC_UPLOAD_TRANSPORT="s3"
NEXT_PRIVATE_UPLOAD_REGION="us-east-1"
NEXT_PRIVATE_UPLOAD_BUCKET="your-bucket-name"
NEXT_PRIVATE_UPLOAD_ACCESS_KEY_ID="your-access-key"
NEXT_PRIVATE_UPLOAD_SECRET_ACCESS_KEY="your-secret-key"
NEXT_PRIVATE_UPLOAD_DISTRIBUTION_HOST="your-bucket.s3.region.amazonaws.com"
```

**Note:** You can generate secure secrets for `NEXTAUTH_SECRET` and `NEXT_PRIVATE_DOCUMENT_PASSWORD_KEY` using:
```shell
openssl rand -base64 32
```

For email functionality, add your Resend API key:

```env
RESEND_API_KEY=your-resend-api-key
```

#### 3. Run docker compose up

```shell
docker compose up
```

This will:

1. Start the PostgreSQL database
2. Start MinIO (S3-compatible storage) with a web console at [http://localhost:9001](http://localhost:9001)
3. Create the `papermark-uploads` bucket automatically
4. Wait for services to be healthy
5. Build and start the app container
6. Run Prisma migrations automatically
7. Start the Next.js development server

#### 4. Open the app in your browser

Visit [http://localhost:3000](http://localhost:3000) in your browser.

**MinIO Console:** You can access the MinIO console at [http://localhost:9001](http://localhost:9001) with credentials:
- Username: `papermark`
- Password: `papermark123`

## Local Development Notes

### Authentication
For local development, you don't need to configure email sending. When you try to login with an email:

1. Go to [http://localhost:3000/login](http://localhost:3000/login)
2. Enter any email address and click "Continue with Email"
3. Check your terminal/console output for the magic login link
4. Copy and paste that URL into your browser to login

### Datarooms
By default, datarooms require a paid plan. For local development, you can bypass this restriction by setting:

```env
ENABLE_DATAROOMS_FOR_ALL=true
ENABLE_DATAROOMS_FOR_ALL=true
```

This allows free/pro plans to create and use datarooms in your local environment.

## Troubleshooting

### Common Prisma Issues

If you encounter Prisma-related errors, try these solutions:

**"Environment variable not found" error:**

- Make sure your `.env` file contains all required database variables:
  - `DATABASE_URL`
  - `POSTGRES_PRISMA_URL`
  - `POSTGRES_PRISMA_URL_NON_POOLING`
- For Docker: All three should point to `postgresql://postgres:mysecretpassword@papermark-db:5432/paper?schema=public`
- For local PostgreSQL: `postgresql://username:password@localhost:5432/database_name?schema=public`

**Database connection issues:**

- Ensure PostgreSQL is running and accessible
- For Docker: Make sure the database container is healthy before the app starts (this is handled automatically by `depends_on` in docker-compose.yml)
- For local setup: Start your PostgreSQL service

**Prisma migration errors:**

- Reset the database: `npx prisma migrate reset` (this will delete all data)
- Generate Prisma client: `npx prisma generate`
- Apply migrations: `npx prisma migrate deploy`

**"Schema not found" errors:**

- The database URL should include `?schema=public` at the end
- Make sure the database exists and is accessible

## Tinybird Instructions

To prepare the Tinybird database, follow these steps:

0. We use `pipenv` to manage our Python dependencies. If you don't have it installed, you can install it using the following command:
   ```sh
   pkgx pipenv
   ```
1. Download the Tinybird CLI from [here](https://www.tinybird.co/docs/cli.html) and install it on your system.
2. After authenticating with the Tinybird CLI, navigate to the `lib/tinybird` directory:
   ```sh
   cd lib/tinybird
   ```
3. Push the necessary data sources using the following command:
   ```sh
   tb push datasources/*
   tb push endpoints/get_*
   ```
4. Don't forget to set the `TINYBIRD_TOKEN` with the appropriate rights in your `.env` file.

#### Updating Tinybird

```sh
pipenv shell
## start: pkgx-specific
cd ..
cd papermark
## end: pkgx-specific
pipenv update tinybird-cli
```

## Contributing

Papermark is an open-source project, and we welcome contributions from the community.

If you'd like to contribute, please fork the repository and make any changes you'd like. Pull requests are warmly welcome.

### Our Contributors ✨

<a href="https://github.com/mfts/papermark/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=mfts/papermark" />
</a>
