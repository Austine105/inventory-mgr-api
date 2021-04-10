import { ApiHideProperty, ApiTags } from '@nestjs/swagger';
import { IsOptional, IsPositive } from 'class-validator';

@ApiTags('Sell Item')
export class SellItemDto {

  @IsPositive()
  quantity: number

  @ApiHideProperty()
  @IsOptional()
  @IsPositive()
  item: string

}
