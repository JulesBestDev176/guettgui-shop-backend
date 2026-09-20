import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { GeoModule } from './modules/geo/geo.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ShopsModule } from './modules/shops/shops.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { SettingsModule } from './modules/settings/settings.module';
import { PlansModule } from './modules/plans/plans.module';
import { CmsModule } from './modules/cms/cms.module';
import { SupportModule } from './modules/support/support.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { UploadModule } from './modules/upload/upload.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    PrismaModule,
    AuthModule,
    GeoModule,
    CategoriesModule,
    ShopsModule,
    ProductsModule,
    OrdersModule,
    ReviewsModule,
    FavoritesModule,
    SettingsModule,
    PlansModule,
    CmsModule,
    SupportModule,
    NotificationsModule,
    UploadModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
  ],
})
export class AppModule {}
