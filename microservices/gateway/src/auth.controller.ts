import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Inject,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  CreateUserDto,
  CreateUserResponseDto,
  GetUserByTokenResponseDto,
  LoginUserDto,
  LoginUserResponseDto,
  SERVICE_NAME,
} from '@freedome/common';
import { Authorization } from './common/decorators/authorization.decorator';
import {
  IAuthGetByIdResponse,
  IAuthorizedRequest,
  IServiceUserCreateResponse,
  IServiceUserSearchResponse,
  IServiveTokenCreateResponse,
} from '@freedome/common/interfaces';

@ApiBearerAuth('authorization')
@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    @Inject(SERVICE_NAME.AUTH) private readonly authServiceClient: ClientProxy,
  ) {}

  @Get('/current-user')
  @Authorization(true)
  @ApiOkResponse({
    type: GetUserByTokenResponseDto,
  })
  public async getUserByToken(
    @Req() request: IAuthorizedRequest,
  ): Promise<GetUserByTokenResponseDto> {
    const userInfo = request.user;

    const userResponse: IAuthGetByIdResponse = await firstValueFrom(
      this.authServiceClient.send('user_get_by_id', userInfo.id),
    );

    return {
      message: userResponse.message,
      data: {
        user: userResponse.user,
      },
      errors: null,
    };
  }

  @Post('/signup')
  @ApiCreatedResponse({
    type: CreateUserResponseDto,
  })
  public async createUser(
    @Body() userRequest: CreateUserDto,
  ): Promise<CreateUserResponseDto> {
    const createUserResponse: IServiceUserCreateResponse = await firstValueFrom(
      this.authServiceClient.send('user_create', userRequest),
    );
    if (createUserResponse.status !== HttpStatus.CREATED) {
      throw new HttpException(
        {
          message: createUserResponse.message,
          data: null,
          errors: createUserResponse.errors,
        },
        createUserResponse.status,
      );
    }

    return {
      message: createUserResponse.message,
      data: {
        user: createUserResponse.user,
        token: '',
      },
      errors: null,
    };
  }

  @Post('/login')
  @ApiCreatedResponse({
    type: LoginUserResponseDto,
  })
  public async loginUser(
    @Body() loginRequest: LoginUserDto,
  ): Promise<LoginUserResponseDto> {
    const getUserResponse: IServiceUserSearchResponse = await firstValueFrom(
      this.authServiceClient.send('user_search_by_credentials', loginRequest),
    );
    if (getUserResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: getUserResponse.message,
          data: null,
          errors: null,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const createTokenResponse: IServiveTokenCreateResponse =
      await firstValueFrom(
        this.authServiceClient.send('token_create', {
          userId: getUserResponse.user.id,
        }),
      );

    return {
      message: createTokenResponse.message,
      data: {
        token: createTokenResponse.token,
      },
      errors: null,
    };
  }
}
