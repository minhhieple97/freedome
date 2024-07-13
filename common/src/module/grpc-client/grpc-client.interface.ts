import { ModuleMetadata } from '@nestjs/common';
import { GrpcOptions } from '@nestjs/microservices';

export interface GrpcClientOptions {
  name: string;
  packageName: string;
  protoPath: string;
}

export interface GrpcClientAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: any[]) => Promise<GrpcOptions> | GrpcOptions;
  inject?: any[];
  name: string;
}

export interface GrpcClientModuleOptions {
  clients: GrpcClientOptions[];
  isGlobal?: boolean;
}
