import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('review')
@ApiTags('review')
export class ReviewController {}
