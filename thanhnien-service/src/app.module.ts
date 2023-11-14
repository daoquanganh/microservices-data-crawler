import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    ClientsModule.registerAsync([{
      name: 'CRAWL_SERVICE',
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: Transport.RMQ,
        options: {
          queue: configService.get<string>('RMQ_MAIN_QUEUE'),
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
