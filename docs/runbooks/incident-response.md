# Runbook: Incident Response

## Severity Levels

| Level | Name | Response Time | Examples |
|-------|------|---------------|----------|
| SEV-1 | Critical | 15 min | API down, data breach, payment failure |
| SEV-2 | High | 1 hour | Slow approvals (>10s), partial outage |
| SEV-3 | Medium | 4 hours | Non-critical feature broken, UI bugs |
| SEV-4 | Low | Next sprint | Cosmetic issues, documentation |

## Incident Response Process

### 1. Detection
- **Automated**: Prometheus alerts (error rate >5%, p95 latency >5s, queue depth >1000)
- **Manual**: User reports, guard app crashes, support tickets
- **On-call**: PagerDuty/Opsgenie notification

### 2. Triage (First 15 min)
```
1. Acknowledge alert
2. Check status page: https://status.gatelite.app
3. Determine severity (SEV-1/2/3/4)
4. Create incident channel: #incident-<date>-<short-desc>
5. Assign Incident Commander (IC)
6. Post initial status: "Investigating - will update in 15 min"
```

### 3. Investigation
```
SEV-1/2:
- IC coordinates: backend, frontend, mobile, infra leads
- Check: logs (Loki), metrics (Grafana), traces (Tempo)
- Recent deployments? Rollback if <30 min ago
- Database: connections, locks, slow queries
- Redis: memory, evictions, queue depth
- External: SMS/payment provider status pages

SEV-3/4:
- Assign to relevant team member
- Reproduce in staging
- Create fix branch
```

### 4. Resolution
```
SEV-1/2:
- Implement fix or rollback
- Deploy to staging → smoke test → production
- Verify: error rate <1%, p95 <2s, approval flow works
- Post resolution status

SEV-3/4:
- Fix in next release
- Workaround documented
```

### 5. Post-Incident (Within 48 hours)
```
1. Schedule blameless postmortem
2. Write postmortem doc (template below)
3. Create action items with owners
4. Share with team and stakeholders
5. Update runbooks if needed
```

## Common Incidents & Fixes

### API Down (SEV-1)
**Symptoms**: 5xx errors, health check failing
**Checks**:
1. `docker compose ps` - containers running?
2. `docker compose logs api` - OOM? Panic? Migration stuck?
3. Database connections: `SELECT * FROM pg_stat_activity`
4. Redis: `INFO memory`, `CLIENT LIST`

**Fixes**:
- Restart containers: `docker compose restart api`
- Scale up: `docker compose up -d --scale api=3`
- Kill stuck migrations: `pg_terminate_backend(pid)`
- Clear Redis: `FLUSHDB` (careful!)

### Slow Approvals (SEV-2)
**Symptoms**: p95 >5s, residents complain
**Checks**:
1. Grafana: API latency, Socket.IO events, FCM delivery
2. Database: `EXPLAIN ANALYZE` on visit queries
3. Queue depth: BullMQ dashboard
4. Network: `ping` between services

**Fixes**:
- Add missing index: `CREATE INDEX CONCURRENTLY...`
- Increase API replicas
- Clear stuck BullMQ jobs
- Optimize Socket.IO room broadcasting

### Guard App Crashes (SEV-2)
**Symptoms**: Crash reports in Sentry/Play Console
**Checks**:
1. Sentry: stack trace, device info, OS version
2. Reproduce on same device model
3. Check Drift migrations, Drift version

**Fixes**:
- Hotfix release to Play Console internal track
- Rollback to previous version if critical
- Workaround: clear app data, re-login

### Payment Failures (SEV-1)
**Symptoms**: Payment webhook failures, reconciliation mismatch
**Checks**:
1. Payment provider dashboard (Razorpay/Cashfree)
2. Webhook logs: `SELECT * FROM audit_logs WHERE action LIKE 'PAYMENT_%'`
2. Invoice statuses: `SELECT * FROM invoices WHERE status IN ('PENDING','OVERDUE')`

**Fixes**:
- Retry failed webhooks: `POST /v1/billing/webhook/retry`
- Manual reconciliation: update invoice/payment status
- Contact provider support if systemic

### Data Breach Suspected (SEV-1)
**Immediate**:
1. Revoke all API keys, JWT secrets
2. Rotate database passwords
3. Enable audit log retention: `UPDATE audit_logs SET retention = '7y'`
4. Notify legal/compliance
5. Prepare user notification template

## Communication Templates

### Initial Status (Slack/Statuspage)
```
🔴 INCIDENT: <title>
Severity: SEV-<1-4>
Started: <timestamp>
Impact: <what's broken>
Status: Investigating
Next update: <timestamp + 15 min>
```

### Update
```
🟡 UPDATE: <title>
Status: <Investigating/Identified/Monitoring/Resolved>
Root cause: <if known>
Mitigation: <what we're doing>
ETA: <if known>
```

### Resolution
```
🟢 RESOLVED: <title>
Duration: <X min/hours>
Root cause: <summary>
Fix: <what was deployed>
Action items: <links to tickets>
Postmortem: <link>
```

## Postmortem Template

```
# Postmortem: <Incident Title>
**Date**: <YYYY-MM-DD>
**Duration**: <X min/hours>
**Severity**: SEV-<1-4>
**Author**: <name>

## Summary
<2-3 sentences describing what happened and impact>

## Timeline
- <timestamp> - Detection
- <timestamp> - Triage
- <timestamp> - Root cause identified
- <timestamp> - Fix deployed
- <timestamp> - Verified resolved

## Root Cause
<Detailed technical explanation>

## Impact
- Users affected: <number>
- Features impacted: <list>
- Data loss: <yes/no, details>

## What Went Well
- <item 1>
- <item 2>

## What Went Wrong
- <item 1>
- <item 2>

## Action Items
| Item | Owner | Due Date | Ticket |
|------|-------|----------|--------|
| <action> | @person | YYYY-MM-DD | #123 |

## Prevention
<Architectural/process changes to prevent recurrence>
```

## Escalation Contacts

| Role | Name | Phone | Slack |
|------|------|-------|-------|
| Primary On-Call | | | @ |
| Secondary On-Call | | | @ |
| Engineering Lead | | | @ |
| Product Lead | | | @ |
| Legal/Compliance | | | @ |

## Runbook Maintenance
- Review quarterly
- Update after each SEV-1/2
- Test procedures in staging monthly
- On-call shadow rotations for new team members