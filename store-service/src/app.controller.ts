import { Controller, UsePipes} from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PayloadDto } from './dtos/payload.dto';
import { PayloadValidationPipe } from './validation/payload.pipe';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    ) {}
  @UsePipes(PayloadValidationPipe)
  @EventPattern('crawlData') 
  async storeData(@Payload() payload: PayloadDto) {
    await this.appService.create(payload.data)
  }
}
