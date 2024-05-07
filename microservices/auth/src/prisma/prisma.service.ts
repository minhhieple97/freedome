import { LoggerService } from '@freedome/common';
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { hash } from 'bcryptjs';
@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, Prisma.LogLevel>
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new LoggerService(PrismaService.name);

  constructor() {
    super({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
      ],
    });
    this.$extends({
      query: {
        auth: {
          $allOperations({
            operation,
            args,
            query,
          }: {
            operation: string;
            args: any;
            query: any;
          }) {
            if (
              ['create', 'update'].includes(operation) &&
              args.data['password']
            ) {
              args.data['password'] = hash(args.data['password'], 10);
            }
            return query(args);
          },
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();

    this.$on('error', ({ message }) => {
      this.logger.error(message);
    });
    this.$on('warn', ({ message }) => {
      this.logger.warn(message);
    });
    this.$on('info', ({ message }) => {
      this.logger.debug(message);
    });
    this.$on('query', ({ query, params }) => {
      this.logger.log(`${query}; ${params}`);
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
