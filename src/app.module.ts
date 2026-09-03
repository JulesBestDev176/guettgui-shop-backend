import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { configuration } from "./config/configuration";
import { DatabaseModule } from "./database/database.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { CatalogModule } from "./modules/catalog/catalog.module";
import { SellersModule } from "./modules/sellers/sellers.module";
import { OrdersModule } from "./modules/orders/orders.module";
import { PaymentsModule } from "./modules/payments/payments.module";
import { DeliveryModule } from "./modules/delivery/delivery.module";
import { ReviewsModule } from "./modules/reviews/reviews.module";
import { SupportModule } from "./modules/support/support.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { FilesModule } from "./modules/files/files.module";
import { AdminModule } from "./modules/admin/admin.module";
import { FavoritesModule } from "./modules/favorites/favorites.module";
import { SubscriptionsModule } from "./modules/subscriptions/subscriptions.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    JwtModule.register({ global: true }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    CatalogModule,
    SellersModule,
    OrdersModule,
    PaymentsModule,
    DeliveryModule,
    ReviewsModule,
    SupportModule,
    NotificationsModule,
    FilesModule,
    AdminModule,
    FavoritesModule,
    SubscriptionsModule,
  ],
})
export class AppModule {}
