import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, RpcException, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
    disableErrorMessages: true,
    validateCustomDecorators: true,
    exceptionFactory: (errors) => {
      return new RpcException(errors);
    }
  }))

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

  useContainer(app.select(AppModule), { fallbackOnErrors: true })

  app.startAllMicroservices()
  app.listen(3001)


}
bootstrap();
