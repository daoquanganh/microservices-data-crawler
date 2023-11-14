import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    ClientsModule.registerAsync([{
      name: 'READ_SERVICE',
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: Transport.RMQ,
        options: {
          queue: configService.get<string>('RMQ_QUEUE'),
          urls: [configService.get<string>('AMQP_URI')],
          queueOptions: { durable: false },
        },
      }),
      inject: [ConfigService],
    }]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
