import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('seller')
@ApiTags('seller')
export class SellerController {}
