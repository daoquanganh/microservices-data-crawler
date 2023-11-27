import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClientProxy, MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe())
  const configService = app.get<ConfigService>(ConfigService)
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('AMQP_PROXY_URI')],
      queue: configService.get<string>('RMQ_QUEUE'),
      queueOptions: {
        durable: false,
      }
    }
  });
  app.startAllMicroservices()
  app.init()
}
bootstrap();
