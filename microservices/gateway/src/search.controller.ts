import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('search')
@ApiTags('search')
export class SearchController {}
