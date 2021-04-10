import { Module } from '@nestjs/common';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { ItemProvider } from './item.provider';
import { BullModule } from '@nestjs/bull';
import { ItemProcessor } from './queue/item.processor';
import { configService } from 'src/common/config/config.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'items',
      redis: configService.getRedisUrl(),
    }),
  ],
  providers: [ItemService, ...ItemProvider, ItemProcessor],
  controllers: [ItemController],
  exports: [ItemService]
})
export class ItemModule {}
