import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { INestApplication } from '@nestjs/common';
import { AppConfigService } from '@gateway/config/app/config.service';
import { LoggerService } from '@freedome/common';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;
  private appConfigService: AppConfigService;
  private logger = new LoggerService('RedisIoAdapter');
  constructor(app: INestApplication) {
    super(app);
    this.appConfigService = app.get(AppConfigService);
  }

  async connectToRedis(): Promise<void> {
    try {
      const pubClient = createClient({
        socket: {
          host: this.appConfigService.redisHost,
          port: this.appConfigService.redisPort,
        },
      });
      const subClient = pubClient.duplicate();

      await Promise.all([pubClient.connect(), subClient.connect()]);
      this.logger.log('Connected to Redis');
      this.adapterConstructor = createAdapter(pubClient, subClient);
    } catch (error) {
      this.logger.error('Error connecting to Redis', error);
    }
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}
