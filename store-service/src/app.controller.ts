import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern } from '@nestjs/microservices';
import { DataDto } from './dtos/data.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';
import { subscribe } from 'diagnostics_channel';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    ) {}

  @EventPattern('crawlData')
  async storeData(data: DataDto[]) {
    console.log(data)
    return await this.appService.create(data)
  }
}
