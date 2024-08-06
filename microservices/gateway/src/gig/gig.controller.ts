import {
  Controller,
  Post,
  Body,
  UseGuards,
  ValidationPipe,
  Req,
  Param,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { GigService } from './gig.service';
import { JwtAuthGuard } from '@gateway/common/guards/jwt-auth.guard';
import {
  CreateGigDto,
  IAuthorizedRequest,
  UpdateGigDto,
} from '@freedome/common';

@ApiTags('Gigs')
@Controller('gigs')
export class GigController {
  constructor(private readonly gigService: GigService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new gig' })
  @ApiResponse({
    description: 'The gig has been successfully created.',
  })
  async createGig(
    @Body(ValidationPipe) createGigDto: CreateGigDto,
    @Req() request: IAuthorizedRequest,
  ) {
    const userTokenPayload = request.user;
    return this.gigService.createGig(createGigDto, userTokenPayload);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a gig' })
  @ApiResponse({
    status: 200,
    description: 'The gig has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Gig not found.' })
  async updateGig(
    @Param('id') id: string,
    @Body(ValidationPipe) updateGigDto: UpdateGigDto,
    @Req() request: IAuthorizedRequest,
  ) {
    return this.gigService.updateGig(updateGigDto, id, request.user.id);
  }
}
