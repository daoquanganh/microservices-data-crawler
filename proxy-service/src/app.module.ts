import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, ClientsModuleAsyncOptions, Transport } from '@nestjs/microservices';
import { RabbitMqService } from './services/rabbitmq.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    // RabbitMQModule.forRootAsync(RabbitMQModule, {
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     exchanges: [
    //       {
    //         name: 'exchange1',
    //         type: 'topic',
    //       },
    //     ],
    //     uri: [configService.get<string>('AMQP_PROXY_URI')],
    //     connectionInitOptions: { wait: false },
    //     channels: {
    //       'channel-vnexpress': {},
    //       'channel-thanhnien': {},
    //       'channel-dantri': {},
    //     },
    //   }),
    //   inject: [ConfigService],
    // }),
    ClientsModule.registerAsync([
      {
        name: 'VNEXPRESS_SERVICE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            queue: configService.get<string>('RABBITMQ_VNEXPRESS_QUEUE'),
            urls: [configService.get<string>('AMQP_PROXY_URI')],
            queueOptions: { durable: false },
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'THANHNIEN_SERVICE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            queue: configService.get<string>('RABBITMQ_THANHNIEN_QUEUE'),
            urls: [configService.get<string>('AMQP_PROXY_URI')],
            queueOptions: { durable: false },
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'DANTRI_SERVICE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            queue: configService.get<string>('RABBITMQ_DANTRI_QUEUE'),
            urls: [configService.get<string>('AMQP_PROXY_URI')],
            queueOptions: { durable: false },
          },
        }),
        inject: [ConfigService],
      }
    ])
  ],
  controllers: [AppController],
  providers: [AppService, RabbitMqService],
})
export class AppModule {}
