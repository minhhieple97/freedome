import {
  Controller,
  Post,
  Body,
  UseGuards,
  ValidationPipe,
  Req,
  Param,
  Put,
  Delete,
  Get,
  Query,
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
  SearchGigsParamDto,
  UpdateGigDto,
  UpdateGigStatusDto,
} from '@freedome/common';

@ApiTags('Gig')
@Controller('gig')
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

  @Put('/status/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update status a gig' })
  @ApiResponse({
    status: 200,
    description: 'The gig has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Gig not found.' })
  async updateStatusGig(
    @Param('id') id: string,
    @Body(ValidationPipe) updateGigStatusDto: UpdateGigStatusDto,
    @Req() request: IAuthorizedRequest,
  ) {
    return this.gigService.updateStatusGig(
      updateGigStatusDto,
      id,
      request.user.id,
    );
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a gig' })
  @ApiResponse({
    status: 200,
    description: 'The gig has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Gig not found.' })
  async deleteGig(@Param('id') id: string, @Req() request: IAuthorizedRequest) {
    return this.gigService.deleteGig(id, request.user.id);
  }

  @Get('/active')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get gig by id' })
  async getActiveGigByUserId(
    @Param('id') id: string,
    @Req() request: IAuthorizedRequest,
  ) {
    return this.gigService.getActiveGigByUserId(request.user.id);
  }

  @Get('/inactive')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get gig by id' })
  async getInactiveGigByUserId(@Req() request: IAuthorizedRequest) {
    return this.gigService.getInactiveGigByUserId(request.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Search gig' })
  async searchGigs(@Query() searchGigsParam: SearchGigsParamDto) {
    return this.gigService.searchGigs(searchGigsParam);
  }

  @Get(':gigId/similar')
  async moreLikeThis(@Param('gigId') gigId: string) {
    return this.gigService.moreLikeThis(gigId);
  }

  @Get('/seed')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Seed gig' })
  async seedGig() {
    return this.gigService.seedGig();
  }
  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get gig by id' })
  async getGigById(@Param('id') id: string) {
    return this.gigService.getGigById(id);
  }
}
