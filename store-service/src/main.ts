import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { CustomExceptionFilter } from './filters/rpc-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new CustomExceptionFilter())
  const configService = app.get<ConfigService>(ConfigService)
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('AMQP_URI')],
      queue: configService.get<string>('RMQ_QUEUE'),
      queueOptions: {
      durable: false,
      }
    },
  },{inheritAppConfig: true},
  );
  useContainer(app.select(AppModule), { fallbackOnErrors:true})

  app.startAllMicroservices()
  app.init()

}
bootstrap();
