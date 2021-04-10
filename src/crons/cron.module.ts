import { Module } from '@nestjs/common';
import { ItemModule } from 'src/modules/item/item.module';
import { CronService } from './crons';

@Module({
  imports: [ItemModule],
  providers: [
    CronService,
  ]
})
export class CronModule {}
