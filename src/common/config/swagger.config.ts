import { DocumentBuilder } from '@nestjs/swagger';
import { configService } from './config.service';

export const swaggerOptions = new DocumentBuilder()
  .setTitle('Transfer Service')
  .setDescription('Transfer Service for funds transactions')
  .setVersion(configService.getAppVersionNo())
  .build();
