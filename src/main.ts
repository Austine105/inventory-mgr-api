import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerOptions } from './common/config/swagger.config';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/exception/http-exception.filter';
import { configService } from './common/config/config.service';

const port = configService.getPort();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'debug', 'verbose'],
  });
  app.useGlobalFilters(new AllExceptionsFilter());

  // Swagger docs configuration
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
  });
}
bootstrap();
