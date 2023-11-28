import { RmqOptions, Transport } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";
import { Inject } from "@nestjs/common";

export class RabbitMqService {
  constructor(
    @Inject(ConfigService)
    private readonly cf: ConfigService
  ) {}

  getOptions(queue: string): RmqOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [
          this.cf.get<string>('AMQP_PROXY_URI'),
        ],
        queue: this.cf.get<string>(`RABBITMQ_${queue}_QUEUE`),
        queueOptions:{
            durable: false,
            arguments: {
              'x-message-ttl': 5000,
            },
        }
      },
    };
  }
}