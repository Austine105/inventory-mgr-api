import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ItemService } from 'src/modules/item/item.service';


@Injectable()
export class CronService {

  private static dailyCronSchedule = CronExpression.EVERY_DAY_AT_MIDNIGHT;
  constructor(
    private readonly itemService: ItemService
  ) { }

  // this runs daily at midnight
  @Cron(CronService.dailyCronSchedule)
  async dailyCron() {
    console.log('cron started..');

    await this.itemService.deleteExpiredItems();

    console.log('cron ended..');
  }
}
