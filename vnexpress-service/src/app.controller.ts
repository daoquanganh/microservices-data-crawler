import { Controller, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { ArticleDto } from './dtos/data.dto';

@Controller()
export class AppController {
  constructor(
    @Inject('CRAWL_SERVICE') private readonly client: ClientProxy,
    private readonly appService: AppService) {
    }

  //endpoint for crawling and sending articles with schedule
  @Cron(CronExpression.EVERY_MINUTE)
  async sendData() {
    try {
      const data = await this.appService.crawl()
      this.client.emit('crawlData', {data})
    } catch (e) {throw new HttpException(e, HttpStatus.BAD_REQUEST)}

  }

  //endpoint for receiving message and return data to proxy
  @MessagePattern('vnexpress')
  async getData(): Promise<ArticleDto[]> {
    return await this.appService.crawl().catch((e)=> {
      console.log(e)
      throw new HttpException(e, HttpStatus.BAD_REQUEST)
    })
  }
}
