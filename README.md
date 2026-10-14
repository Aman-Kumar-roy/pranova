# PRANOVA Healthcare Platform

PRANOVA is an enterprise-grade Healthcare Coordination Platform built with a strictly headless, API-first architecture. It coordinates interactions between Patients, Care Managers, Healthcare Providers, and Central Administrators with real-time audit logging, emergency response telemetry, and socket-driven clinical dispatching.

---

## Architecture Overview

```
                      +-----------------------------+
                      |      PRANOVA Ecosystem      |
                      +-----------------------------+
                                     |
         +---------------------------+---------------------------+
         |                           |                           |
         v                           v                           v
+------------------+       +-------------------+       +-------------------+
| Admin Web Portal |       | Patient Mobile App|       |Care Mgr Mobile App|
| (React-Admin SPA)|       |   (Flutter/Dart)  |       |   (Flutter/Dart)  |
+------------------+       +-------------------+       +-------------------+
         |                           |                           |
         +---------------------------+---------------------------+
                                     |  REST API + WebSockets
                                     v
                      +-----------------------------+
                      |   PRANOVA Express API Engine|
                      |   (Node.js / TypeScript)    |
                      +-----------------------------+
                                     |
                                     v
                      +-----------------------------+
                      |     PostgreSQL / Prisma     |
                      |     (Local Embedded Engine) |
                      +-----------------------------+
```

### Core Architecture Rules
1. **Headless & API-First:** All clients consume the central Express backend over REST and WebSockets.
2. **Strict Platform Separation:** Admin endpoints are segregated for the web portal. Mobile endpoints serve mobile clients.
3. **No WebViews in Mobile:** Mobile clients are native Flutter apps consuming JSON APIs.
4. **Append-Only Auditing:** `AuditLog` and `CaseTimeline` records are immutable. No update/delete routes exist.
5. **Zero-Dependency Local Dev:** Includes an embedded PostgreSQL runtime so developers can start building without installing or configuring external database software or Docker.

---

## Project Structure

```
d:/PRANOVA
├── .agents/                      # AI Agent Skills & Instructions
│   └── skills/pranova-platform/  # Antigravity / AI Agent cheatsheet & rules
├── admin-web/                    # React-Admin Web Application (Vite + MUI)
│   ├── src/
│   │   ├── components/           # Custom AppBar, Error, Menu, Dashboard, etc.
│   │   ├── providers/            # Data & Auth Providers for React-Admin
│   │   ├── resources/            # Patients, Care Managers, Cases, Providers, Audit Logs
│   │   └── theme.ts              # Medical-grade Teal & Slate Design System
├── prisma/
│   ├── schema.prisma             # PostgreSQL schema with full relations & enums
│   └── seed.ts                   # Seed script generating default admin & sample data
├── src/
│   ├── config/                   # Bagisto-style environment variable interpolation
│   ├── controllers/              # Express route controllers with Zod validation
│   ├── db/                       # Embedded Postgres runner & standalone manager
│   ├── middlewares/              # JWT Auth, RBAC, Audit Logging, Error handling
│   ├── routes/                   # Modular API route definitions
│   ├── services/                 # Business logic, Prisma operations, CSV/JSON exports
│   ├── socket/                   # Socket.IO emergency alert broadcast handler
│   └── server.ts                 # Main application bootstrapper
├── swagger/                      # OpenAPI 3.0 specification & interactive UI
│   ├── index.html                # Standalone Swagger UI viewer
│   └── swagger.json              # Complete OpenAPI 3.0 specification
├── .env                          # Local environment settings (configured for instant run)
├── .env.example                  # Environment template
├── AGENTS.md                     # Agent system instructions & hard constraints
├── ARCHITECTURE.md               # Technical architecture & schema contracts
├── PHASE_1_VERIFICATION_GUIDE.md # Comprehensive API & UI verification guide
├── PROJECT_PROGRESS.md           # Engineering implementation log
└── UI_DESIGN_SYSTEM.md           # Admin Web design guidelines & tokens
```

---

## Quickstart Guide

### 1. Prerequisites
- **Node.js** v18+ or v20+
- **npm** v9+

### 2. Environment Configuration
The `.env` file is pre-configured for local zero-dependency development using the embedded PostgreSQL database.

Default Admin Credentials:
- **Email:** `admin@pranova.com`
- **Password:** `Admin@123456`

### 3. Backend & Database Setup
From the repository root:

```bash
# 1. Install dependencies
npm install

# 2. Start the embedded PostgreSQL database & dev server
npm run dev
```

The database automatically initializes in `.pgdata/` on port 5432, applies Prisma migrations, seeds the default admin user and demo healthcare records, and boots the Express server at `http://localhost:5000`.

### 4. Admin Web Portal Setup
From a separate terminal window:

```bash
# 1. Navigate to the admin web directory
cd admin-web

# 2. Install dependencies
npm install

# 3. Start the Vite development server
npm run dev
```

Access the Admin Web Portal at `http://localhost:5173`.

---

## Interactive API Documentation & Swagger

- **Embedded Route:** `http://localhost:5000/docs`
- **Standalone Explorer:** Open `swagger/index.html` in any modern web browser or host it statically.
- **Specification File:** `swagger/swagger.json` contains full OpenAPI 3.0 schemas, parameters, and responses for all endpoints.

---

## Socket.IO Real-Time Telemetry

The platform provides bidirectional emergency alerting:
- **Namespace / Port:** `http://localhost:5000`
- **Emergency Room:** `emergencies`
- **Events:**
  - Client sends `patient_emergency` -> Server records audit log and broadcasts `emergency_alert` to all active admin and care manager sessions with audio alert cues.

---

## AI Agent Integration

This repository contains full instruction sets for AI coding assistants:
- `AGENTS.md`: Hard rules, role specification, and workflow constraints.
- `.agents/skills/pranova-platform/SKILL.md`: Skill definition and technical stack constraints for the Antigravity agent system.
