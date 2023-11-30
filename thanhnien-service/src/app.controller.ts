import { Controller, Get, HttpException, HttpStatus, Inject, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy, Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ArticleDto } from './dtos/data.dto';
@Controller()
export class AppController {
  constructor(@Inject('CRAWL_SERVICE') private readonly client: ClientProxy,
    private readonly appService: AppService
    ) {}


  //endpoint for crawling and sending articles with schedule
  @Cron(CronExpression.EVERY_30_MINUTES)
  async sendData() {
    let data = await this.appService.crawl()
    data = await this.appService.duplicateCheck(data)
    this.client.emit('crawlData', {data})
  }

  //endpoint for receiving message and return data to proxy
  @MessagePattern('thanhnien')
  async getData(): Promise<ArticleDto[]> {
    return await this.appService.crawl().catch((e)=> {
      console.log(e)
      throw new HttpException(e, HttpStatus.BAD_REQUEST)
    })
  }
}
