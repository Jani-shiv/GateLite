# ADR 001: Modular Monolith Architecture

## Status
Accepted

## Context
We need to choose an architectural style for GateLite backend. Options considered:
- Microservices
- Modular monolith
- Serverless functions

## Decision
We will use a **modular monolith** with NestJS modules, with the option to extract services later.

## Rationale
1. **Team size**: Solo/small team - microservices add operational overhead
2. **Deployment simplicity**: Single deployable unit, easier CI/CD
3. **Transaction management**: ACID transactions across modules without distributed transactions
4. **Refactoring ease**: Module boundaries can be enforced via tooling, extracted later if needed
5. **Performance**: No network latency between modules

## Implementation
- Each domain (auth, societies, visits, passes, notices, tickets, staff, amenities, billing, audit) is a NestJS module
- Modules communicate via TypeScript interfaces, not HTTP
- Shared Prisma client with module-specific repositories
- Clear module boundaries: no cross-module imports of services, only via defined interfaces
- Future extraction: modules can become separate services with minimal changes

## Consequences
- **Positive**: Faster development, simpler debugging, easier testing
- **Negative**: All modules share process memory/CPU; single point of failure
- **Mitigation**: Horizontal scaling of entire app; extract high-load modules first (visits, notifications)

---

# ADR 002: Neo-Brutalist Design System

## Status
Accepted

## Context
Need a distinctive, accessible, and implementable design system for GateLite.

## Decision
Adopt **neo-brutalism with pastel palette** as the visual language.

## Rationale
1. **Differentiation**: Stands out from glossy, gradient-heavy competitors
2. **Accessibility**: High contrast (ink on pastel), thick borders, clear focus states
3. **Implementation**: Simple CSS (no gradients, complex shadows), easy to maintain
4. **Performance**: No heavy images, works well on low-end devices
5. **Brand**: Bold, friendly, unmistakable identity

## Token System
- Source of truth: `packages/design-tokens/tokens.json`
- Generated outputs: CSS variables, Tailwind theme, Flutter `BrutalTheme` class
- Never hardcode colors/spacing in components

## Consequences
- **Positive**: Consistent across web/mobile, easy theming (dark mode), accessible by default
- **Negative**: May not appeal to users expecting "modern" glossy UI
- **Mitigation**: User testing with target demographic (guards, elderly residents)

---

# ADR 003: Phone OTP Authentication with JWT

## Status
Accepted

## Context
Need secure, user-friendly authentication for residents, guards, and admins.

## Decision
Use **phone OTP** with short-lived JWT access tokens (15min) and rotating refresh tokens.

## Rationale
1. **No passwords**: Eliminates credential stuffing, password reset flows
2. **Device binding**: Refresh tokens tied to device, rotation with reuse detection
3. **Short access tokens**: Limits blast radius of token theft
4. **Indian market**: Phone-first, OTP is expected UX
5. **Provider abstraction**: SMS/WhatsApp providers behind interface for testing

## Implementation
- Access token: 15min, signed with `JWT_ACCESS_SECRET`
- Refresh token: 30 days, signed with `JWT_REFRESH_SECRET`, stored hashed in DB
- Rotation: New refresh token issued on each use, old one revoked
- Reuse detection: If same refresh token used twice → revoke all user tokens
- Device tracking: FCM token + platform stored per device

## Consequences
- **Positive**: Secure, user-friendly, scalable
- **Negative**: SMS costs, OTP delivery delays
- **Mitigation**: Mock provider for dev, prefer push notifications, rate limiting

---

# ADR 004: HMAC-Signed Pass Codes for Offline Verification

## Status
Accepted

## Context
Guard app must verify pre-approval passes offline (poor network at gates).

## Decision
Use **HMAC-signed codes** embedded in QR codes for offline verification.

## Rationale
1. **Offline-first**: No network call needed to validate pass
2. **Tamper-proof**: HMAC with rotating server key
3. **Expirable**: Timestamp embedded in payload
4. **Bounded uses**: `uses_left` counter in payload
5. **Stateless**: Server doesn't need to store validation state

## Implementation
- Payload: `{ visitorId, flatId, validFrom, validTo, usesLeft, timestamp }`
- Encoding: Base64URL + HMAC-SHA256 signature
- Code format: `BASE64URL.SIGNATURE` (uppercase for readability)
- Verification: Decode payload, verify HMAC, check expiry, check uses
- Key rotation: `PASS_SIGNING_KEY` env var, rotate periodically

## Consequences
- **Positive**: Works offline, secure, no database lookup for validation
- **Negative**: Code length longer than simple 6-digit codes
- **Mitigation**: QR code scanning primary, manual entry fallback

---

# ADR 005: Socket.IO + FCM for Realtime Approvals

## Status
Accepted

## Context
Visitor approval must feel instant (<5s) even on poor networks.

## Decision
Use **Socket.IO for realtime** with **FCM push as wake-up channel**.

## Rationale
1. **Low latency**: WebSocket connection for instant updates
2. **Reliability**: FCM wakes up app if Socket.IO disconnected
3. **Fallback chain**: Push → WebSocket → SMS → Call → Guard policy
4. **Scalability**: Socket.IO rooms per flat (`flat:{flatId}`)
5. **Cross-platform**: Works on web, Flutter, React Native

## Implementation
- Client connects with JWT, joins `flat:{flatId}` room
- Server emits `visit:pending`, `visit:updated` events
- FCM sent for critical events (SOS, visit:pending) as backup
- Escalation timer runs server-side, emits events on timeout

## Consequences
- **Positive**: Real-time feel, works on poor networks
- **Negative**: More complex than polling, connection management
- **Mitigation**: Connection state badge in guard app, automatic reconnection

---

# ADR 006: Provider Interfaces for External Services

## Status
Accepted

## Context
Need to integrate SMS, WhatsApp, Push, Payments, Storage — but vendors may change.

## Decision
Define **TypeScript interfaces** for each provider with mock implementations for development.

## Rationale
1. **Vendor independence**: Swap MSG91→Twilio, Razorpay→Cashfree without code changes
2. **Local development**: Mock providers work without API keys
3. **Testing**: Deterministic behavior in tests
4. **Cost control**: Mock providers in CI, real providers in staging/prod

## Providers
- `OtpProvider`: `send(phone, code)`, `verify(phone, code)`
- `SmsProvider`: `send(phone, message)`
- `WhatsAppProvider`: `send(phone, template, params)`
- `PushProvider`: `sendPush(token, payload)`, `sendToTopic(topic, payload)`
- `StorageProvider`: `upload(key, file, contentType)`, `delete(key)`, `getSignedUrl(key, expires)`
- `PaymentProvider`: `createOrder()`, `verifyPayment()`, `createRefund()`

## Consequences
- **Positive**: Flexible, testable, vendor-agnostic
- **Negative**: More upfront abstraction work
- **Mitigation**: Start with mocks, add real implementations incrementally

---

# ADR 007: Database Schema with UUIDv7 and RLS

## Status
Accepted

## Context
Need a database schema that supports multi-tenancy, auditability, and performance.

## Decision
- **Primary keys**: UUIDv7 (time-ordered, better index locality)
- **Multi-tenancy**: Every table has `society_id` + composite indexes
- **Row-Level Security**: PostgreSQL RLS as defense-in-depth
- **Audit fields**: `created_at`, `updated_at` on every table
- **Partitioning**: Monthly partitions for `visits` and `audit_logs` when volume grows

## Rationale
1. **UUIDv7**: Sortable by creation time, no hotspots
2. **RLS**: Extra layer of protection against cross-tenant leaks
3. **Indexes**: Composite starting with `society_id` for query performance
4. **Soft deletes**: Only where legally required (GDPR/DPDP)

## Consequences
- **Positive**: Secure, performant, audit-friendly
- **Negative**: Slightly larger PKs (16 bytes vs 4/8 bytes)
- **Mitigation**: Acceptable for expected scale (100 societies × 500 flats)