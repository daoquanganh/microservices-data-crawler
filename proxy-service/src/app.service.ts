import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, RpcException } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { RabbitMqService } from './services/rabbitmq.service';

@Injectable()
export class AppService {
  microserviceClients: { [key:string]: ClientProxy } = {};

  
  constructor(
    private readonly rmqService: RabbitMqService,
    private readonly configService: ConfigService
  ) {
    const microservicesList = configService.get<string>('QUEUES').split(' ')
    for (const microservice of microservicesList) {
      const client: ClientProxy = ClientProxyFactory.create(rmqService.getOptions(microservice));
      this.microserviceClients[microservice] = client;
    }
  }
  async broadcast(event: string) {
    const microservicesList = this.configService.get<string>('QUEUES').split(' ')
    let articles = []
    for (const microservice of microservicesList) {
      const client = this.microserviceClients[microservice];
      console.log(microservice)
      try {
        articles = await firstValueFrom(client.send(event, {}))
        if (articles) return articles

      } catch (e) {
        console.log(e)
      }
    }
    throw new HttpException('No matching message handler', HttpStatus.NOT_FOUND)

  }
}
