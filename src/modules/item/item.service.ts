import { Inject, Injectable } from '@nestjs/common';
import { QueryTypes } from 'sequelize';
import { NewItemDto } from './dto/new-item.dto';
import { SellItemDto } from './dto/sell-item.dto';
import { ItemModel as Item } from './item.model';
import { ITEM_REPOSITORY } from './constants';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class ItemService {
  constructor(
    @Inject(ITEM_REPOSITORY) private readonly itemRepo: typeof Item,
    @InjectQueue('items') private readonly itemQueue: Queue,
  ) { }


  async create(newItem: NewItemDto): Promise<any> {
    newItem.validTill = newItem.expiry.toString();

    // send item to job queue;
    this.itemQueue.add('new_item', newItem);
    return {};
  }

  async sell(sellItem: SellItemDto): Promise<any> {

    // send item to job queue;
    this.itemQueue.add('sell_item', sellItem);
    return {};
  }

  async getItemQuantity(item: string): Promise<any> {

    const sumQuery = `SELECT sum("quantity") AS "sum" FROM "items" AS "ItemModel"
                      WHERE "ItemModel"."item" = '${item}' AND cast("ItemModel"."validTill" as int8) > ${Date.now()}`;

    const validTillQuery = `SELECT "validTill" FROM "items" AS "ItemModel"
                            WHERE "ItemModel"."item" = '${item}' AND cast ("ItemModel"."validTill" as int8) > ${Date.now()}
                            ORDER BY "ItemModel"."validTill" DESC LIMIT 1`;

    let sum: any = await this.itemRepo.sequelize.query(sumQuery, { type: QueryTypes.SELECT });
    sum = sum[0].sum || null;

    if (sum == 0 || sum == null) {
      return {
        quantity: 0,
        validTill: null
      };
    }

    let validTill: any = await this.itemRepo.sequelize.query(validTillQuery, { type: QueryTypes.SELECT });

    return {
      quantity: sum,
      validTill: validTill[0].validTill
    };
  }


  // this is used for JOB processing and shouldn't be called by controller
  async processNewItemJob(newItem: NewItemDto): Promise<Boolean> {

    const exisitingItem = await this.itemRepo.findOne({
      where: {
        item: newItem.item,
        validTill: newItem.validTill
      }
    });

    if (exisitingItem) {
      exisitingItem.quantity += newItem.quantity;
      await exisitingItem.save();
      return true;
    }
    await this.itemRepo.create(newItem);

    return true;
  }

  async processSellItemJob(sellItem: SellItemDto): Promise<Boolean> {
    let sellQuantity = sellItem.quantity;

    const query = `SELECT id, quantity, "validTill" FROM items
                   WHERE item = '${sellItem.item}' AND cast ("validTill" as int8) > ${Date.now()}
                   GROUP BY(id) HAVING SUM(quantity) >= ${sellQuantity} ORDER BY cast ("validTill" as int8) DESC`;

    let items: any = await this.itemRepo.sequelize.query(query, { type: QueryTypes.SELECT });

    // sellQuantity exceeds valid quantity
    if (items.length == 0)
      return true;

    for (let i = 0; i < items.length; i++) {
      const { id, quantity } = items[i];

      if (quantity < sellQuantity) {
        sellQuantity -= quantity;
        await this.itemRepo.destroy({ where: { id } });
        continue;
      }
      else if (quantity == sellQuantity) {
        await this.itemRepo.destroy({ where: { id } });
        break;  // quantity is sold, exit loop
      }
      else if (quantity > sellQuantity) {
        await this.itemRepo.update({
          quantity: quantity - sellQuantity
        }, {
          where: { id }
        });
        break;  // quantity is sold, exit loop
      }
    }

    return true;
  }


  // this is used by the cron-job to periodically clear the database to remove expired items
  // this function is called everyday at midnight
  async deleteExpiredItems(): Promise<Boolean> {

    const deleteQuery = `DELETE from items WHERE cast ("validTill" as int8) < ${Date.now()}`;
    await this.itemRepo.sequelize.query(deleteQuery, { type: QueryTypes.SELECT });

    return true;
  }


  // this is used by the test suite to clear records after tests
  async clearDbRecords() {
    await this.itemRepo.destroy({});
    console.log('records cleared');
  }
}
