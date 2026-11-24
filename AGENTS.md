# AGENTS.md: GateLite (Gated Community & Society Management App)

> Read this file fully before writing any code. It is the single source of truth for product rules, tech stack, architecture, design system, security, workflow, and phase order. If something here conflicts with a guess, **this file wins**. If something is missing, ask or propose a change to this file, never silently invent.

---

## 0. MISSION

Build **GateLite**: a MyGate-style app for gated communities (visitor management, deliveries, staff, notices, complaints, payments, amenities) that is **fast at the gate, secure, offline-tolerant, and 100% ad-free for residents**.

**Golden rules**

1. Gate approval round trip must feel instant: target **< 5 seconds** on 4G.
2. **No ad SDKs, no trackers, no dark patterns.** Never add analytics that sell or share data.
3. **Multi-tenant safety**: every query is scoped by `society_id`. Cross-tenant leak = critical bug.
4. **Guard app must work on poor networks** and low-end Android phones (2 GB RAM).
5. Build in **phases** (Section 14). Do not start a later phase before the earlier phase's exit criteria are met.
6. Ship small, tested, reviewable changes. No giant commits.

---

## 1. USERS AND ROLES

| Role | App | Permissions summary |
|---|---|---|
| `RESIDENT` | Resident app | Own flat: passes, approvals, history, dues, complaints, bookings |
| `FAMILY` | Resident app | Limited resident rights set by owner |
| `GUARD` | Guard app | Log visitors, verify codes/QR, call resident, SOS; masked resident data only |
| `ADMIN` | Admin web | Society-wide management, billing, notices, reports |
| `SUPER_ADMIN` | Internal web | Cross-society ops, billing, support (MFA mandatory, fully audited) |

Use **RBAC with per-society scoping**. Role checks happen in a central guard/policy layer, never scattered inline.

---

## 2. TECH STACK (DO NOT SWAP WITHOUT APPROVAL)

**Monorepo** (pnpm workspaces + Turborepo)

| Layer | Choice |
|---|---|
| Mobile (Resident + Guard) | **Flutter 3.x**, Dart, two flavors; state: Riverpod; routing: go_router; local DB: Drift (SQLite) |
| Admin web | **React 18 + Vite + TypeScript**, TanStack Query, React Hook Form + Zod, Tailwind CSS (tokens from Section 4) |
| Backend API | **NestJS (TypeScript)**, modular monolith, OpenAPI via `@nestjs/swagger` |
| ORM | **Prisma** (or Drizzle); migrations committed |
| Database | **PostgreSQL 16** |
| Cache/queue | **Redis 7** + **BullMQ** |
| Realtime | **Socket.IO** (WebSockets) + **FCM** push as wake-up |
| Storage | S3-compatible (AWS S3 / Cloudflare R2 / MinIO in dev) |
| Auth | Phone **OTP**, JWT access (15 min) + rotating refresh tokens, device binding |
| SMS/WhatsApp | MSG91 (or equivalent) behind a provider interface |
| Payments | Razorpay or Cashfree behind a provider interface |
| Observability | OpenTelemetry, Prometheus, Grafana, Loki, Sentry |
| Infra | Docker, Docker Compose (dev), Terraform, GitHub Actions; Kubernetes later (Phase 7) |
| Testing | Jest (API), Flutter `test` + `integration_test`/Patrol, Playwright (admin), k6 (load) |

**Provider interfaces**: SMS, WhatsApp, push, payments, and storage each sit behind an interface so vendors can be swapped.

---

## 3. REPOSITORY LAYOUT

```
gatelite/
├── AGENTS.md
├── apps/
│   ├── api/            # NestJS backend
│   ├── mobile/         # Flutter (flavors: resident, guard)
│   ├── admin/          # React admin web
│   └── docs-site/      # optional public docs
├── packages/
│   ├── design-tokens/  # shared tokens (JSON -> CSS vars + Dart)
│   ├── api-client/     # generated TS client from OpenAPI
│   └── config/         # eslint, tsconfig, prettier
├── infra/
│   ├── docker/
│   ├── terraform/
│   └── k8s/            # later
├── docs/               # ADRs, runbooks, API notes
└── .github/workflows/
```

---

## 4. DESIGN SYSTEM: NEO-BRUTALISM + PASTEL

The identity is **bold, friendly, and unmistakable**: thick black borders, hard offset shadows, chunky type, flat pastel fills, playful stickers. Never glossy, never gradient-heavy, never blurry shadows.

### 4.1 Color tokens

| Token | Hex | Use |
|---|---|---|
| `--ink` | `#111111` | Text, borders, shadows |
| `--paper` | `#FFFBF2` | App background (warm off-white) |
| `--white` | `#FFFFFF` | Cards on tinted backgrounds |
| `--mint` | `#B8F2D0` | Success, approved, primary action |
| `--peach` | `#FFD3B6` | Warm accent, highlights |
| `--lilac` | `#D9C6FF` | Secondary action, info |
| `--sky` | `#BFE3FF` | Links, neutral info, visitors |
| `--butter` | `#FFF1A8` | Warnings, pending, notices |
| `--rose` | `#FFC2D1` | Deny, errors, SOS soft |
| `--tomato` | `#FF5A4E` | Critical/SOS only (use sparingly) |

**Rules**: text is always `--ink` on pastel (verify **WCAG AA 4.5:1**). Never put pastel text on pastel. Status colors always pair with an **icon and a label**, never color alone.

### 4.2 Shape, border, shadow

- Border: **3px solid `--ink`** (2px for dense lists/inputs on small screens).
- Radius: **12px** cards/buttons, **999px** pills/chips, **0** for hero blocks (square is allowed for contrast).
- Shadow: **hard offset, zero blur**: `4px 4px 0 var(--ink)` (cards), `6px 6px 0` (hero/modals), `2px 2px 0` (small chips).
- Pressed state: translate `(2px, 2px)` and shrink shadow to `2px 2px 0`.
- Hover (web): translate `(-2px, -2px)` and grow shadow to `6px 6px 0`.
- Focus ring: **3px `--ink` outline + 3px `--lilac` outer ring**, always visible.

### 4.3 Typography

- Headings: **Space Grotesk** (700) or **Archivo Black** for hero titles.
- Body: **Inter** or **DM Sans** (400/500/600).
- Numbers/codes/OTP: **JetBrains Mono** or **Space Mono**.
- Scale: 12 / 14 / 16 / 20 / 24 / 32 / 40. Minimum body size 16px on mobile (guards and elders need big text).
- Headings are tight (line-height 1.1), uppercase allowed for labels and chips only.

### 4.4 Spacing, layout

- 4px base grid: 4, 8, 12, 16, 24, 32, 48.
- Mobile padding 16px; cards separated by 16px.
- Touch targets **minimum 48x48px** (guard app: **56px** for primary actions).
- Max content width on admin web: 1280px; sidebar nav with thick right border.

### 4.5 Components (build once, reuse everywhere)

- `BrutalButton` (variants: primary mint, secondary lilac, danger rose, ghost white), sizes S/M/L/XL.
- `BrutalCard` (flat pastel fill, thick border, hard shadow, optional tilt of 0.5 to 1 degree for playful sections only).
- `BrutalInput`, `BrutalSelect`, `BrutalToggle` (chunky square knob), `BrutalChip`, `BrutalBadge`.
- `StatusStamp`: rotated stamp-style label (APPROVED, DENIED, PENDING) in status color.
- `OtpBoxes`: big monospace boxes with thick borders.
- `BottomNav` (mobile): 4 to 5 items, active item filled pastel with border and shadow.
- `ToastSticker`: slides in like a sticker with hard shadow.
- `EmptyState`: simple flat illustration + one bold line + one action.
- `ApprovalSheet`: full-width sheet with visitor photo, name, purpose, and two huge buttons (**APPROVE** mint / **DENY** rose).

### 4.6 Motion

- Fast and snappy: 120 to 180ms, ease-out; no long fades.
- Allowed: press-down, slide-up sheets, sticker pop (scale 0.9 -> 1.05 -> 1).
- Respect **reduced motion** system setting.
- Haptics on approve/deny (mobile).

### 4.7 Iconography and illustration

- Icons: **Lucide** (web) / `lucide_icons` (Flutter), stroke 2.5px, `--ink`.
- Illustrations: flat shapes, pastel fills, black outlines, no gradients, no stock photos of people.
- Avatars: simple geometric/cartoon faces in pastel circles with thick border.

### 4.8 Accessibility (non-negotiable)

- WCAG 2.1 AA minimum; test with TalkBack and VoiceOver.
- All controls labeled; dynamic text scaling up to 200% must not break layouts.
- Support **dark mode** using the same brutal language: `--paper` becomes `#161616`, borders/shadows become pastel (`--mint` or `--lilac`), text `#FFFBF2`.
- Language: English, Hindi, Gujarati (use ARB/i18n files; never hardcode strings).

### 4.9 Design tokens implementation

Source of truth in `packages/design-tokens/tokens.json`. Generate: CSS variables + Tailwind theme (web) and a `BrutalTheme` class (Flutter). **Never hardcode hex values in components.**

---

## 5. CORE DOMAIN RULES

### 5.1 Visit states

`PRE_APPROVED -> ARRIVED -> PENDING -> APPROVED | DENIED | TIMED_OUT -> ENTERED -> EXITED`

- Walk-in: guard creates `PENDING`; resident has **30s** (configurable) to respond.
- Escalation chain: primary resident -> other flat members -> automated call -> guard decision per society policy (`ALLOW`, `DENY`, `HOLD`).
- Pre-approval pass: signed token (HMAC), valid window, `uses_left`, one flat only. Validates **offline** in the guard app.
- Deliveries: `APPROVE`, `LEAVE_AT_GATE`, `DENY`; residents can pre-approve companies for a time window.
- Every state change writes an **audit log** row.

### 5.2 Guard data minimization

Guards see: flat number, resident first name, masked phone. Never full phone, ID documents, payment info, or other flats' details.

### 5.3 SOS

SOS triggers: loud alert to guards + admins, flat location, acknowledgment tracking, escalation if unacknowledged in 20s. Must work even with degraded connectivity (SMS fallback to admin).

### 5.4 Payments

Invoices are immutable once issued (use credit notes). Reconcile via gateway webhooks with **idempotency**. Never store card data; gateway handles it.

---

## 6. API CONVENTIONS

- REST under `/v1`, JSON, OpenAPI is the contract (generate clients from it).
- Auth: `Authorization: Bearer <JWT>`; refresh rotation with reuse detection.
- **Idempotency-Key** header on all retried writes (visits, payments, bookings).
- Cursor pagination (`?cursor=&limit=`), max limit 100.
- Error shape: `{ "error": { "code": "STRING_CODE", "message": "...", "details": {} , "requestId": "..." } }`.
- Validation with Zod/class-validator at the edge; never trust client roles or `society_id`: derive from the token.
- Rate limits: OTP send 3 per 10 min per phone, 10 per hour per IP; login attempts limited with progressive lockouts.
- All timestamps UTC ISO-8601; render in `Asia/Kolkata` by default per society setting.

---

## 7. DATABASE RULES

- UUIDv7 primary keys; `created_at`, `updated_at` on every table.
- Every tenant table has `society_id` + composite indexes starting with it.
- Use **Postgres Row-Level Security** as a defense-in-depth layer in addition to app checks.
- Migrations are forward-only, backward compatible (expand, migrate, contract).
- Field-level encryption for phone numbers and ID documents (envelope encryption, keys in KMS/vault).
- Partition `visits` and `audit_logs` monthly when large.
- Seed scripts for demo society (150 flats, 3 blocks) for dev and demos.

---

## 8. SECURITY AND PRIVACY (DPDP-ALIGNED)

- TLS everywhere; HSTS; secure cookies on web; certificate pinning optional in mobile.
- Secrets only in env/vault. **Never commit secrets.** Run secret scanning in CI.
- Dependency scanning (Dependabot/Renovate), SAST (CodeQL), container scanning (Trivy).
- Consent screen with purpose-specific, plain-language text; store consent records.
- Retention defaults: visitor photos 90 days, logs per society policy; scheduled purge jobs.
- Data subject requests: in-app export and delete flow.
- Audit logs are append-only; admin and super-admin actions always logged.
- Pen-test before first paid launch; incident response runbook in `docs/runbooks/`.
- Logging: **never log OTPs, tokens, full phone numbers, or documents**.

---

## 9. OFFLINE AND RELIABILITY (GUARD APP)

- Local SQLite (Drift) cache: flats, masked residents, active pass tokens, society policies.
- Outbox pattern: actions queue locally with idempotency keys and sync with exponential backoff.
- Visible connection state badge (ONLINE / WEAK / OFFLINE) in the guard UI.
- Fallbacks: push -> in-app realtime -> automated call -> SMS -> guard policy.
- Foreground service on Android for reliable alerts; handle battery optimizations.

---

## 10. TESTING REQUIREMENTS

- Every PR: unit tests for new logic, lint, typecheck, build must pass.
- **Tenant isolation tests** for every new endpoint (attempt cross-society access, expect 403/404).
- API integration tests run against real Postgres + Redis in CI (Testcontainers/docker).
- E2E: login -> pre-approve -> guard verify; walk-in -> approve -> entry; SOS flow.
- Load test with k6: 500 visits/hour for one society, 50 concurrent approvals; p95 latency < 300ms server side.
- Test on low-end Android emulator profile; verify offline mode manually per release.
- Coverage target: **80%+ on domain/business modules** (not vanity-chasing on boilerplate).

---

## 11. DEVOPS

- Trunk-based dev; short branches: `feat/`, `fix/`, `chore/`; Conventional Commits.
- CI (GitHub Actions): lint -> test -> build -> scan -> docker image -> deploy staging -> smoke -> manual approval -> prod.
- Environments: `local`, `staging`, `production`; config via env, validated at startup.
- Infrastructure as code (Terraform); no manual console changes.
- Zero-downtime deploys, health checks (`/healthz`, `/readyz`), graceful shutdown.
- Mobile releases: internal -> closed beta -> staged rollout (5/25/100%).
- Backups: daily full + PITR; **monthly restore drill**.
- Alerts: error rate, p95 latency, push failure rate, queue depth, approval latency, payment webhook failures.

---

## 12. WORKFLOW FOR AGENTS

1. **Read** this file and the relevant phase tasks.
2. **Plan** briefly: list files to change and tests to add (comment in PR or task notes).
3. **Implement** in small steps; keep modules cohesive (`auth`, `societies`, `visits`, `passes`, `notices`, `tickets`, `billing`, `staff`, `amenities`, `notifications`).
4. **Test** locally; run lint, typecheck, tests.
5. **Document**: update OpenAPI, ADRs (`docs/adr/NNN-title.md`) for significant decisions, and this file if rules change.
6. **Self-review** the diff for security, tenant scoping, accessibility, and design-token usage.
7. Open PR with: summary, screenshots (for UI), test evidence, risks, rollback notes.

**Definition of Done**: feature works end to end, tests pass, tenant isolation verified, no hardcoded colors/strings, accessibility checked, docs updated, no new warnings.

**Do not**

- Add ad/analytics SDKs, or send personal data to third parties without explicit approval.
- Use `any` types in TypeScript or ignore lint rules to pass CI.
- Bypass RBAC for convenience, even in dev.
- Commit `.env`, keys, or real resident data (use synthetic data).
- Introduce new major dependencies without noting why in the PR.

---

## 13. ENVIRONMENT VARIABLES (EXAMPLE, `.env.example`)

```
NODE_ENV=development
DATABASE_URL=postgresql://gatelite:gatelite@localhost:5432/gatelite
REDIS_URL=redis://localhost:6379
JWT_ACCESS_SECRET=change-me
JWT_REFRESH_SECRET=change-me
OTP_PROVIDER=msg91
MSG91_AUTH_KEY=
FCM_SERVICE_ACCOUNT_JSON=
S3_ENDPOINT=http://localhost:9000
S3_BUCKET=gatelite-dev
PAYMENT_PROVIDER=razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
PASS_SIGNING_KEY=change-me
SENTRY_DSN=
```

Local dev: `docker compose up` starts Postgres, Redis, MinIO, and Mailpit.

---

## 14. PHASES AND EXIT CRITERIA

| Phase | Weeks | Focus | Exit criteria |
|---|---|---|---|
| 0 | 1-3 | Discovery, pilots | 2 pilot societies signed, scope frozen |
| 1 | 3-6 | Foundation, design system, schema, CI | OTP login works on staging, CI green |
| 2 | 6-11 | Core gate flow (passes, guard app, realtime, offline) | Approval < 5s p95 on 4G; offline verified |
| 3 | 11-14 | Notices, tickets, SOS, admin panel | MVP complete, no critical/high bugs |
| 4 | 14-20 | Pilot launch, training, hardening | 70% activation, 99.5% crash-free |
| 5 | 20-30 | Payments, staff, amenities, subscriptions | First paid society, payments > 98% success |
| 6 | 30-42 | Public launch, sales, support | 10 paying societies |
| 7 | 10-18 mo | Scale, hardware, analytics, audits | 99.9% uptime, 100 societies |

**Phase 1 starter checklist for the agent**

- [ ] Init monorepo, linting, formatting, commit hooks, CI
- [ ] `design-tokens` package + Tailwind theme + Flutter `BrutalTheme`
- [ ] Core components: Button, Card, Input, Chip, StatusStamp, OtpBoxes, BottomNav
- [ ] Prisma schema v1 + migrations + seed script
- [ ] Auth module: OTP send/verify, JWT, refresh rotation, device binding
- [ ] OpenAPI + generated client
- [ ] Docker Compose dev stack; staging deploy via Terraform
- [ ] Observability baseline (logs, metrics, Sentry)

---

## 15. FIRST SCREENS TO BUILD (BRUTALIST WIREFRAMES)

1. **Login**: huge "GATELITE" title on `--butter` block, phone input, thick mint **SEND OTP** button, small privacy note.
2. **OTP**: six big monospace boxes, timer chip, resend link.
3. **Resident Home**: greeting card (peach), quick actions grid (Invite guest, Deliveries, Complaints, SOS), "Today at the gate" list with status stamps.
4. **Approval Sheet**: visitor photo, name, purpose, **APPROVE / DENY** giant buttons, "Let guard decide" ghost link.
5. **Guard Home**: giant **NEW VISITOR** and **VERIFY CODE** buttons, connection badge, live pending list.
6. **Admin Dashboard**: stat cards (visits today, open tickets, dues), recent notices, activity table with thick borders.

---

## 16. ADR LOG AND DECISION RULES

- Record any decision that changes architecture, data model, security, vendor, or design rules as an ADR.
- Prefer boring, proven tech. Optimize for a small team shipping fast and sleeping well.
- When uncertain between speed and safety at the gate, **choose safety, then make it fast**.

*End of AGENTS.md. Keep this file updated as the project evolves.*
