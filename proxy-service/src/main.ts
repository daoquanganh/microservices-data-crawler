import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  app.enableCors()
  // app.useGlobalFilters(new RpcExceptionToHttpExceptionFilter())
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist:true, 
    forbidNonWhitelisted:true,
    forbidUnknownValues:true,
    disableErrorMessages:true,
    }
  ))
  const configService = app.get<ConfigService>(ConfigService)
  await app.listen(configService.get<number>('PORT'));
}
bootstrap();
