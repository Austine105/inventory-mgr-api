import { ApiHideProperty, ApiTags } from '@nestjs/swagger';
import { IsOptional, IsPositive } from 'class-validator';

@ApiTags('New Item')
export class NewItemDto {

  @IsPositive()
  quantity: number

  @IsPositive()
  expiry : number

  @ApiHideProperty()
  @IsOptional()
  @IsPositive()
  item: string

  @ApiHideProperty()
  @IsOptional()
  @IsPositive()
  validTill : string
}
