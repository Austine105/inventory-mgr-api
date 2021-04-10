import { Body, Controller, Get, Param, Post, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ItemService } from './item.service';
import { SellItemDto } from './dto/sell-item.dto';
import { NewItemDto } from './dto/new-item.dto';

@ApiTags('Items')
@Controller()
export class ItemController {
  constructor(private readonly itemService: ItemService) { }

  @Post(':item/add')
  async createItem(
    @Param('item') item: string,
    @Body(new ValidationPipe({ transform: true })) newItem: NewItemDto
  ) {
    newItem.item = item;
    return this.itemService.create(newItem);
  }

  @Post(':item/sell')
  async sellItem(
    @Param('item') item: string,
    @Body(new ValidationPipe({ transform: true })) sellItem: SellItemDto
  ) {
    sellItem.item = item;
    return this.itemService.sell(sellItem);
  }

  @Get('/:item/quantity')
  async getItemQuantity(
    @Param('item') item: string
  ) {
    return this.itemService.getItemQuantity(item);
  }
}
