# GateLite

> A MyGate-style gated community management app — fast, secure, offline-tolerant, and 100% ad-free for residents.

## 🏗 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        GateLite Monorepo                        │
├─────────────────────────────────────────────────────────────────┤
│  apps/                                                          │
│  ├── api/           # NestJS backend API (TypeScript)           │
│  ├── mobile/        # Flutter apps (Resident + Guard flavors)   │
│  └── admin/         # React admin dashboard (Vite + TypeScript) │
├─────────────────────────────────────────────────────────────────┤
│  packages/                                                      │
│  ├── design-tokens/ # Neo-brutalist design system tokens        │
│  ├── api-client/    # Generated TypeScript API client           │
│  └── config/        # Shared ESLint, Prettier, TypeScript config│
├─────────────────────────────────────────────────────────────────┤
│  infra/                                                         │
│  ├── docker/        # Docker Compose for local development      │
│  └── terraform/     # Infrastructure as Code (future)           │
└─────────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm 8.10+
- Docker & Docker Compose
- PostgreSQL 16 (or use Docker)

### One-Command Setup

```bash
# Clone and install
git clone <repo-url>
cd GateLite
pnpm install

# Start all services (Postgres, Redis, MinIO, Mailpit)
docker compose -f infra/docker/docker-compose.yml up -d

# Build design tokens
pnpm tokens:build

# Set up database
pnpm db:generate
pnpm db:migrate
pnpm db:seed

# Start development servers
pnpm dev
```

This starts:
- **API**: http://localhost:4000 (Swagger at `/docs`)
- **Admin**: http://localhost:3000
- **Mailpit**: http://localhost:8025
- **MinIO Console**: http://localhost:9001

### Demo Login

Use these credentials after seeding:

| Role | Phone | Password |
|------|-------|----------|
| Admin | +919876543210 | OTP: 123456 |
| Guard | +919876543211 | OTP: 123456 |
| Resident | +919876543212 | OTP: 123456 |

## 🎨 Design System: Neo-Brutalism + Pastel

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--ink` | `#111111` | Text, borders, shadows |
| `--paper` | `#FFFBF2` | App background |
| `--mint` | `#B8F2D0` | Success, primary actions |
| `--peach` | `#FFD3B6` | Warm accents |
| `--lilac` | `#D9C6FF` | Secondary actions |
| `--sky` | `#BFE3FF` | Info, links |
| `--butter` | `#FFF1A8` | Warnings, pending |
| `--rose` | `#FFC2D1` | Errors, deny |
| `--tomato` | `#FF5A4E` | Critical/SOS only |

### Component Principles

- **Borders**: 3px solid ink (2px for dense layouts)
- **Radius**: 12px cards/buttons, 999px pills, 0 hero blocks
- **Shadows**: Hard offset, zero blur (4px/4px/0 for cards)
- **Touch targets**: ≥48px (56px for guard primary actions)
- **Typography**: Space Grotesk (headings), Inter (body), JetBrains Mono (codes)

### Using Design Tokens

```typescript
// Web (Tailwind)
<div className="bg-mint border-3 border-ink shadow-card rounded-[12px] p-6">

// Flutter
Container(
  decoration: BoxDecoration(
    color: BrutalTheme.mint,
    border: Border.all(color: BrutalTheme.ink, width: 3),
    boxShadow: BrutalTheme.shadowCard,
    borderRadius: BrutalTheme.borderRadiusDefault,
  ),
)
```

## 📦 Tech Stack

| Layer | Technology |
|-------|------------|
| Mobile | Flutter 3.x, Riverpod, go_router, Drift (SQLite) |
| Admin Web | React 18, Vite, TypeScript, TanStack Query, Tailwind CSS |
| Backend | NestJS, TypeScript, Prisma ORM |
| Database | PostgreSQL 16 |
| Cache/Queue | Redis 7 + BullMQ |
| Realtime | Socket.IO + FCM |
| Storage | S3-compatible (MinIO in dev) |
| Auth | Phone OTP, JWT (15min) + rotating refresh tokens |
| SMS/WhatsApp | Provider interface (mock in dev) |
| Payments | Provider interface (mock in dev) |
| Observability | OpenTelemetry, Prometheus, Grafana, Loki, Sentry |

## 🧪 Testing

```bash
# Run all tests
pnpm test

# API tests (with real Postgres/Redis)
pnpm --filter=@gatelite/api test

# Admin tests
pnpm --filter=@gatelite/admin test

# Type checking
pnpm typecheck

# Linting
pnpm lint
```

### Test Requirements

- **Tenant isolation tests** for every endpoint
- **E2E tests**: login → pre-approve → guard verify; walk-in → approve → entry; SOS flow
- **Load test**: 500 visits/hour, 50 concurrent approvals, p95 < 300ms
- **Offline mode**: Guard app tested on low-end Android (2GB RAM)

## 🐳 Docker Development

```bash
# Start all services
docker compose -f infra/docker/docker-compose.yml up -d

# View logs
docker compose -f infra/docker/docker-compose.yml logs -f api

# Stop and remove volumes
docker compose -f infra/docker/docker-compose.yml down -v

# Rebuild API
docker compose -f infra/docker/docker-compose.yml build api
```

## 📁 Project Structure

```
gatelite/
├── AGENTS.md              # Project rules & guidelines
├── PLAN.md                # Product plan & roadmap
├── TASKS.md               # Phase task tracking
├── package.json           # Root pnpm workspace
├── pnpm-workspace.yaml
├── turbo.json             # Turborepo config
├── .env.example
├── .gitignore
├── README.md
├── apps/
│   ├── api/               # NestJS backend
│   │   ├── src/
│   │   │   ├── auth/      # OTP, JWT, refresh tokens
│   │   │   ├── societies/ # Society/block/flat management
│   │   │   ├── visits/    # Visitor management + Socket.IO
│   │   │   ├── passes/    # Pre-approval passes (HMAC)
│   │   │   ├── notices/   # Notice board + push
│   │   │   ├── tickets/   # Complaints & tickets
│   │   │   ├── staff/     # Daily help staff
│   │   │   ├── amenities/ # Booking system
│   │   │   ├── billing/   # Invoices & payments
│   │   │   ├── devices/   # FCM device management
│   │   │   ├── audit/     # Audit logs
│   │   │   └── common/    # Prisma, guards, decorators
│   │   └── prisma/        # Schema, migrations, seed
│   ├── mobile/            # Flutter (resident/guard flavors)
│   └── admin/             # React admin dashboard
├── packages/
│   ├── design-tokens/     # tokens.json → CSS/Tailwind/Flutter
│   ├── api-client/        # Generated from OpenAPI
│   └── config/            # ESLint, Prettier, TS configs
├── infra/
│   ├── docker/            # Docker Compose, Dockerfiles
│   └── terraform/         # IaC (future)
├── docs/
│   ├── adr/               # Architecture Decision Records
│   └── runbooks/          # Operational runbooks
└── .github/workflows/     # CI/CD pipelines
```

## 🔐 Security & Privacy

- **Multi-tenant isolation**: Every query scoped by `society_id`
- **Row-Level Security** in PostgreSQL as defense-in-depth
- **Field-level encryption** for phone numbers & ID documents
- **No ad SDKs, no trackers** — ever
- **DPDP Act compliant**: Consent screens, data export, retention policies
- **Audit logs**: Append-only, all admin actions logged
- **Rate limiting**: OTP (3/10min), login (progressive lockout)

## 📋 Development Workflow

1. Read `AGENTS.md` and relevant phase tasks
2. Plan: list files to change and tests to add
3. Implement in small steps; keep modules cohesive
4. Test locally: lint, typecheck, tests
5. Document: update OpenAPI, ADRs, this README
6. Self-review: security, tenant scoping, accessibility, design tokens
7. Open PR with summary, screenshots, test evidence

## 🗓 Phase Roadmap

| Phase | Focus | Exit Criteria |
|-------|-------|---------------|
| 1 | Foundation, design system, schema, CI | OTP login works, CI green |
| 2 | Core gate flow (passes, guard app, realtime, offline) | Approval < 5s p95, offline verified |
| 3 | Notices, tickets, SOS, admin panel | MVP complete, no critical bugs |
| 4 | Pilot launch | 70% activation, 99.5% crash-free |
| 5 | Payments, staff, amenities | First paid society, >98% payment success |
| 6 | Public launch | 10 paying societies |
| 7 | Scale & advanced | 99.9% uptime, 100 societies |

## 📄 License

Proprietary — GateLite team. All rights reserved.

---

Built with ❤️ for gated communities in India. No ads, no tracking, just calm.