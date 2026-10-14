# PRANOVA Healthcare API Documentation (Swagger / OpenAPI 3.0)

> **Note:** This folder is configured in `.gitignore` and is kept separate so that internal API schemas, dev explorers, and proprietary testing configurations are **not committed to the public open-source project repository**.

## Contents
- `swagger.json`: Static, full OpenAPI 3.0 specification exported from the Express route definitions.
- `index.html`: Standalone browser viewer powered by Swagger UI CDN. Double-click or open with Live Server to inspect endpoints offline without running the backend server.

## Regenerating API Specifications
To rebuild the OpenAPI spec after adding or modifying backend route JSDoc annotations, run:
```bash
npm run generate:swagger
```
This scans all routes in `src/routes/*.ts` and regenerates `swagger/swagger.json`.
