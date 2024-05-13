import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Inject,
  HttpStatus,
  HttpException,
  UseInterceptors,
  Res,
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
  EVENTS_HTTP,
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
import { Response } from 'express';
import {
  ACCESS_TOKEN_EXPIRES_IN,
  ACCESS_TOKEN_KEY,
} from '@gateway/common/constants';

@ApiBearerAuth('authorization')
@Controller('auth')
@ApiTags('auth')
@Controller()
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
  ): Promise<IAuthGetByIdResponse> {
    const userInfo = request.user;

    const userResponse: IAuthGetByIdResponse = await firstValueFrom(
      this.authServiceClient.send('user_get_by_id', userInfo.id),
    );
    return userResponse;
  }

  @Post('/signup')
  @ApiCreatedResponse({
    type: CreateUserResponseDto,
  })
  public async createUser(
    @Body() userRequest: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CreateUserResponseDto> {
    const createUserResponse: IServiceUserCreateResponse = await firstValueFrom(
      this.authServiceClient.send(EVENTS_HTTP.USER_CREATE, userRequest),
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
    res.cookie(ACCESS_TOKEN_KEY, createUserResponse.token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      expires: new Date(Date.now() + ACCESS_TOKEN_EXPIRES_IN),
    });

    return {
      token: createUserResponse.token,
      user: createUserResponse.user,
      message: createUserResponse.message,
    };
  }

  @Post('/login')
  @ApiCreatedResponse({
    type: LoginUserResponseDto,
  })
  public async loginUser(
    @Body() loginRequest: LoginUserDto,
  ): Promise<LoginUserResponseDto> {
    console.log({ loginRequest });
    const getUserResponse: IServiceUserSearchResponse = await firstValueFrom(
      this.authServiceClient.send(
        EVENTS_HTTP.USER_SEARCH_BY_CREDENTIALS,
        loginRequest,
      ),
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
        this.authServiceClient.send(EVENTS_HTTP.AT_RF_CREATE, {
          id: getUserResponse.user.id,
          email: getUserResponse.user.email,
          username: getUserResponse.user.username,
        }),
      );
    if (createTokenResponse.status !== HttpStatus.CREATED) {
      throw new HttpException(
        {
          message: createTokenResponse.message,
          data: null,
          errors: null,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    console.log({ createTokenResponse });
    return {
      message: createTokenResponse.message,
      data: {
        accessToken: createTokenResponse.accessToken,
        refreshToken: createTokenResponse.refreshToken,
      },
      errors: null,
    };
  }
}
