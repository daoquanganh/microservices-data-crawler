import { Controller, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ClientProxy, Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { ArticleDto } from './dtos/data.dto';
import { RabbitRPC, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

@Controller()
export class AppController {
  constructor(
    @Inject('CRAWL_SERVICE') private readonly client: ClientProxy,
    private readonly appService: AppService) {
    }

  //endpoint for crawling and sending articles with schedule
  @Cron(CronExpression.EVERY_30_MINUTES)
  async sendData() {
    try {
      let data = await this.appService.crawl()
      data = await this.appService.duplicateCheck(data)
      this.client.emit('crawlData', {data})
    } catch (e) {throw new HttpException(e, HttpStatus.BAD_REQUEST)}

  }

  //endpoint for receiving message and return data to proxy
  @MessagePattern('vnexpress')
  async getData(): Promise<ArticleDto[]> {
    console.log(123)
    
    return await this.appService.crawl().catch((e)=> {
      console.log(e)
      throw new HttpException(e, HttpStatus.BAD_REQUEST)
    })
  }
}
