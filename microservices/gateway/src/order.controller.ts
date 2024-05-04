import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('order')
@ApiTags('order')
export class OrderController {}
