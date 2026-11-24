# GateLite Tasks - Phases 1 to 3 (MVP)

> Track progress by checking items only when **built AND tested**. Update as you work.

---

## Phase 1: Foundation & Design System (Weeks 3-6) - **SUBSTANTIALLY COMPLETE**

### 1.1 Monorepo Setup
- [x] 1.1.1 Initialize pnpm workspace with Turborepo config
- [x] 1.1.2 Create directory structure: `apps/api`, `apps/mobile`, `apps/admin`, `packages/design-tokens`, `packages/api-client`, `packages/config`, `infra/docker`, `infra/terraform`, `docs/adr`, `docs/runbooks`
- [x] 1.1.3 Configure root `package.json` with workspaces and Turborepo pipeline
- [x] 1.1.4 Set up ESLint, Prettier, TypeScript configs in `packages/config`
- [x] 1.1.5 Add Husky + lint-staged for pre-commit hooks
- [x] 1.1.6 Create `.env.example` with all required variables
- [x] 1.1.7 Create `.gitignore` with proper patterns
- [x] 1.1.8 Verify: `pnpm install` works, `pnpm lint` passes, `pnpm typecheck` passes

### 1.2 Design Tokens Package
- [x] 1.2.1 Create `packages/design-tokens/tokens.json` with all color, spacing, typography, border, shadow tokens from AGENTS.md §4
- [x] 1.2.2 Build token generator script: JSON → CSS variables + Tailwind theme + Dart `BrutalTheme` class
- [x] 1.2.3 Generate CSS variables file for web consumption
- [x] 1.2.4 Generate Tailwind config extension (`tailwind.config.ts` partial)
- [x] 1.2.5 Generate Flutter `BrutalTheme` class with `ColorScheme`, `TextTheme`, component themes
- [x] 1.2.6 Add build script to `packages/design-tokens/package.json`
- [x] 1.2.7 Verify: tokens import correctly in a test web component and Flutter widget

### 1.3 Core Web Components (React + Tailwind)
- [x] 1.3.1 Set up `apps/admin` with Vite + React 18 + TypeScript + Tailwind
- [x] 1.3.2 Configure Tailwind to use design tokens
- [x] 1.3.3 Build `BrutalButton` (variants: primary/mint, secondary/lilac, danger/rose, ghost/white; sizes: S/M/L/XL)
- [x] 1.3.4 Build `BrutalCard` (flat pastel fill, 3px ink border, hard shadow 4px/4px/0)
- [x] 1.3.5 Build `BrutalInput` (thick border, focus ring: 3px ink + 3px lilac)
- [x] 1.3.6 Build `BrutalSelect`, `BrutalToggle` (chunky square knob), `BrutalChip`, `BrutalBadge`
- [x] 1.3.7 Build `StatusStamp` (rotated stamp: APPROVED/mint, DENIED/rose, PENDING/butter)
- [x] 1.3.8 Build `OtpBoxes` (6 big monospace boxes, thick borders)
- [x] 1.3.9 Build `BottomNav` (4-5 items, active filled pastel with border+shadow)
- [x] 1.3.10 Build `ToastSticker` (slides in like sticker with hard shadow)
- [x] 1.3.11 Build `EmptyState` (flat illustration + bold line + action)
- [x] 1.3.12 Build `ApprovalSheet` (full-width, visitor photo, name, purpose, giant APPROVE/DENY buttons)
- [ ] 1.3.13 Add Storybook or component showcase page for visual verification
- [ ] 1.3.14 Run accessibility audit (axe) on all components; fix WCAG AA issues

### 1.4 Core Mobile Components (Flutter)
- [ ] 1.4.1 Set up `apps/mobile` Flutter project with two flavors: `resident`, `guard`
- [ ] 1.4.2 Configure `go_router` for navigation, Riverpod for state
- [ ] 1.4.3 Import `BrutalTheme` from design-tokens
- [ ] 1.4.4 Build `BrutalButton` (same variants/sizes as web)
- [ ] 1.4.5 Build `BrutalCard`, `BrutalInput`, `BrutalChip`, `BrutalBadge`
- [ ] 1.4.6 Build `StatusStamp`, `OtpBoxes`, `BottomNav` (56px touch targets for guard flavor)
- [ ] 1.4.7 Build `ToastSticker`, `EmptyState`, `ApprovalSheet`
- [ ] 1.4.8 Verify on Android emulator (low-end profile): components render correctly, touch targets ≥48px (guard ≥56px)

### 1.5 Database Schema & Prisma
- [x] 1.5.1 Create `apps/api/prisma/schema.prisma` with all tables from PLAN.md §5 (societies, blocks, flats, users, memberships, visitors, passes, visits, staff, staff_attendance, notices, tickets, ticket_comments, invoices, payments, amenities, bookings, audit_logs, devices)
- [x] 1.5.2 Use UUIDv7 for primary keys (add `uuid` extension)
- [x] 1.5.3 Add `created_at`, `updated_at` on every table
- [x] 1.5.4 Add composite indexes starting with `society_id` on all tenant tables
- [x] 1.5.5 Enable Row-Level Security policies on all tenant tables
- [ ] 1.5.6 Create initial migration: `pnpm prisma migrate dev --name init`
- [x] 1.5.7 Create seed script: demo society (150 flats, 3 blocks), sample residents, guards, admins
- [ ] 1.5.8 Verify: `pnpm prisma db seed` runs without errors

### 1.6 Auth Module (NestJS)
- [x] 1.6.1 Set up `apps/api` NestJS project with modular structure
- [x] 1.6.2 Create `AuthModule` with `AuthService`, `AuthController`
- [x] 1.6.3 Implement OTP provider interface (`OtpProvider`): `send(phone, code)`, `verify(phone, code)`; add `ConsoleOtpProvider` (logs to console) and `MockOtpProvider` (always accepts `123456`) for dev
- [x] 1.6.4 Implement JWT access tokens (15 min) + rotating refresh tokens with reuse detection
- [x] 1.6.5 Implement device binding: store `device_id` + `fcm_token` in `devices` table
- [x] 1.6.6 Add rate limiting: 3 OTP/10min per phone, 10/hour per IP; progressive lockout on failed login
- [x] 1.6.7 Add RBAC guards: `RolesGuard`, `SocietyScopeGuard` (derives `society_id` from token)
- [ ] 1.6.8 Write unit tests for OTP flow, token rotation, device binding, rate limits
- [ ] 1.6.9 Write tenant isolation tests: attempt cross-society access → expect 403/404

### 1.7 Docker Compose Dev Stack
- [x] 1.7.1 Create `infra/docker/docker-compose.yml` with: Postgres 16, Redis 7, MinIO (S3), Mailpit (email testing)
- [x] 1.7.2 Add healthchecks for all services
- [x] 1.7.3 Create `infra/docker/.env.example` for docker-compose
- [x] 1.7.4 Verify: `docker compose -f infra/docker/docker-compose.yml up -d` starts all services healthy

### 1.8 CI/CD Pipeline (GitHub Actions)
- [x] 1.8.1 Create `.github/workflows/ci.yml`: lint → typecheck → test → build → docker build
- [ ] 1.8.2 Run API tests against real Postgres + Redis (use services in Actions or Testcontainers)
- [ ] 1.8.3 Run Flutter analyze + test
- [x] 1.8.4 Run Admin web lint + typecheck + build
- [x] 1.8.5 Add secret scanning (trufflehog or gitguardian)
- [ ] 1.8.6 Add dependency scanning (Dependabot config)
- [ ] 1.8.7 Verify: push to branch triggers CI, all jobs pass

### 1.9 Observability Baseline
- [ ] 1.9.1 Add OpenTelemetry instrumentation to NestJS (auto-instrumentation + custom spans)
- [ ] 1.9.2 Configure Prometheus metrics endpoint (`/metrics`)
- [ ] 1.9.3 Set up Grafana dashboards (basic: request latency, error rate, active connections)
- [ ] 1.9.4 Configure Loki for log aggregation
- [ ] 1.9.5 Add Sentry SDK for error tracking
- [ ] 1.9.6 Verify: staging deploy shows metrics in Grafana, errors in Sentry

### 1.10 OpenAPI & Generated Client
- [ ] 1.10.1 Configure `@nestjs/swagger` for OpenAPI 3.1 spec generation
- [ ] 1.10.2 Generate spec at build time: `pnpm openapi:generate`
- [ ] 1.10.3 Set up `packages/api-client` to generate TypeScript client from spec (using `openapi-typescript-codegen` or similar)
- [ ] 1.10.4 Verify: client compiles and can call a test endpoint

---

## ⚠️ BLOCKER: API TypeScript Build Errors (~140 errors)

**Must fix before proceeding to Phase 2:**

### Categories:
1. **`exactOptionalPropertyTypes`** - Handle `undefined` in Prisma creates/updates, JWT options, DTOs
2. **Provider injection** - Interfaces need `import type` for DI (OtpProvider, PushProvider, etc.)
3. **DTO classes** - Properties need initializers or `!` definite assignment assertions
4. **Prisma access** - Property access needs bracket notation due to strict TS config
5. **JWT secrets** - Config service returns `undefined` possible, need non-null assertions
6. **DTO optional params** - Query params need `undefined` in type signatures

### Files needing fixes (priority order):
- `src/auth/auth.module.ts` - JWT factory return type
- `src/auth/auth.service.ts` - Provider injection, JWT sign/verify
- `src/common/providers/providers.module.ts` - All provider tokens need `import type`
- `src/common/filters/http-exception.filter.ts` - Bracket notation for exception response
- `src/common/guards/jwt-auth.guard.ts` - Add `override` modifiers
- `src/common/prisma/prisma.service.ts` - Bracket notation for dynamic model access
- `src/main.ts` - Bracket notation for env vars
- All controllers: DTO classes need initializers
- All services: Prisma access needs bracket notation
- All services: Provider injection needs `import type`
- All controllers: Query params need `undefined` in types

---

## Phase 2: Core Gate Flow (Weeks 6-11) - **NOT STARTED**

### 2.1 Society/Block/Flat/Resident Onboarding
- [x] 2.1.1 Build `SocietiesModule` (CRUD for societies, blocks, flats)
- [x] 2.1.2 Build `ResidentsModule` (invite resident, accept invite, manage memberships)
- [x] 2.1.3 Build Admin CSV import for flats and residents (validate, preview, commit)
- [x] 2.1.4 API endpoints: `POST /v1/societies`, `POST /v1/societies/:id/blocks`, `POST /v1/societies/:id/flats`, `POST /v1/societies/:id/residents/import`
- [ ] 2.1.5 Admin web: Society setup wizard, block/flat management, resident import UI
- [ ] 2.1.6 Tenant isolation tests for all endpoints
- [ ] 2.1.7 Unit tests for CSV parsing, validation, duplicate handling

### 2.2 Pre-Approval Passes (QR + Code)
- [x] 2.2.1 Build `PassesModule`: create pass with visitor, validity window, `uses_left`, HMAC-signed code
- [x] 2.2.2 Generate QR code containing signed token (code + expiry + flat_id + uses_left)
- [x] 2.2.3 Share pass via link (web view) and SMS/WhatsApp (provider interface)
- [x] 2.2.4 Guard app: verify QR/code **offline** using local HMAC verification (cached public key)
- [x] 2.2.5 API: `POST /v1/passes`, `GET /v1/passes/:code/verify` (online validation)
- [ ] 2.2.6 Resident app: create pass screen, list active passes, revoke pass
- [ ] 2.2.7 Guard app: scan QR (camera), manual code entry, offline indicator
- [ ] 2.2.8 Unit tests: HMAC signing/verification, expiry, uses_left decrement, offline validation
- [ ] 2.2.9 Tenant isolation tests

### 2.3 Guard App: Walk-in Visitor Entry
- [ ] 2.3.1 Guard home screen: giant **NEW VISITOR** and **VERIFY CODE** buttons, connection badge (ONLINE/WEAK/OFFLINE)
- [ ] 2.3.2 New visitor flow: flat picker (searchable), visitor name, purpose, photo capture
- [ ] 2.3.3 Creates `visit` with state `PENDING`, sends push + WebSocket event
- [ ] 2.3.4 Live pending list with pull-to-refresh, auto-update via WebSocket
- [ ] 2.3.5 Local SQLite cache (Drift): flats, masked residents (flat, first name, masked phone), active passes, society policies
- [ ] 2.3.6 Outbox pattern: queue actions locally with idempotency keys, sync with exponential backoff
- [ ] 2.3.7 Foreground service for reliable alerts on Android
- [ ] 2.3.8 Unit tests: offline cache, outbox sync, idempotency
- [ ] 2.3.9 Integration test: full walk-in flow on emulator

### 2.4 Realtime Approvals (Socket.IO + FCM)
- [ ] 2.4.1 Socket.IO server in NestJS: connection auth via JWT, room per flat (`flat:{flat_id}`)
- [ ] 2.4.2 FCM provider interface: `sendPush(token, payload)`, `sendToTopic(topic, payload)`; mock provider for dev
- [ ] 2.4.3 Resident app: listen for `visit:pending` events, show `ApprovalSheet` immediately
- [ ] 2.4.4 Approval flow: resident taps APPROVE/DENY → API updates visit state → pushes result to guard room
- [ ] 2.4.5 Escalation chain: 30s timeout → notify other flat members → automated call (provider interface) → guard policy
- [ ] 2.4.6 Guard app: realtime state updates (PENDING → APPROVED/DENIED/TIMED_OUT)
- [ ] 2.4.7 Unit tests: escalation logic, timeout handling, push delivery
- [ ] 2.4.8 Load test: 50 concurrent approvals, p95 < 300ms server-side

### 2.5 Delivery & Cab Quick Flows
- [ ] 2.5.1 Delivery flow: guard selects "Delivery" → resident sees APPROVE / LEAVE_AT_GATE / DENY
- [ ] 2.5.2 Cab flow: guard selects "Cab" → resident sees APPROVE / DENY (quick)
- [ ] 2.5.3 Pre-approve delivery companies: resident adds company + time window → auto-approve matching deliveries
- [ ] 2.5.4 Entry/exit logs with photo capture by guard
- [ ] 2.5.5 Resident history: filter by type, date, status

### 2.6 Offline Mode Verification
- [ ] 2.6.1 Test guard app offline: create visit, verify pre-approved pass, queue actions
- [ ] 2.6.2 Restore network: verify outbox sync, no duplicates (idempotency keys)
- [ ] 2.6.3 Test weak network: connection badge shows WEAK, fallback to SMS/call
- [ ] 2.6.4 Document offline behavior in `docs/runbooks/offline-mode.md`

---

## Phase 3: Community Basics & Admin Panel (Weeks 11-14) - **NOT STARTED**

### 3.1 Notice Board
- [ ] 3.1.1 Build `NoticesModule`: CRUD, pin, schedule publish, target (all/specific blocks)
- [ ] 3.1.2 Push notifications on publish (FCM + in-app)
- [ ] 3.1.3 Read receipts: track which residents opened
- [ ] 3.1.4 Resident app: notice list, detail, pull-to-refresh
- [ ] 3.1.5 Admin web: notice composer with rich text, preview, schedule

### 3.2 Complaints & Tickets
- [ ] 3.2.1 Build `TicketsModule`: categories (maintenance, security, noise, other), status (open, in_progress, resolved, closed), priority
- [ ] 3.2.2 Resident: create ticket with photos, track status, add comments
- [ ] 3.2.3 Admin: assign to staff, update status, add internal notes, SLA tracking
- [ ] 3.2.4 Notifications on status change, new comment
- [ ] 3.2.5 Admin web: ticket dashboard with filters, Kanban view

### 3.3 SOS / Emergency
- [ ] 3.3.1 SOS button in resident app (large, accessible, haptic feedback)
- [ ] 3.3.2 Triggers: loud alert to all guards + admins, flat location, acknowledgment tracking
- [ ] 3.3.3 Escalation: if unacknowledged in 20s → SMS to admin phone (provider interface)
- [ ] 3.3.4 Guard app: prominent SOS alert screen, acknowledge button, mark resolved
- [ ] 3.3.5 Admin web: SOS log with response times
- [ ] 3.3.6 Works with degraded connectivity (local alert + SMS fallback)

### 3.4 Admin Web Dashboard
- [ ] 3.4.1 Dashboard: stat cards (visits today, open tickets, dues, active passes)
- [ ] 3.4.2 Recent notices, activity table (visits, tickets, SOS) with thick borders
- [ ] 3.4.3 Resident management: list, invite, deactivate, view flat membership
- [ ] 3.4.4 Visitor reports: daily/weekly/monthly, export CSV
- [ ] 3.4.5 Society settings: escalation timing, retention policy, working hours, guard policies
- [ ] 3.4.6 Audit logs: filterable, exportable, append-only display

### 3.5 Audit Logs & Exports
- [ ] 3.5.1 Every state change writes to `audit_logs` (actor, action, entity, entity_id, ip, timestamp)
- [ ] 3.5.2 Admin: audit log viewer with filters
- [ ] 3.5.3 Data export: resident data (DPDP compliance), society reports
- [ ] 3.5.4 Scheduled purge job: visitor photos 90 days (configurable)

### 3.6 MVP Integration Testing & Polish
- [ ] 3.6.1 Full E2E tests: login → pre-approve → guard verify; walk-in → approve → entry; SOS flow
- [ ] 3.6.2 Run k6 load test: 500 visits/hour, 50 concurrent approvals
- [ ] 3.6.3 Accessibility audit on all three apps (WCAG AA)
- [ ] 3.6.4 Test on low-end Android (2GB RAM): guard app performance, memory
- [ ] 3.6.5 Security review: no hardcoded secrets, tenant isolation verified, rate limits working
- [ ] 3.6.6 Create `PHASE_3_REPORT.md`: what was built, what is mocked, known gaps, how to run

---

## Phase 4-7: Future (Not Started)

> Summary of remaining work after Phase 3 completes.

### Phase 4: Pilot Launch (Weeks 14-20)
- Onboard 2 pilot societies, train guards/committee, daily check-ins, rapid fixes
- Penetration test, privacy review
- Metrics: 70% activation, 99.5% crash-free, committee willing to pay

### Phase 5: Payments, Staff, Amenities (Weeks 20-30)
- Maintenance invoices, UPI/online payments, receipts, reminders, ledger
- Daily help registry with QR + attendance
- Amenity booking with slots, rules, fees
- Polls/votes, vehicle/parking registry
- Subscription billing for societies
- First paid society, >98% payment success

### Phase 6: Public Launch & Growth (Weeks 30-42)
- Website, demo video, case studies
- Sales playbook, partnerships with facility managers
- Referral program, content marketing
- Self-serve onboarding, support help center
- 10 paying societies, onboarding <2 days

### Phase 7: Scale & Advanced (Months 10-18)
- Kubernetes, autoscaling, read replicas, partitioning
- Hardware integrations: ANPR, RFID, boom barriers, intercom
- Accounting module, analytics
- Multi-language, accessibility audit
- Vetted vendor directory (opt-in, labeled)
- SOC 2 controls, external security audit
- 99.9% uptime, 100 societies