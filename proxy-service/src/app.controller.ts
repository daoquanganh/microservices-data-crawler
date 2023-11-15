import { Controller, Get, Inject, Query, Redirect } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { DataDto } from './dtos/data.dto';
import { firstValueFrom } from 'rxjs';
import { QueryDto } from './dtos/query.dto';

@Controller()
export class AppController {
  constructor(
    @Inject('READ_SERVICE') private readonly client: ClientProxy,
    private readonly appService: AppService) {}

  @Get('getArticle')
  async sendRequest(@Query() query: QueryDto) {
    const source = query.source
    const data = await firstValueFrom(this.client.send(source, {}))
    return data
  }
}
