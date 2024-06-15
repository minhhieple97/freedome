import { RabbitMqServiceInterface } from '@freedome/common/interfaces/rabbitmq.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class RabbitMqService implements RabbitMqServiceInterface {
  constructor(private readonly configService: ConfigService) {}

  getRmqOptions(queue: string): RmqOptions {
    const urlRmq = this.configService.get('RABBITMQ_ENDPOINT');
    return {
      transport: Transport.RMQ,
      options: {
        urls: [urlRmq],
        noAck: false,
        queue,
        queueOptions: {
          durable: true,
        },
      },
    };
  }

  acknowledgeMessage(context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
  }
}
