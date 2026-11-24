# Runbook: Guard App Offline Mode

## Overview
The Guard app is designed to work offline at society gates where network connectivity is poor or unavailable.

## Offline Capabilities

### What Works Offline
1. **Pre-approval pass verification** - HMAC-signed codes validated locally
2. **Walk-in visitor entry** - Queued locally with outbox pattern
3. **Flat/resident lookup** - Cached in local SQLite (Drift)
4. **Society policies** - Cached (escalation timeout, guard policy)
5. **Photo capture** - Stored locally, synced when online

### What Requires Network
1. **Real-time approval updates** - Requires Socket.IO/FCM
2. **New resident/flat sync** - Periodic background sync
3. **Push notifications** - FCM delivery
4. **SMS/WhatsApp fallback** - Requires connectivity

## Architecture

### Local Storage (Drift/SQLite)
```
Tables:
- flats (flatId, blockId, number, floor)
- residents (userId, flatId, name, maskedPhone)
- passes (code, flatId, validFrom, validTo, usesLeft, visitorName)
- society_policies (escalationTimeout, guardPolicy)
- outbox (idempotencyKey, action, payload, createdAt, retries)
```

### Sync Strategy
1. **Outbox pattern**: All write operations queued with idempotency keys
2. **Exponential backoff**: 1s, 2s, 4s, 8s, 16s, 30s (max)
3. **Conflict resolution**: Server wins for conflicts (last-write-wins with server timestamp)
4. **Deduplication**: Idempotency keys prevent duplicate processing

### Connection State Badge
- **ONLINE** (green): WebSocket connected, FCM active
- **WEAK** (yellow): WebSocket reconnecting, HTTP requests slow (>5s)
- **OFFLINE** (red): No network, using local cache only

## Testing Offline Mode

### Manual Test Procedure
1. Enable airplane mode on test device
2. Verify connection badge shows OFFLINE
3. Scan valid pre-approval QR → should show APPROVED
4. Scan expired QR → should show EXPIRED
5. Create walk-in visitor entry → should queue locally
6. Disable airplane mode → verify sync completes
7. Check server for synced visits

### Automated Test
```bash
# Run offline mode tests
cd apps/mobile
flutter test integration_test/offline_mode_test.dart
```

## Troubleshooting

### Issue: Pass verification fails offline
**Cause**: Pass signing key mismatch or corrupted local cache
**Fix**: 
1. Verify `PASS_SIGNING_KEY` matches server
2. Clear app data and re-sync
3. Check pass payload format hasn't changed

### Issue: Walk-in entries not syncing
**Cause**: Idempotency key conflict or server error
**Fix**:
1. Check outbox table for failed entries
2. Verify server `/v1/visits` endpoint accessible
3. Check for duplicate idempotency keys

### Issue: Local cache stale
**Cause**: Background sync not running
**Fix**:
1. Force sync via pull-to-refresh
2. Check WorkManager/BackgroundFetch permissions
3. Verify `flutter_background_fetch` configured

## Monitoring
- **Sync success rate**: Track via analytics (no PII)
- **Offline duration**: Average time in OFFLINE state per guard per day
- **Queue depth**: Number of pending outbox entries
- **Conflict rate**: Server rejections due to conflicts

## Emergency Procedures

### Complete Network Outage (Hours)
1. Guards continue using app fully offline
2. Pre-approved passes verified via QR/code
3. Walk-in visitors: manual paper log as backup
4. SOS: Physical panic button / landline to police

### Data Loss Prevention
- Local SQLite encrypted with device key
- Automatic backup to internal storage daily
- Export CSV from guard app settings for manual recovery

## Configuration

### Society Settings Affecting Offline Mode
```json
{
  "escalationTimeoutSeconds": 30,
  "guardPolicy": "HOLD",  // ALLOW | DENY | HOLD
  "photoRetentionDays": 90,
  "offlineCacheTTL": 86400
}
```

### Guard App Settings
- **Cache refresh interval**: 6 hours (configurable)
- **Photo quality**: 0.7 JPEG (balance quality/size)
- **Auto-sync on WiFi only**: Default ON
- **Background fetch**: Every 15 min when online