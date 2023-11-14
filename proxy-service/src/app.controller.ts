import { Controller, Get, Inject, Query, Redirect } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { DataDto } from './dtos/data.dto';
import { firstValueFrom } from 'rxjs';

@Controller()
export class AppController {
  constructor(
    @Inject('READ_SERVICE') private readonly client: ClientProxy,
    private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }


  @Get('getArticle')
  async sendRequest(@Query() query: {source:string}) {
    const source = query.source
    const data = await firstValueFrom(this.client.send(source, {}))
    return data
  }
}
