# OneHealth

Monorepo for the OneHealth platform: connecting patients with private-practice
doctors (consultants) and dispensaries in Sri Lanka, with live queue management
at its core.

## Apps
- `apps/backend`  — Java 21 / Spring Boot 3 API (Maven multi-module)
- `apps/web`      — React + Vite web app (Patient / Doctor / Staff)
- `apps/mobile`   — React Native (Expo) app (Patient)
- `apps/admin`    — React + Vite admin portal (System Admin)

## Shared packages
- `packages/api-client` — TS client generated from the backend's OpenAPI spec
- `packages/types`      — shared TS types/enums mirroring backend DTOs
- `packages/ui-kit`     — shared React components (web + admin)
- `packages/i18n`       — Sinhala / Tamil / English translation bundles
- `packages/config`     — shared ESLint / TypeScript / Tailwind config

## Getting started
See `docs/OneHealth_Developer_Reference_Booklet.pdf` for full architecture,
technology rationale, and onboarding steps. Quick start:

```bash
npm install                 # installs all workspaces
supabase start               # local Supabase stack (Postgres/Auth/Storage/Realtime)
cp apps/web/.env.example apps/web/.env
cp apps/mobile/.env.example apps/mobile/.env
cp apps/admin/.env.example apps/admin/.env
cd apps/backend && mvn spring-boot:run -pl onehealth-api
```

In separate terminals:
```bash
npm run dev -w apps/web
npm run dev -w apps/admin
npm run start -w apps/mobile
```
