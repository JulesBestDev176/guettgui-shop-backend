import 'dart:io';

import 'package:drift/drift.dart';
import 'package:drift/native.dart';
import 'package:path/path.dart' as p;
import 'package:path_provider/path_provider.dart';

import 'tables/users_table.dart';
import 'tables/teams_table.dart';
import 'tables/team_members_table.dart';
import 'tables/flocks_table.dart';
import 'tables/daily_records_table.dart';
import 'tables/incubation_batches_table.dart';
import 'tables/incubators_table.dart';
import 'tables/expenses_table.dart';
import 'tables/sales_table.dart';
import 'tables/sale_payments_table.dart';
import 'tables/customers_table.dart';
import 'tables/orders_table.dart';
import 'tables/stocks_table.dart';
import 'tables/stock_moves_table.dart';
import 'tables/alerts_table.dart';
import 'tables/vaccinations_table.dart';
import 'tables/vaccination_protocols_table.dart';
import 'tables/sync_queue_table.dart';

import 'daos/flocks_dao.dart';
import 'daos/daily_records_dao.dart';
import 'daos/sales_dao.dart';
import 'daos/expenses_dao.dart';
import 'daos/stocks_dao.dart';
import 'daos/customers_dao.dart';
import 'daos/sync_queue_dao.dart';

part 'app_database.g.dart';

@DriftDatabase(
  tables: [
    Users,
    Teams,
    TeamMembers,
    Flocks,
    DailyRecords,
    IncubationBatches,
    Incubators,
    Expenses,
    Sales,
    SalePayments,
    Customers,
    Orders,
    Stocks,
    StockMoves,
    Alerts,
    Vaccinations,
    VaccinationProtocols,
    SyncQueue,
  ],
  daos: [
    FlocksDao,
    DailyRecordsDao,
    SalesDao,
    ExpensesDao,
    StocksDao,
    CustomersDao,
    SyncQueueDao,
  ],
)
class AppDatabase extends _$AppDatabase {
  AppDatabase() : super(_openConnection());

  AppDatabase.forTesting(super.e);

  @override
  int get schemaVersion => 1;

  @override
  MigrationStrategy get migration {
    return MigrationStrategy(
      onCreate: (Migrator m) async {
        await m.createAll();
      },
      onUpgrade: (Migrator m, int from, int to) async {
        // Future migrations will go here
      },
    );
  }
}

LazyDatabase _openConnection() {
  return LazyDatabase(() async {
    final dbFolder = await getApplicationDocumentsDirectory();
    final file = File(p.join(dbFolder.path, 'guettgui.sqlite'));
    return NativeDatabase.createInBackground(file);
  });
}
