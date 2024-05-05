import { Controller, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';

@Controller('auth')
@ApiTags('auth')
@UseInterceptors(TransformResponseInterceptor)
export class AuthController {}
