import { BadRequestException, Controller, Get, Inject, Query, Redirect } from '@nestjs/common';
import { AppService } from './app.service';
import { QueryDto } from './dtos/query.dto';
import { ArticleDto } from './dtos/data.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService) {}

  //sending query as pattern to crawling service and return exception when query is invalid
  @Get('getArticle')
  async sendRequest(@Query() query: QueryDto): Promise<Error | ArticleDto[]> {
    const source = query.source
    const articles = await this.appService.broadcast(source)

    return articles
  }
}
