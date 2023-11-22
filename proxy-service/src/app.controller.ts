import { BadRequestException, Controller, Get, Inject, Query, Redirect } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { QueryDto } from './dtos/query.dto';
import { ArticleDto } from './dtos/data.dto';

@Controller()
export class AppController {
  constructor(
    @Inject('READ_SERVICE') private readonly client: ClientProxy,
    private readonly appService: AppService) {}

  //sending query as pattern to crawling service and return exception when query is invalid
  @Get('getArticle')
  async sendRequest(@Query() query: QueryDto): Promise<Error | ArticleDto[]> {
    const source = query.source
    const data = await firstValueFrom(this.client.send(source, {})).catch((e: Error) => {
      throw new BadRequestException(e)
    })
    return data
  }
}
