import { Controller, Get, Inject, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ArticleDto } from './dtos/data.dto';
@Controller()
export class AppController {
  constructor(@Inject('CRAWL_SERVICE') private readonly client: ClientProxy,
    private readonly appService: AppService
    ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async sendData() {
    const data = await this.appService.crawl()
    this.client.emit<ArticleDto[]>('crawlData', data)
  }

  @MessagePattern('thanhnien')
  async getData(): Promise<ArticleDto[]> {
    const data = await this.appService.crawl()
    return data
  }
}
