import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DataDto } from './dtos/data.dto';

@Controller()
export class AppController {
  constructor(@Inject('CRAWL_SERVICE') private readonly client: ClientProxy,
  private readonly appService: AppService
  ) {}

@Cron(CronExpression.EVERY_5_HOURS)
async sendData(): Promise<DataDto[]> {
  const data = await this.appService.crawl()
  this.client.emit('crawlData', data)
  return data
}

@MessagePattern('dantri')
async getData(): Promise<DataDto[]> {
  const data = await this.appService.crawl()
  return data
}
}
