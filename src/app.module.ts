import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { DatabaseModule } from './common/database/database.module';
import { ItemModule } from './modules/item/item.module';
import { AllExceptionsFilter } from './common/exception/http-exception.filter';
import { CronModule } from './crons/cron.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CronModule,
    DatabaseModule,
    ItemModule,
  ],
  providers: [AllExceptionsFilter],
  controllers: [AppController]
})
export class AppModule {}
