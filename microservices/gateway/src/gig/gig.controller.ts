import {
  Controller,
  Post,
  Body,
  UseGuards,
  ValidationPipe,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { GigService } from './gig.service';
import { JwtAuthGuard } from '@gateway/common/guards/jwt-auth.guard';
import { CreateGigDto, IAuthorizedRequest } from '@freedome/common';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { Roles } from '../auth/decorators/roles.decorator';
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { UserRole } from '../users/enums/user-role.enum';
// import { PaginationDto } from '../common/dto/pagination.dto';

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

  // @Get(':id')
  // @ApiOperation({ summary: 'Get a gig by id' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Return the gig.',
  //   type: GigResponseDto,
  // })
  // @ApiResponse({ status: 404, description: 'Gig not found.' })
  // async getGigById(@Param('id') id: string): Promise<GigResponseDto> {
  //   return this.gigService.getGigById(id);
  // }

  // @Put(':id')
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Update a gig' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'The gig has been successfully updated.',
  // })
  // @ApiResponse({ status: 404, description: 'Gig not found.' })
  // async updateGig(
  //   @Param('id') id: string,
  //   @Body(ValidationPipe) updateGigDto: UpdateGigDto,
  // ): Promise<GigResponseDto> {
  //   return this.gigService.updateGig(id, updateGigDto);
  // }

  // @Delete(':id')
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Delete a gig' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'The gig has been successfully deleted.',
  // })
  // @ApiResponse({ status: 404, description: 'Gig not found.' })
  // async deleteGig(@Param('id') id: string): Promise<void> {
  //   return this.gigService.deleteGig(id);
  // }
}
