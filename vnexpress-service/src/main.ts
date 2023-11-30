import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClientProxy, MicroserviceOptions, RpcException, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common';
import { ExceptionFilter } from 'filters/rpc-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new ExceptionFilter())
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist:true, 
    forbidNonWhitelisted:true,
    forbidUnknownValues:true,
    disableErrorMessages:true,
    exceptionFactory: (error) => {
      return new RpcException(error)
    }
  }),
)

  const configService = app.get<ConfigService>(ConfigService)
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
        urls: [configService.get<string>('AMQP_PROXY_URI')],
        queue: configService.get<string>('VNEXPRESS_QUEUE'),
        queueOptions: {
          durable: false,
          arguments: {
            'x-message-ttl': 5000,
          },
        },
      }
      },{ inheritAppConfig: true});
  app.startAllMicroservices()
  app.init()
}
bootstrap();
