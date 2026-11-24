# GateLite: Complete Plan and Phase-wise Roadmap

Prepared for Shiv Jani | November 2026 | Working name: **GateLite** (rename freely)

A gated-community and society management app in the spirit of MyGate, built to be fast, secure, and **ad-light**. This document covers product, architecture, data, security, money, and every build phase in depth.

## 1. Vision and Positioning

**One-line vision:** the calmest, fastest, most trustworthy society app in India, where residents never see a banner ad.

**Why this can win**

- Incumbents earn from ads and partner promotions, so residents feel spammed.
- Committees are tired of cluttered apps and want control over their own data.
- A subscription model paid by the society aligns incentives: we serve residents, not advertisers.

**Principles**

- Gate speed first: approving a visitor must take under 5 seconds.
- Works on bad networks, with offline fallbacks for guards.
- No third-party ad SDKs. Ever.
- Privacy by design under India's DPDP Act.
- Simple UI with a bold neo-brutalist identity (pastel palette, thick borders, hard shadows).

**Non-goals for v1:** hardware boom barriers, face recognition, smart-home control, a marketplace.

## 2. Users and Roles

| Role | Who | Main jobs |
| --- | --- | --- |
| Resident | Owner or tenant | Pre-approve guests, approve/deny entries, pay dues, raise complaints, book amenities |
| Family member | Added by resident | Same as resident with limited rights |
| Guard | Security staff | Log visitors, verify OTP/QR, call residents, raise alerts |
| Society Admin | Committee or manager | Manage flats and residents, notices, billing, complaints, reports |
| Super Admin | Us | Onboard societies, billing, support, monitoring |

**Permission model:** role-based access control (RBAC) scoped by society. Every row of data carries a `society_id`, and every query is filtered by it (multi-tenancy).

## 3. Feature Scope

### 3.1 MVP (Phase 1 to 3)

1. **Phone OTP login** for all roles.
2. **Onboarding:** society, towers/blocks, flats, resident invites.
3. **Visitor pre-approval:** resident creates a pass with name, date, validity; a 6-digit code and QR are shared by link or SMS/WhatsApp.
4. **Walk-in approval:** guard enters visitor details, resident gets a push and a call fallback, approves or denies in one tap.
5. **Delivery and cab handling:** quick approve, leave-at-gate, or deny; frequent delivery companies can be pre-approved.
6. **Entry/exit logs** with photo capture by guard.
7. **Notice board** with push notifications.
8. **Complaints and tickets** with status and comments.
9. **Emergency/SOS** button that alerts guards and admins.
10. **Admin web dashboard** for the basics.

### 3.2 Version 2 (Phase 4 to 5)

- Daily help (maid, cook, driver) registry with QR/ID and attendance.
- Maintenance billing, UPI/online payments, receipts, dues reminders.
- Amenity booking (clubhouse, hall, court) with slots and fees.
- Polls, voting, and meeting notices.
- Vehicle registry and parking management.
- Resident directory with privacy controls.

### 3.3 Version 3 (Phase 6 onward)

- Vetted local-service directory (the only "promotion" surface, clearly labeled and opt-in).
- Accounting and expense reports for committees.
- Analytics dashboards.
- Integrations: ANPR cameras, RFID, intercom, boom barriers.
- Multi-language UI (Hindi, Gujarati, others).

## 4. Architecture

### 4.1 High-level design

Start with a **modular monolith**, not microservices. It is faster to build, easier to deploy, and can be split later.

- **Mobile apps:** Flutter, one codebase with two flavors: Resident and Guard.
- **Admin web:** React (Vite) with TypeScript.
- **Backend API:** NestJS (TypeScript) or FastAPI (Python). Pick the one you are fastest in; this plan assumes NestJS.
- **Database:** PostgreSQL (primary store), with row-level scoping by `society_id`.
- **Cache and queues:** Redis plus BullMQ for jobs (notifications, reminders, billing runs).
- **Realtime:** WebSockets (Socket.IO) for live approval state, with FCM push as the wake-up channel.
- **Object storage:** S3-compatible bucket (visitor photos, documents).
- **Notifications:** Firebase Cloud Messaging, SMS gateway (MSG91 or similar), WhatsApp Business API for invites.
- **Payments:** Razorpay or Cashfree.
- **Observability:** Prometheus, Grafana, Loki, and Sentry.

### 4.2 Core flow: walk-in visitor

1. Guard opens Guard app, enters flat number, visitor name, purpose, takes photo.
2. API creates a `visit` with state `PENDING` and sends FCM push plus WebSocket event to the flat's residents.
3. Resident taps **Approve** or **Deny** (target: under 5 seconds).
4. API updates state, pushes result to guard in realtime.
5. If no response in 30 seconds, escalate: second resident, then automated call, then guard decides per society policy.
6. Entry and exit timestamps are logged.

### 4.3 Offline and low-network strategy

- Guard app keeps a local SQLite cache of flats, residents (masked), and active pre-approval codes.
- Pre-approval codes validate offline using signed tokens (HMAC with rotating keys).
- Actions queue locally and sync when the network returns; each action has an idempotency key.

### 4.3 API conventions

- REST with OpenAPI spec, versioned under `/v1`.
- JWT access tokens (15 minutes) with rotating refresh tokens.
- Cursor pagination, consistent error shape, idempotency keys on every write that can be retried.
- Rate limiting per IP and per phone number, especially on OTP endpoints.

## 5. Data Model (core tables)

| Table | Key fields |
| --- | --- |
| `societies` | id, name, address, plan, settings\_json, status |
| `blocks` | id, society\_id, name |
| `flats` | id, society\_id, block\_id, number, floor |
| `users` | id, phone (unique), name, avatar\_url, status |
| `memberships` | id, user\_id, society\_id, flat\_id, role, is\_owner, status |
| `visitors` | id, society\_id, name, phone, photo\_url, type |
| `passes` | id, society\_id, flat\_id, created\_by, visitor\_id, code, valid\_from, valid\_to, uses\_left |
| `visits` | id, society\_id, flat\_id, visitor\_id, state, guard\_id, approved\_by, in\_at, out\_at |
| `staff` | id, society\_id, name, role, qr\_code, verified\_at |
| `staff_attendance` | id, staff\_id, flat\_id, in\_at, out\_at |
| `notices` | id, society\_id, title, body, pinned, created\_by |
| `tickets` | id, society\_id, flat\_id, category, status, priority |
| `ticket_comments` | id, ticket\_id, user\_id, body, created\_at |
| `invoices` | id, society\_id, flat\_id, period, amount, due\_date, status |
| `payments` | id, invoice\_id, gateway\_ref, amount, status, paid\_at |
| `amenities` | id, society\_id, name, rules\_json, fee |
| `bookings` | id, amenity\_id, flat\_id, slot\_start, slot\_end, status |
| `audit_logs` | id, society\_id, actor\_id, action, entity, entity\_id, ip, at |
| `devices` | id, user\_id, fcm\_token, platform, last\_seen |

**Notes**

- Use UUIDs (v7 for sort order) as primary keys.
- Soft delete only where legally needed; otherwise hard delete on request.
- Index on `(society_id, flat_id, created_at)` for all log-style tables.
- Partition `visits` and `audit_logs` by month once volume grows.

## 6. Security, Privacy, and Compliance

**Threats to design against**

- Fake visitors using forged passes: signed, expiring, single-use codes.
- Account takeover via OTP abuse: rate limits, device binding, lockouts.
- Cross-society data leaks: mandatory tenant filter, automated tests that try cross-tenant reads.
- Guard misuse (viewing resident data): masked numbers, no export, audit trail.
- Insider access: least privilege, access logs, MFA for super admin.

**Controls**

- TLS everywhere, HSTS, encrypted databases and backups (AES-256).
- Secrets in a vault, never in the repo; dependency scanning and SAST in CI.
- Field-level encryption for phone numbers and ID documents.
- Regular penetration test before the first paid launch.

**DPDP Act (India) checklist**

- Clear, purpose-bound consent screen in plain language.
- Data minimization: collect only what each feature needs.
- Retention limits (for example visitor photos deleted after 90 days, configurable).
- User rights: access, correction, deletion request flow inside the app.
- Breach response plan and a named grievance contact.
- Verify current rules and consult a lawyer before launch; requirements and timelines may change.

## 7. Business Model

**Principle:** the society pays, residents never see ads.

| Tier | Price (indicative) | Includes |
| --- | --- | --- |
| Starter | Free up to 50 flats | Visitors, notices, complaints, SOS |
| Standard | ₹5 to ₹8 per flat per month | Starter plus staff tracking, amenity booking, polls |
| Pro | ₹10 to ₹15 per flat per month | Standard plus payments, accounting, analytics, priority support |

**Other revenue**

- Small convenience fee on online maintenance collection, where gateway terms and law allow.
- Optional, opt-in vendor directory with flat listing fees (clearly labeled, no banners, no tracking).
- One-time onboarding and training fee for large societies.

**Rough unit economics:** a 300-flat society on Standard at ₹6 pays about ₹1,800 per month (₹21,600 per year). Hosting and SMS per such society should stay under 15 to 20 percent of revenue. Validate with real pilot numbers.

## 8. Phase-wise Roadmap

Timelines assume one strong full-stack developer plus part-time design help. With a team of 3 to 4, compress by about 40 percent.

### Phase 0: Discovery and Validation (Weeks 1 to 3)

**Goals:** prove the problem is real and pick pilot societies.

**Tasks**

- Interview 10 to 15 people: committee members, residents, guards, a facility manager.
- Shadow a gate for a few hours and time the current entry process.
- Collect pain points with existing apps (ads, slowness, support).
- Shortlist 2 friendly pilot societies (100 to 300 flats each).
- Define success metrics and the MVP scope.
- Check legal basics: company registration, terms, privacy policy outline.

**Deliverables:** research summary, MVP scope doc, pilot agreements.

**Exit criteria:** two societies agree to pilot; scope frozen.

### Phase 1: Foundation and Design (Weeks 3 to 6)

**Goals:** set up everything so building is fast.

**Tasks**

- Monorepo with apps (resident, guard, admin, api), CI, linting, formatting, commit hooks.
- Design system in the neo-brutalist pastel style: tokens for colors, borders, shadows, spacing, type.
- Figma screens for the five key flows (login, pre-approval, walk-in approval, notice, complaint).
- OpenAPI spec and database schema v1 with migrations.
- Dev, staging, and production environments with Docker and infrastructure as code.
- Observability baseline: logs, metrics, error tracking.

**Deliverables:** running skeleton, design system, API contract.

**Exit criteria:** a user can log in with OTP on staging and see an empty home screen; CI is green.

### Phase 2: Core Gate Flow (Weeks 6 to 11)

**Goals:** the heart of the product works end to end.

**Tasks**

- Society, block, flat, and resident onboarding (CSV import for admins).
- Pre-approval passes with QR and code; share link.
- Guard app: visitor entry, photo capture, OTP/QR verification, call fallback.
- Realtime approvals with FCM and WebSockets; escalation rules.
- Delivery and cab quick flows.
- Entry and exit logs and a resident-visible history.
- Offline cache and queue in the guard app.
- Load test: 500 visits per hour for one society.

**Deliverables:** working resident and guard apps on internal testing tracks.

**Exit criteria:** approval round trip under 5 seconds on 4G in 95 percent of cases; offline mode verified.

### Phase 3: Community Basics and Admin Panel (Weeks 11 to 14)

**Goals:** make the app useful daily, beyond the gate.

**Tasks**

- Notice board with push and read receipts.
- Complaints and tickets with assignment and status.
- SOS alert with sound, location of flat, and guard and admin acknowledgment.
- Admin web: residents, flats, notices, tickets, visitor reports.
- Audit logs and basic exports.
- Settings: escalation timing, retention, working hours.

**Deliverables:** MVP feature complete.

**Exit criteria:** internal QA passes; no critical or high bugs open.

### Phase 4: Pilot Launch (Weeks 14 to 20)

**Goals:** real people, real gates, real feedback.

**Tasks**

- Onboard pilot society 1, then society 2 two weeks later.
- Train guards (short video in local language plus on-site session) and committee.
- Daily check-ins in week 1; weekly after.
- Fix issues in rapid releases; keep a visible changelog.
- Track metrics: adoption, approval time, crash-free rate, support tickets.
- Run a small penetration test and a privacy review.

**Deliverables:** pilot report with metrics and testimonials.

**Exit criteria:** 70 percent resident activation, crash-free sessions above 99.5 percent, committee willing to pay.

### Phase 5: Payments, Staff, and Amenities (Weeks 20 to 30)

**Goals:** deepen value and unlock revenue.

**Tasks**

- Maintenance invoices, UPI/online payment, receipts, reminders, ledger.
- Daily help registry with QR and attendance.
- Amenity booking with slots, rules, and fees.
- Polls and votes.
- Vehicle and parking registry.
- Reconciliation reports for the treasurer.
- Subscription billing for societies.

**Deliverables:** Standard and Pro tiers ready.

**Exit criteria:** first paid society live; payment success above 98 percent.

### Phase 6: Public Launch and Growth (Weeks 30 to 42)

**Goals:** repeatable sales and onboarding.

**Tasks**

- Website, demo video, case studies from pilots.
- Sales playbook for committee decisions (pitch deck, ROI sheet, FAQ).
- Partnerships with facility management companies and RWA federations.
- Referral program: a society that refers another gets free months.
- Content marketing and local community events.
- Self-serve onboarding with a guided checklist.
- Support: help center, chat, escalation rota.

**Deliverables:** 10 paying societies, onboarding in under 2 days each.

**Exit criteria:** churn below 3 percent monthly; support load manageable.

### Phase 7: Scale and Advanced (Months 10 to 18)

**Goals:** reliability at 100+ societies and premium features.

**Tasks**

- Move to managed Kubernetes or a robust container platform; autoscaling.
- Read replicas, partitioning, and cost optimization.
- Hardware integrations: ANPR, RFID, boom barriers, intercom.
- Accounting module and analytics.
- Multi-language support and accessibility audit.
- Optional vetted vendor directory with strict labeling.
- SOC 2 style controls and external security audit.

**Deliverables:** enterprise-ready platform.

**Exit criteria:** 99.9 percent monthly uptime; 100 societies.

## 9. Team, Tools, and Budget

**Minimum team (solo start)**

- You: full-stack and DevOps.
- Part-time UI/UX designer (or use the design system tokens heavily).
- Part-time QA (from Phase 3).
- Support person (from Phase 4).

**Tooling:** GitHub, GitHub Actions, Docker, Terraform, Figma, Postman, Sentry, Grafana, Linear or Notion for planning.

**Indicative monthly costs (early stage, verify current prices)**

| Item | Estimate |
| --- | --- |
| Cloud VM, database, storage | ₹5,000 to ₹15,000 |
| SMS and WhatsApp | ₹3,000 to ₹10,000 (scales with usage) |
| Firebase, Sentry, misc SaaS | ₹2,000 to ₹6,000 |
| Domain, email, app store fees | ₹1,500 (amortized) |
| Designer and QA (part-time) | ₹30,000 to ₹60,000 |

## 10. Testing Strategy

- **Unit tests** for business rules (escalation, pass validity, billing).
- **Integration tests** against a real Postgres in CI.
- **Tenant isolation tests** that attempt cross-society access on every endpoint.
- **E2E tests** (Patrol or integration\_test for Flutter; Playwright for admin).
- **Load tests** with k6 for gate peaks (morning and evening rush).
- **Chaos and failure drills:** kill Redis, drop network, delay FCM; verify fallbacks.
- **Device matrix:** low-end Android phones (2 GB RAM) are the guard reality; test on them.
- **Usability tests** with real guards and elderly residents.

## 11. DevOps and Release Management

- Trunk-based development with short-lived branches and pull request checks.
- Pipeline: lint, test, build, scan, deploy to staging, smoke tests, manual approval, production.
- Infrastructure as code (Terraform), containers (Docker), orchestration later (Kubernetes).
- Zero-downtime deploys, database migrations that are backward compatible.
- Mobile releases: internal track, then closed beta, then staged rollout (5, 25, 100 percent).
- Backups: daily full, point-in-time recovery, monthly restore drill.
- Runbooks for incidents; on-call alert thresholds (error rate, push failure rate, approval latency).
- Cost monitoring with budget alerts.

## 12. Go-to-Market

**Target first:** mid-sized societies (100 to 500 flats) that are frustrated with ads or want better support, in Ahmedabad and Gujarat, then expand city by city.

**Pitch points**

- No ads for residents. Ever.
- Fast gate approvals and offline-safe guard app.
- Transparent pricing and data ownership for the society.
- Local support in Gujarati, Hindi, and English.
- Free pilot period and easy data import.

**Channels**

- Direct committee demos and WhatsApp group referrals.
- Facility management and security agency partnerships.
- RWA and builder associations.
- Your existing audience: Medium, LinkedIn, and Instagram build-in-public content.
- Case studies and short demo reels.

**Onboarding playbook:** data collection sheet, import, guard training, resident invite wave, week-1 support, week-4 review.

## 13. Risks and Mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Slow committee decisions | Long sales cycles | Free pilots, clear ROI sheet, resident-driven demand |
| Gate downtime | Loss of trust | Offline mode, call fallbacks, SLAs, monitoring |
| Data breach | Legal and reputational damage | Encryption, audits, least privilege, incident plan |
| Incumbent price war | Margin pressure | Focus on trust, support, and no-ads positioning |
| SMS/WhatsApp costs | Margin leak | Prefer push; pass-through limits per tier |
| Solo founder overload | Delays | Strict scope, modular design, early part-time help |
| Regulatory changes | Rework | Privacy-by-design, periodic legal review |

## 14. Success Metrics (KPIs)

**Product**

- Visitor approval time (median and p95).
- Resident activation rate and weekly active residents.
- Crash-free sessions and push delivery rate.
- Complaint resolution time.

**Business**

- Societies onboarded, paying societies, monthly recurring revenue.
- Monthly churn and net revenue retention.
- Support tickets per 100 flats.
- Customer acquisition cost versus lifetime value.

## 15. Master Checklist

- [ ] Phase 0: 10+ interviews, 2 pilots signed
- [ ] Phase 1: repo, CI, design system, schema, environments
- [ ] Phase 2: OTP login, passes, guard flow, realtime approvals, offline mode
- [ ] Phase 3: notices, tickets, SOS, admin panel
- [ ] Phase 4: pilots live, metrics collected, security review done
- [ ] Phase 5: payments, staff, amenities, subscriptions
- [ ] Phase 6: website, sales playbook, 10 paying societies
- [ ] Phase 7: scale, hardware integrations, audits

## 16. Immediate Next Steps (This Week)

1. Pick the final app name and check domain and Play Store availability.
2. Choose the backend stack (NestJS or FastAPI) and commit to it.
3. Set up the monorepo and CI.
4. Talk to two societies and book demo slots.
5. Hand the AGENTS.md to your coding agent and start Phase 1.
