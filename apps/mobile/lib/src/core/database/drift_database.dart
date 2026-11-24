import 'package:drift/drift.dart';
import 'package:drift/native.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as p;
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'dart:io';

part 'drift_database.g.dart';

@riverpod
AppDatabase appDatabase(AppDatabaseRef ref) {
  return AppDatabase();
}

@DataClassName('Flat')
class Flats extends Table {
  IntColumn get id => integer().autoIncrement()();
  TextColumn get flatId => text()();
  TextColumn get societyId => text()();
  TextColumn get blockId => text()();
  TextColumn get number => text()();
  IntColumn get floor => integer()();
  DateTimeColumn get createdAt => dateTime().withDefault(currentDateAndTime)();
  DateTimeColumn get updatedAt => dateTime().withDefault(currentDateAndTime)();
}

@DataClassName('Resident')
class Residents extends Table {
  IntColumn get id => integer().autoIncrement()();
  TextColumn get userId => text()();
  TextColumn get flatId => text()();
  TextColumn get name => text()();
  TextColumn get phone => text()();
  TextColumn get role => text()();
  BoolColumn get isOwner => boolean().withDefault(const Constant(false))();
  TextColumn get status => text().withDefault(const Constant('ACTIVE'))();
  DateTimeColumn get createdAt => dateTime().withDefault(currentDateAndTime)();
  DateTimeColumn get updatedAt => dateTime().withDefault(currentDateAndTime)();
}

@DataClassName('Pass')
class Passes extends Table {
  IntColumn get id => integer().autoIncrement()();
  TextColumn get passId => text()();
  TextColumn get societyId => text()();
  TextColumn get flatId => text()();
  TextColumn get visitorName => text()();
  TextColumn get visitorPhone => text().nullable()();
  TextColumn get code => text()();
  DateTimeColumn get validFrom => dateTime()();
  DateTimeColumn get validTo => dateTime()();
  IntColumn get usesLeft => integer()();
  BoolColumn get isActive => boolean().withDefault(const Constant(true))();
  DateTimeColumn get createdAt => dateTime().withDefault(currentDateAndTime)();
  DateTimeColumn get updatedAt => dateTime().withDefault(currentDateAndTime)();
}

@DataClassName('Visit')
class Visits extends Table {
  IntColumn get id => integer().autoIncrement()();
  TextColumn get visitId => text()();
  TextColumn get societyId => text()();
  TextColumn get flatId => text()();
  TextColumn get visitorName => text()();
  TextColumn get visitorPhone => text().nullable()();
  TextColumn get visitorPhoto => text().nullable()();
  TextColumn get purpose => text().nullable()();
  TextColumn get status => text()();
  DateTimeColumn get createdAt => dateTime().withDefault(currentDateAndTime)();
  DateTimeColumn get updatedAt => dateTime().withDefault(currentDateAndTime)();
  DateTimeColumn get inAt => dateTime().nullable()();
  DateTimeColumn get outAt => dateTime().nullable()();
}

@DataClassName('Notice')
class Notices extends Table {
  IntColumn get id => integer().autoIncrement()();
  TextColumn get noticeId => text()();
  TextColumn get societyId => text()();
  TextColumn get title => text()();
  TextColumn get body => text()();
  BoolColumn get pinned => boolean().withDefault(const Constant(false))();
  BoolColumn get read => boolean().withDefault(const Constant(false))();
  DateTimeColumn get publishedAt => dateTime().nullable()();
  DateTimeColumn get createdAt => dateTime().withDefault(currentDateAndTime)();
  DateTimeColumn get updatedAt => dateTime().withDefault(currentDateAndTime)();
}

@DataClassName('Ticket')
class Tickets extends Table {
  IntColumn get id => integer().autoIncrement()();
  TextColumn get ticketId => text()();
  TextColumn get societyId => text()();
  TextColumn get flatId => text()();
  TextColumn get title => text()();
  TextColumn get description => text()();
  TextColumn get category => text()();
  TextColumn get status => text()();
  TextColumn get priority => text()();
  DateTimeColumn get createdAt => dateTime().withDefault(currentDateAndTime)();
  DateTimeColumn get updatedAt => dateTime().withDefault(currentDateAndTime)();
  DateTimeColumn get resolvedAt => dateTime().nullable()();
}

@DataClassName('OutboxAction')
class OutboxActions extends Table {
  IntColumn get id => integer().autoIncrement()();
  TextColumn get actionId => text()();
  TextColumn get type => text()(); // create_visit, approve_visit, etc.
  TextColumn get payload => text()(); // JSON
  IntColumn get retries => integer().withDefault(const Constant(0))();
  DateTimeColumn get createdAt => dateTime().withDefault(currentDateAndTime)();
  DateTimeColumn get lastAttemptAt => dateTime().nullable()();
  TextColumn get status => text().withDefault(const Constant('pending'))(); // pending, synced, failed
}

@DriftDatabase(tables: [
  Flats,
  Residents,
  Passes,
  Visits,
  Notices,
  Tickets,
  OutboxActions,
])
class AppDatabase extends _$AppDatabase {
  AppDatabase() : super(_openConnection());
  
  @override
  int get schemaVersion => 1;
  
  @override
  MigrationStrategy get migration => MigrationStrategy(
    onCreate: (Migrator m) async {
      await m.createAll();
    },
    onUpgrade: (Migrator m, int from, int to) async {
      // Handle migrations
    },
  );
  
  // Flats
  Future<List<Flat>> getFlatsBySociety(String societyId) {
    return (select(flats)..where((f) => f.societyId.equals(societyId))).get();
  }
  
  Future<Flat?> getFlatById(String flatId) {
    return (select(flats)..where((f) => f.flatId.equals(flatId))).getSingleOrNull();
  }
  
  Future<void> cacheFlats(List<FlatsCompanion> flats) {
    return batch((batch) {
      batch.insertAllOnConflictUpdate(this.flats, flats);
    });
  }
  
  // Residents
  Future<List<Resident>> getResidentsByFlat(String flatId) {
    return (select(residents)..where((r) => r.flatId.equals(flatId))).get();
  }
  
  Future<void> cacheResidents(List<ResidentsCompanion> residents) {
    return batch((batch) {
      batch.insertAllOnConflictUpdate(this.residents, residents);
    });
  }
  
  // Passes
  Future<List<Pass>> getActivePassesByFlat(String flatId) {
    final now = DateTime.now();
    return (select(passes)
          ..where((p) => p.flatId.equals(flatId) & p.isActive.equals(true) & p.validTo.isBiggerOrEqualValue(now)))
        .get();
  }
  
  Future<void> cachePasses(List<PassesCompanion> passes) {
    return batch((batch) {
      batch.insertAllOnConflictUpdate(this.passes, passes);
    });
  }
  
  Future<Pass?> verifyPassOffline(String code) {
    final now = DateTime.now();
    return (select(passes)
          ..where((p) => p.code.equals(code) & p.isActive.equals(true) & p.validTo.isBiggerOrEqualValue(now) & p.validFrom.isSmallerOrEqualValue(now) & p.usesLeft.isBiggerThanValue(0)))
        .getSingleOrNull();
  }
  
  // Visits
  Future<void> cacheVisits(List<VisitsCompanion> visits) {
    return batch((batch) {
      batch.insertAllOnConflictUpdate(this.visits, visits);
    });
  }
  
  Future<List<Visit>> getVisitsByFlat(String flatId, {int limit = 50}) {
    return (select(visits)
          ..where((v) => v.flatId.equals(flatId))
          ..orderBy([(v) => OrderingTerm.desc(v.createdAt)])
          ..limit(limit))
        .get();
  }
  
  Future<void> addOutboxAction(OutboxActionsCompanion action) {
    return into(outboxActions).insert(action);
  }
  
  Future<List<OutboxAction>> getPendingOutboxActions() {
    return (select(outboxActions)
          ..where((o) => o.status.equals('pending'))
          ..orderBy([(o) => OrderingTerm.asc(o.createdAt)]))
        .get();
  }
  
  Future<void> markOutboxActionSynced(int id) {
    return (update(outboxActions)..where((o) => o.id.equals(id))).write(OutboxActionsCompanion(
      status: const Value('synced'),
      lastAttemptAt: Value(DateTime.now()),
    ));
  }
  
  Future<void> incrementOutboxRetry(int id) {
    return (update(outboxActions)..where((o) => o.id.equals(id))).write(OutboxActionsCompanion(
      retries: outboxActions.retries + const Constant(1),
      lastAttemptAt: Value(DateTime.now()),
    ));
  }
}

LazyDatabase _openConnection() {
  return LazyDatabase(() async {
    final dir = await getApplicationDocumentsDirectory();
    final file = File(p.join(dir.path, 'gatelite.db'));
    return NativeDatabase.createInBackground(file);
  });
}