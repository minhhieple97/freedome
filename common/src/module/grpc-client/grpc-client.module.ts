import { DynamicModule, Global, Module } from '@nestjs/common';
import {
  ClientsModule,
  ClientsModuleOptions,
  Transport,
} from '@nestjs/microservices';
import {
  GrpcClientModuleOptions,
  GrpcClientAsyncOptions,
} from './grpc-client.interface';

@Global()
@Module({})
export class GrpcClientModule {
  static register(options: GrpcClientModuleOptions): DynamicModule {
    const clients: ClientsModuleOptions = options.clients.map((client) => ({
      name: client.name,
      transport: Transport.GRPC,
      options: {
        package: client.packageName,
        protoPath: client.protoPath,
      },
    }));

    const module = {
      module: GrpcClientModule,
      imports: [ClientsModule.register(clients)],
      exports: [ClientsModule],
    };

    if (options.isGlobal) {
      return {
        ...module,
        global: true,
      };
    }

    return module;
  }

  static registerAsync(options: GrpcClientAsyncOptions[]): DynamicModule {
    const clients = options.map((option) => ({
      name: option.name,
      transport: Transport.GRPC,
      useFactory: option.useFactory,
      inject: option.inject,
      imports: option.imports,
    }));

    return {
      module: GrpcClientModule,
      imports: [ClientsModule.registerAsync(clients)],
      exports: [ClientsModule],
    };
  }
}
