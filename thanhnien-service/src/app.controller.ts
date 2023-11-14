import { Controller, Get, Inject, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { Cron, CronExpression } from '@nestjs/schedule';
@Controller()
export class AppController {
  constructor(@Inject('CRAWL_SERVICE') private readonly client: ClientProxy,
    private readonly appService: AppService
    ) {}

  @Cron(CronExpression.EVERY_5_HOURS)
  async sendData() {
    const data = await this.appService.crawl()
    this.client.emit('crawlData', data)
    return data
  }

  @MessagePattern('thanhnien')
  async getData() {
    const data = await this.appService.crawl()
    return data
  }
}
