import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { MenuModule } from './menu/menu.module';
import { ReservationsModule } from './reservations/reservations.module';
import { ContactModule } from './contact/contact.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    MenuModule,
    ReservationsModule,
    ContactModule,
    OrdersModule,
  ],
})
export class AppModule {}
