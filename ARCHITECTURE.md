# PRANOVA Technical Skills & Architecture Guide

## Backend Stack (Express + TypeScript)
- **Language:** Node.js with TypeScript (Strict mode).
- **Framework:** Express.js. 
- **Architecture:** 3-Tier Architecture (Routes -> Controllers -> Services).
- **Database:** PostgreSQL (Relational integrity is mandatory for healthcare data).
- **ORM:** Prisma.
- **Auth:** JWT (Access + Refresh tokens). MFA for Admin, Phone+OTP for Patients.
- **Validation:** Zod (for all incoming request payloads).
- **Real-Time:** Socket.io (for Emergency P1 alerts to the Admin Web panel).
- **File Handling:** S3-compatible storage for medical documents.

## Database Rules (Prisma + PostgreSQL)
- NEVER use MongoDB. Healthcare requires strict relational data (Patients -> Cases -> Providers -> Consents).
- Every table must have `createdAt` and `updatedAt` timestamps.
- Medical Cases must have a `CaseTimeline` table that logs EVERY status change and action.
- Consents must have an `expiresAt` timestamp and a `revokedAt` field.
- Audit logs must be immutable (soft delete only, never hard delete).

## Admin Panel Rules (React-Admin)
- **Framework:** React-Admin (Vite + TypeScript).
- **Purpose:** Data-heavy CRUD operations, Triage, and Assignment.
- **Key Logic:** The Admin dashboard does not create Cases from scratch; it receives them from the API and performs the "Assign Care Manager" action.
- **Exporting:** Must use `xlsx` library to export audit logs and must require a "Reason for Export" input before downloading.

## Mobile App Rules (Flutter)
- **Framework:** Flutter (Dart).
- **Architecture:** Feature-first folder structure. Use Riverpod or Bloc for state management.
- **Build Flavors:** One codebase. Two flavors: `patient` and `care_manager`. 
- **API Layer:** Use Dio for HTTP requests. Create a centralized `ApiClient` class.
- **Patient App Features:** SOS button (foreground location only), document upload, payment via UPI, case timeline.
- **Care Manager App Features:** Receive push notifications (FCM), background location tracking for navigation, status update buttons.
- **NO WEBVIEWS:** All UI must be built with Flutter widgets.

## Module Execution Order (Phase 1 Pilot)
When commanded to start, execute in this exact order:
1. **Foundation:** Database Schema (Prisma), Auth (OTP/JWT), RBAC.
2. **Admin Core:** User Management, Provider Directory (Module 5), Case Management Dashboard (Module 4).
3. **Patient App Core:** Registration, SOS Trigger (Module 3), Case Timeline, Document Upload (Module 6).
4. **Care Manager App Core:** Receive Assignment, Update Status, Navigation.
5. **Integrations:** Payments (Module 8), SMS/WhatsApp (Module 7).
6. **Admin Reporting:** Audit Logs, Excel Export (Module 9).