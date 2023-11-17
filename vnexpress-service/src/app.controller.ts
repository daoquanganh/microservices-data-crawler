import { Controller, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ClientProxy, MessagePattern, RpcException } from '@nestjs/microservices';
import { ArticleDto } from './dtos/data.dto';

@Controller()
export class AppController {
  constructor(
    @Inject('CRAWL_SERVICE') private readonly client: ClientProxy,
    private readonly appService: AppService) {
    }

  @Cron(CronExpression.EVERY_5_HOURS)
  async sendData(): Promise<ArticleDto[]> {
    try {
      const data = await this.appService.crawl()
      this.client.emit<ArticleDto[]>('crawlData', data)
      return data
    } catch (e) {throw new RpcException(e)}

  }

  @MessagePattern('vnexpress')
  async getData(): Promise<ArticleDto[]> {
    const data = await this.appService.crawl().catch((e)=> {throw new RpcException(e)})
    return data
  }
}
