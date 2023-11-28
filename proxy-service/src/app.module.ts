import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitMqService } from './services/rabbitmq.service';
// require('dotenv').config()

// const microservicesList = process.env.QUEUES.split(' ')
// let clientOptions: ClientsModuleAsyncOptions = []
// for (const microservice of microservicesList) {
//   clientOptions.push({
//     name: `${microservice}_SERVICE`,
//     imports: [ConfigModule],
//     useFactory: async (configService: ConfigService) => ({
//       transport: Transport.RMQ,
//       options: {
//         queue: configService.get<string>(`RABBITMQ_${microservice}_QUEUE`),
//         urls: [configService.get<string>('AMQP_PROXY_URI')],
//         queueOptions: { durable: false },
//       },
//     }),
//     inject: [ConfigService],
//   })
// }

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    // ClientsModule.registerAsync(clientOptions)
  ],
  controllers: [AppController],
  providers: [AppService, RabbitMqService],
})
export class AppModule {}
