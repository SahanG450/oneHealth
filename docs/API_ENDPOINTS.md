# OneHealth Frontend ↔ Spring Boot API Contract

Base URL: `http://localhost:8080/api/v1` (env: `VITE_API_BASE_URL` / `EXPO_PUBLIC_API_BASE_URL`)

Auth header on every authenticated call:

```http
Authorization: Bearer <supabase-jwt>
```

Error envelope (all clients share):

```json
{ "code": "STRING", "message": "Human readable", "details": {} }
```

Idempotent writes (bookings/payments) accept:

```http
Idempotency-Key: <uuid>
```

Realtime (clients subscribe directly to Supabase — not the Spring API):

- Channel / table: `queue_entries` filtered by `dispensary_id`
- Logical channel name: `queue:{dispensaryId}:{sessionId}`

---

## Auth & profile

| Method | Path | Actor | Purpose |
|--------|------|-------|---------|
| POST | `/api/v1/auth/register` | PUBLIC | Register PATIENT or DOCTOR (after Supabase Auth signup) |
| GET | `/api/v1/me` | AUTH | Current profile + role |
| PATCH | `/api/v1/me` | AUTH | Update name/phone/avatar |

## Doctors & search

| Method | Path | Actor | Purpose |
|--------|------|-------|---------|
| GET | `/api/v1/doctors/search` | PUBLIC/PATIENT | `q`, `city`, `town`, `specialization`, `page`, `size` |
| GET | `/api/v1/doctors/{id}` | PUBLIC/PATIENT | Profile, dispensaries, reviews |
| POST | `/api/v1/doctors/me/credentials` | DOCTOR | Submit SLMC + certificate/licence storage paths |

## Dispensaries

| Method | Path | Actor | Purpose |
|--------|------|-------|---------|
| GET | `/api/v1/dispensaries` | DOCTOR/ADMIN | List (`?doctorId=`) |
| GET | `/api/v1/dispensaries/{id}` | AUTH | Detail |
| POST | `/api/v1/dispensaries` | DOCTOR | Create |
| PUT | `/api/v1/dispensaries/{id}` | DOCTOR | Update |

## Queue

| Method | Path | Actor | Purpose |
|--------|------|-------|---------|
| GET | `/api/v1/dispensaries/{id}/queue` | PATIENT/DOCTOR/STAFF | `?date=YYYY-MM-DD` live session |
| PATCH | `/api/v1/dispensaries/{id}/queue/current` | DOCTOR/STAFF | Body `{ currentNumber, queueDate }` — updates Postgres → Realtime fan-out |

## Bookings

| Method | Path | Actor | Purpose |
|--------|------|-------|---------|
| POST | `/api/v1/bookings` | PATIENT | Book next token (`Idempotency-Key`) |
| GET | `/api/v1/bookings/me` | PATIENT | My bookings |
| POST | `/api/v1/bookings/{id}/cancel` | PATIENT | Cancel before called |

## Payments

| Method | Path | Actor | Purpose |
|--------|------|-------|---------|
| POST | `/api/v1/payments/charge` | PATIENT/STAFF | Start PayHere/Stripe checkout (`Idempotency-Key` **required**) |
| GET | `/api/v1/payments/{id}` | AUTH | Payment status |

## Prescriptions & EMR

| Method | Path | Actor | Purpose |
|--------|------|-------|---------|
| POST | `/api/v1/prescriptions` | DOCTOR | Issue e-Rx |
| GET | `/api/v1/prescriptions/me` | PATIENT/STAFF | List |
| PATCH | `/api/v1/prescriptions/{id}/dispense` | STAFF (pharmacist) | Mark dispensed |
| GET | `/api/v1/emr/me` | PATIENT | Medical records (Premium) |
| POST | `/api/v1/emr` | DOCTOR | Create record (Premium) |
| POST | `/api/v1/emr/{id}/attachments/signed-url` | PATIENT/DOCTOR | Upload URL for reports |

## Reviews & AI

| Method | Path | Actor | Purpose |
|--------|------|-------|---------|
| POST | `/api/v1/reviews` | PATIENT | Rating + comment (+ optional symptoms) |
| POST | `/api/v1/reviews/{id}/reply` | DOCTOR | Public reply |
| POST | `/api/v1/recommendations` | PATIENT | Symptom → ranked doctors (disclaimer required) |

## Doctor management

| Method | Path | Actor | Purpose |
|--------|------|-------|---------|
| GET | `/api/v1/doctors/me/staff` | DOCTOR | List staff |
| POST | `/api/v1/doctors/me/staff` | DOCTOR | Invite staff (Standard+) |
| PATCH | `/api/v1/doctors/me/staff/{id}` | DOCTOR | Update permissions/active |
| GET | `/api/v1/doctors/me/subscription` | DOCTOR | Current tier + packages |
| PUT | `/api/v1/doctors/me/subscription` | DOCTOR | Change tier |
| GET | `/api/v1/doctors/me/analytics` | DOCTOR | Bookings/revenue/ratings |

## Admin portal (separate app)

| Method | Path | Actor | Purpose |
|--------|------|-------|---------|
| GET | `/api/v1/admin/verifications` | ADMIN | Credential queue (`?status=PENDING`) |
| POST | `/api/v1/admin/doctors/{id}/approve` | ADMIN | Approve doctor |
| POST | `/api/v1/admin/doctors/{id}/reject` | ADMIN | Reject with reason |
| GET | `/api/v1/admin/users` | ADMIN | User directory |
| POST | `/api/v1/admin/users/{id}/suspend` | ADMIN | Suspend account |
| GET | `/api/v1/admin/dispensaries` | ADMIN | All dispensaries |
| GET | `/api/v1/admin/subscriptions` | ADMIN | Packages + billing |
| PUT | `/api/v1/admin/subscriptions/packages/{tier}` | ADMIN | Update pricing |
| GET | `/api/v1/admin/analytics` | ADMIN | Platform KPIs |
| GET | `/api/v1/admin/payments` | ADMIN | Payment oversight |
| GET | `/api/v1/admin/reviews` | ADMIN | Reviews for moderation |
| PATCH | `/api/v1/admin/reviews/{id}/moderation` | ADMIN | VISIBLE/HIDDEN/REMOVED |
| GET | `/api/v1/admin/audit-log` | ADMIN | Approval/suspension audit |

## Storage

| Method | Path | Actor | Purpose |
|--------|------|-------|---------|
| GET | `/api/v1/storage/signed-url` | AUTH | Short-lived download URL (`?path=`) |

---

## Frontend wiring map

| App | Port (dev) | Uses |
|-----|------------|------|
| `apps/web` | 5173 | Patient + Doctor + Staff portals, shared login |
| `apps/admin` | 5174 | Admin-only portal, same login UI kit |
| `apps/mobile` | Expo | Patient (+ doctor queue), same API client |

Typed client: `packages/api-client` (`createApiClient`, `API_ENDPOINTS`).

When Spring Boot OpenAPI is published, regenerate with:

```bash
npm run generate:api
```
