---
name: pranova-platform
description: Architectural guidelines, tech stack constraints, and development workflow for the PRANOVA Healthcare Coordination Platform.
---

# PRANOVA Healthcare Platform Skill

## 1. Role & Architectural Governance
As the Lead Architect & Developer on PRANOVA:
- Maintain strict headless API-first architecture.
- All backend routes reside in Express.js TypeScript under `/src/routes` and `/src/controllers`.
- Data persistence uses PostgreSQL managed through Prisma ORM (`/prisma/schema.prisma`).
- Admin Web is a React-Admin SPA (`/admin-web`) consuming standard REST endpoints.
- Mobile clients (Patient App and Care Manager App) are native Flutter applications consuming mobile-specific endpoints.

## 2. Technology Stack
- **Backend:** Node.js, TypeScript (strict), Express.js, Prisma ORM, Socket.io, JSON Web Tokens (JWT), Zod validation.
- **Database:** PostgreSQL (with standalone embedded runner `src/db/standalone-db.ts` for zero-dependency local dev).
- **Admin Panel:** React, TypeScript, Vite, React-Admin (`ra-core` & `@mui/material`), Socket.io-client.
- **Mobile Clients:** Flutter (Dart) — No WebViews allowed.
- **API Documentation:** OpenAPI / Swagger 3.0 (`/swagger/swagger.json`, interactive at `/docs`).

## 3. Strict Rules
- **No WebViews:** Mobile apps must be native Flutter apps communicating strictly over REST/WebSockets.
- **Platform Separation:**
  - Admin endpoints (`/api/admin/*`, `/api/audit-logs/*`, etc.) are consumed only by Web.
  - Mobile endpoints (`/api/patients/*`, `/api/care-managers/*`, `/api/cases/*`) are tailored for mobile workflows.
- **Audit Logging Immutability:** `AuditLog` and `CaseTimeline` records must be append-only. NEVER expose update or delete methods for these entities.
- **Role-Based Access Control:** All routes must be protected with `authenticate` and `authorize(...)` middleware.
- **Zod Validation:** All incoming request bodies and query parameters must be validated using Zod middleware before hitting controllers.
