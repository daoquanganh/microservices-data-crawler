import { Controller} from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ArticleDto } from './dtos/data.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    ) {}

  @EventPattern('crawlData')
  async storeData(data: ArticleDto[]) {
    return await this.appService.create(data)
  }
}
