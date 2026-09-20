import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

// Prisma
import { PrismaModule } from './prisma/prisma.module';

// Config
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import s3Config from './config/s3.config';
import firebaseConfig from './config/firebase.config';
import relayioConfig from './config/relayio.config';

// Common
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';

// Shared
import { StorageModule } from './shared/storage/storage.module';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { TeamsModule } from './modules/teams/teams.module';
import { FlocksModule } from './modules/flocks/flocks.module';
import { DailyRecordsModule } from './modules/daily-records/daily-records.module';
import { IncubationModule } from './modules/incubation/incubation.module';
import { FinancesModule } from './modules/finances/finances.module';
import { StocksModule } from './modules/stocks/stocks.module';
import { CustomersModule } from './modules/customers/customers.module';
import { OrdersModule } from './modules/orders/orders.module';
import { AlertsModule } from './modules/alerts/alerts.module';
import { VaccinationModule } from './modules/vaccination/vaccination.module';
import { ReportsModule } from './modules/reports/reports.module';
import { SyncModule } from './modules/sync/sync.module';
import { UploadModule } from './modules/upload/upload.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

// Health Controller
import { HealthController } from './health.controller';

@Module({
  imports: [
    // Configuration globale
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig, s3Config, firebaseConfig, relayioConfig],
      envFilePath: '.env',
    }),

    // Rate limiting global
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),

    // Cron jobs
    ScheduleModule.forRoot(),

    // Prisma (global)
    PrismaModule,

    // Storage (global)
    StorageModule,

    // Feature modules
    AuthModule,
    TeamsModule,
    FlocksModule,
    DailyRecordsModule,
    IncubationModule,
    FinancesModule,
    StocksModule,
    CustomersModule,
    OrdersModule,
    AlertsModule,
    VaccinationModule,
    ReportsModule,
    SyncModule,
    UploadModule,
    NotificationsModule,
  ],
  controllers: [HealthController],
  providers: [
    // Global throttler guard
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // Global exception filter
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    // Global transform interceptor
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    // Global logging interceptor
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    // Global audit interceptor
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule {}
