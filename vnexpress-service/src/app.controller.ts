import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import * as cheerio from 'cheerio'
import { ClientProxy, EventPattern, MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    @Inject('CRAWL_SERVICE') private readonly client: ClientProxy,
    private readonly appService: AppService) {
    }

  @Cron(CronExpression.EVERY_5_HOURS)
  async sendData() {
    const data = await this.appService.crawl()
    this.client.emit('crawlData', data)

  }

  @MessagePattern('vnexpress')
  async getData() {
    const data = await this.appService.crawl()
    return data
  }
}
