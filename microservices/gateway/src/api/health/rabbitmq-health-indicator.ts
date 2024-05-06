import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import { AmqpConnectionManager } from 'amqp-connection-manager';

@Injectable()
export class RabbitMqHealthIndicator extends HealthIndicator {
  constructor(private readonly amqpConnection: AmqpConnectionManager) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      if (!this.amqpConnection.isConnected()) {
        throw new Error();
      }
      return this.getStatus(key, true);
    } catch (error) {
      throw new HealthCheckError(
        'RabbitMQHealthIndicator failed',
        this.getStatus(key, false),
      );
    }
  }
}
