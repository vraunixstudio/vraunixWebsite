# Vraunix Studio Platform

Vraunix Studio is a full-stack website studio management platform: a public marketing site, staff authentication, lead/enquiry management, proposals, projects, invoicing, payments, maintenance, support tickets, documents, settings, and audit logging.

## Stack

- Frontend: Next.js 16, React 19, TypeScript, centralized theme tokens
- Backend: Express 5, Mongoose 9, Zod, PDFKit, Nodemailer, Pino
- Database: MongoDB
- Shared package: `@vraunix/shared` for constants, schemas, and types

## Requirements

- Node.js 24 or newer
- npm 11 or newer
- MongoDB running locally or remotely
- Windows/macOS/Linux supported

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment template and edit it:

   ```bash
   cp .env.example .env
   ```

   Required values include `MONGODB_URI`, `SESSION_SECRET`, `CSRF_SECRET`, `WEB_ORIGIN`, and optional initial admin credentials.

3. Seed base content and the initial administrator:

   ```bash
   npm run seed
   npm run seed:admin
   ```

4. Start the API and web app:

   ```bash
   npm run dev
   ```

   The API runs on `http://127.0.0.1:4000` and the web app runs on `http://localhost:3000`.

## Verification

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

## Security Notes

- Authentication uses opaque server-side sessions and CSRF protection.
- There is no public registration. Staff accounts are created by invitation only.
- Admin-only actions include team management, settings, templates, audit logs, invoice voiding, and payment verification/reversal.
- Money is stored and calculated in integer minor units.
- Uploaded/generated PDFs are served through authenticated routes.
- Rate limiting is applied to login, discovery, and contact submissions.
- Production requires distinct session and CSRF secrets, secure cookies, and a trusted proxy configuration when deployed behind a proxy.

## Operational Notes

- Maintenance billing is idempotent and advances `nextBillingDate` only after an invoice is recorded.
- Proposal versions are immutable once accepted.
- Document downloads reuse a stored PDF only when the document is not older than the source entity.
- The public site intentionally avoids fabricated portfolio, testimonials, statistics, or contact details. Placeholder values such as `hello@vraunix.example` must be replaced through settings before launch.

## Deployment

- Build the API and web app with `npm run build`.
- Run the API with `npm run start -w @vraunix/api`.
- Run the web app with `npm run start -w @vraunix/web`.
- Ensure MongoDB, storage, and mail configuration are available in production.
- Run `npm run seed` and `npm run seed:admin` once per new environment.

## Tests

API tests use Vitest and Supertest. The test environment connects to MongoDB using `NODE_ENV=test` and `MONGODB_DATABASE=vraunix_studio_test`.
