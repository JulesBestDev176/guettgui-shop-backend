import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:guettgui_mobile/core/sync/sync_engine.dart';
import 'package:guettgui_mobile/features/flocks/domain/entities/flock.dart';
import 'package:guettgui_mobile/features/daily_records/domain/entities/daily_record.dart';
import 'package:guettgui_mobile/features/finances/domain/entities/sale.dart';
import 'package:guettgui_mobile/features/finances/domain/entities/expense.dart';
import 'package:guettgui_mobile/features/stocks/domain/entities/stock.dart';
import 'package:guettgui_mobile/features/customers/domain/entities/customer.dart';

import 'app_database.dart';

// ============================================================
// LOCAL PROVIDERS — read from Drift (SQLite)
//
// These are "local" alternatives to the existing remote providers.
// They provide streams that automatically update when data changes.
// DO NOT modify existing screens — these are for future migration.
// ============================================================

// --- Flocks ---

/// Watch active flocks from local database
final localFlockListProvider =
    StreamProvider.family<List<Flock>, String>((ref, teamId) {
  final db = ref.watch(appDatabaseProvider);
  return db.flocksDao.watchActiveFlocks(teamId).map(
    (rows) => rows
        .map((row) => Flock(
              id: row.id,
              name: row.name,
              type: row.type,
              breed: row.breed,
              startDate: row.startDate,
              endDate: row.endDate,
              initialFemales: row.initialFemales,
              initialMales: row.initialMales,
              initialTotal: row.initialTotal,
              currentTotal: row.currentTotal,
              status: row.status,
              teamId: row.teamId,
              createdAt: row.localCreatedAt,
            ))
        .toList(),
  );
});

/// Watch all flocks (any status) from local database
final localAllFlocksProvider =
    StreamProvider.family<List<Flock>, String>((ref, teamId) {
  final db = ref.watch(appDatabaseProvider);
  return db.flocksDao.watchAllFlocks(teamId).map(
    (rows) => rows
        .map((row) => Flock(
              id: row.id,
              name: row.name,
              type: row.type,
              breed: row.breed,
              startDate: row.startDate,
              endDate: row.endDate,
              initialFemales: row.initialFemales,
              initialMales: row.initialMales,
              initialTotal: row.initialTotal,
              currentTotal: row.currentTotal,
              status: row.status,
              teamId: row.teamId,
              createdAt: row.localCreatedAt,
            ))
        .toList(),
  );
});

// --- Daily Records ---

/// Watch daily records for a flock from local database
final localDailyRecordsProvider =
    StreamProvider.family<List<DailyRecord>, String>((ref, flockId) {
  final db = ref.watch(appDatabaseProvider);
  return db.dailyRecordsDao.watchByFlock(flockId).map(
    (rows) => rows
        .map((row) => DailyRecord(
              id: row.id,
              flockId: row.flockId,
              date: row.date,
              eggsLaid: row.eggsLaid,
              eggsCollected: row.eggsCollected,
              eggsBroken: row.eggsBroken,
              mortalityCount: row.mortalityCount,
              mortalityCause: row.mortalityCause,
              feedConsumedKg: row.feedConsumedKg,
              waterConsumedL: row.waterConsumedL,
              averageWeightG: row.avgWeightKg,
              notes: row.notes,
              photoUrl: row.photoUrl,
              recordedById: row.recordedById,
              createdAt: row.localCreatedAt,
            ))
        .toList(),
  );
});

// --- Sales ---

/// Watch sales for a team from local database
final localSalesProvider =
    StreamProvider.family<List<Sale>, String>((ref, teamId) {
  final db = ref.watch(appDatabaseProvider);
  return db.salesDao.watchByTeam(teamId).map(
    (rows) => rows
        .map((row) => Sale(
              id: row.id,
              productType: row.productType,
              quantity: row.quantity,
              unitPrice: row.unitPrice,
              totalAmount: row.totalAmount,
              paidAmount: row.amountPaid,
              paymentStatus: row.paymentStatus,
              customerId: row.customerId,
              date: row.date,
              notes: row.notes,
              teamId: row.teamId,
              recordedById: row.recordedById,
              createdAt: row.localCreatedAt,
            ))
        .toList(),
  );
});

// --- Expenses ---

/// Watch expenses for a team from local database
final localExpensesProvider =
    StreamProvider.family<List<Expense>, String>((ref, teamId) {
  final db = ref.watch(appDatabaseProvider);
  return db.expensesDao.watchByTeam(teamId).map(
    (rows) => rows
        .map((row) => Expense(
              id: row.id,
              category: row.category,
              amount: row.amount,
              description: row.description,
              date: row.date,
              receiptUrl: row.photoUrl,
              flockId: row.flockId,
              teamId: row.teamId,
              recordedById: row.recordedById,
              createdAt: row.localCreatedAt,
            ))
        .toList(),
  );
});

// --- Stocks ---

/// Watch stocks for a team from local database
final localStocksProvider =
    StreamProvider.family<List<Stock>, String>((ref, teamId) {
  final db = ref.watch(appDatabaseProvider);
  return db.stocksDao.watchByTeam(teamId).map(
    (rows) => rows
        .map((row) => Stock(
              id: row.id,
              itemType: row.type,
              itemName: row.name,
              quantity: row.currentQty,
              unit: row.unit,
              minThreshold: row.alertThreshold,
              teamId: row.teamId,
              updatedAt: row.localUpdatedAt,
            ))
        .toList(),
  );
});

// --- Customers ---

/// Watch customers for a team from local database
final localCustomersProvider =
    StreamProvider.family<List<Customer>, String>((ref, teamId) {
  final db = ref.watch(appDatabaseProvider);
  return db.customersDao.watchByTeam(teamId).map(
    (rows) => rows
        .map((row) => Customer(
              id: row.id,
              firstName: row.firstName,
              lastName: row.lastName,
              phone: row.phone,
              address: row.city != null
                  ? '${row.city}${row.district != null ? ', ${row.district}' : ''}'
                  : null,
              notes: row.notes,
              teamId: row.teamId,
              createdAt: row.localCreatedAt,
            ))
        .toList(),
  );
});
