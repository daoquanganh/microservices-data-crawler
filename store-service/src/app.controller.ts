import { Controller} from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PayloadDto } from './dtos/payload.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    ) {}
    
  @EventPattern('crawlData') 
  async storeData(@Payload() payload: PayloadDto) {
    await this.appService.create(payload.data)
    return payload
  }
}
