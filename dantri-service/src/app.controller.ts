import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ArticleDto } from './dtos/data.dto';

@Controller()
export class AppController {
  constructor(@Inject('CRAWL_SERVICE') private readonly client: ClientProxy,
  private readonly appService: AppService
  ) {}

  //endpoint for crawling and sending articles with schedule
  @Cron(CronExpression.EVERY_MINUTE)
  async sendData(): Promise<ArticleDto[]> {
    const data = await this.appService.crawl()
    this.client.emit('crawlData', {data})
    return data
  }

  //endpoint for receiving message and return data to proxy
  @MessagePattern('dantri')
  async getData(): Promise<ArticleDto[]> {
    const data = await this.appService.crawl()
    return data
  }
}
