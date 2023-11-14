import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService)
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
        urls: [configService.get<string>('AMQP_URI')],
        queue: configService.get<string>('RMQ_QUEUE'),
        queueOptions: {
        durable: false
        }}
      });
  app.startAllMicroservices()


}
bootstrap();
