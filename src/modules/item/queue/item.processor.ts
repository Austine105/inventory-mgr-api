import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ItemService } from '../item.service';

@Processor('items')
export class ItemProcessor {
  constructor(
    private readonly itemService: ItemService
    ) { }

  @Process('new_item')
  async processNewItem(itemJob: Job) {
    await this.itemService.processNewItemJob(itemJob.data);
  }

  @Process('sell_item')
  async processSellItem(itemJob: Job) {
    await this.itemService.processSellItemJob(itemJob.data);
  }
}
