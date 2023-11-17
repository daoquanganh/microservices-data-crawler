import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, RpcException, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
    disableErrorMessages: true,
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
        durable: false
        }}
      }, {inheritAppConfig: true});
  app.startAllMicroservices()
  app.init()
  // const app = await NestFactory.create(AppModule)
  // app.connectMicroservice({
  //   transport: Transport.TCP,
  //   options: {
  //     port: 3001
  //   }
  // })
  // await app.startAllMicroservices()
  // await app.listen(3001);
  
}
bootstrap();
