import { UploadService } from '@freedome/common/upload';
import { AppConfigService } from '@auth/config/app/config.service';
import { PrismaService } from './prisma/prisma.service';
import {
  CreateUserDto,
  EMAIL_TEMPLATES_NAME,
  EVENTS_RMQ,
  IAuthBuyerMessageDetails,
  IEmailMessageDetails,
  IServiceUserSearchResponse,
  LoginUserDto,
  SERVICE_NAME,
} from '@freedome/common';
import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import * as _ from 'lodash';
import { v4 as uuidV4 } from 'uuid';
import { BUCKET_S3_FOLDER_NAME } from './common/constants';
import { ClientProxy } from '@nestjs/microservices';
import { hash, compare } from 'bcryptjs';
import { Auth, Prisma } from '@prisma/client';
import { TokenService } from './services/token.service';
import { PrismaError } from '@freedome/common/enums';
import { sensitiveFields } from './prisma/sensitive-fields.prisma';
import { getRandomCharacters } from './common/helpers/random.helper';
@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly appConfigService: AppConfigService,
    @Inject(SERVICE_NAME.NOTIFICATIONS)
    private notificationsServiceClient: ClientProxy,
    private readonly tokenService: TokenService,
    private readonly uploadService: UploadService,
  ) {}
  async createUser(userInfo: CreateUserDto) {
    try {
      const hasPassword = await hash(userInfo.password, 10);
      const emailVerificationToken = await getRandomCharacters();
      const profilePublicId = await this.uploadAuthAvatar(
        userInfo.profilePicture,
      );
      const authRecord = {
        username: userInfo.username,
        email: userInfo.email,
        country: userInfo.country,
        browserName: userInfo.browserName,
        deviceType: userInfo.deviceType,
        profilePublicId,
        emailVerificationToken,
        password: hasPassword,
      };
      const createdUser = await this.prismaService.auth.create({
        data: authRecord,
      });
      this.sendVerifyEmail(createdUser.email, emailVerificationToken);
      // this.sendAuthInfoToBuyerService(createdUser);
      const token = this.tokenService.createAccessToken({
        id: createdUser.id,
        email: createdUser.email,
        username: createdUser.username,
      });
      return {
        status: HttpStatus.CREATED,
        message: 'user_create_success',
        user: _.omit(createdUser, sensitiveFields),
        token,
        errors: null,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error?.code === PrismaError.UniqueConstraintFailed
      ) {
        return {
          status: HttpStatus.CONFLICT,
          message: 'user_create_conflict',
          user: null,
          token: null,
          errors: {
            email: {
              message: 'Email already exists',
              path: 'email',
            },
          },
        };
      }
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'user_create_bad_request',
        user: null,
        token: null,
        errors: null,
      };
    }
  }
  async getAuthUserById(authId: number) {
    const user = await this.prismaService.auth.findUnique({
      where: {
        id: authId,
      },
    });
    if (!user) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'user_not_found',
      };
    }
    return _.omit(user, sensitiveFields);
  }
  async updateAuthRecord(id: number, data: Partial<Auth>) {
    const updatedAuth = await this.prismaService.auth.update({
      where: { id },
      data,
    });
    return _.omit(updatedAuth, sensitiveFields);
  }
  async updateVerifyEmailField(
    authId: number,
    emailVerified: boolean,
    emailVerificationToken?: string,
  ) {
    const updatedAuth = await this.prismaService.auth.update({
      where: { id: authId },
      data: {
        emailVerified,
        emailVerificationToken,
      },
    });
    console.log('Email verification field updated:', updatedAuth);
  }
  async getUserByUsernameOrEmail(
    username: string,
    email: string,
  ): Promise<Auth | null> {
    const user = await this.prismaService.auth.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });
    return user;
  }
  async getUserByUsername(username: string): Promise<Auth | null> {
    const user = await this.prismaService.auth.findFirst({
      where: {
        username,
      },
    });
    return user;
  }
  async getUserByEmail(email: string): Promise<Auth | null> {
    const user = await this.prismaService.auth.findFirst({
      where: {
        email,
      },
    });
    return user;
  }
  async updatePasswordToken(
    authId: number,
    token: string,
    tokenExpiration: Date,
  ) {
    const updatedAuth = await this.prismaService.auth.update({
      where: { id: authId },
      data: {
        passwordResetToken: token,
        passwordResetExpires: tokenExpiration,
      },
    });
    console.log('Password token updated:', updatedAuth);
  }
  async uploadAuthAvatar(
    profilePicture: string | null,
  ): Promise<string | null> {
    if (!profilePicture) return null;
    const profilePublicId = uuidV4();
    const buf = Buffer.from(
      profilePicture.replace(/^data:image\/\w+;base64,/, ''),
      'base64',
    );
    await this.uploadService.upload({
      Bucket: this.appConfigService.awsBucketS3Name,
      Key: `${BUCKET_S3_FOLDER_NAME.AVATARS}/${profilePublicId}.jpg`,
      Body: buf,
      ContentEncoding: 'base64',
      ContentType: 'image/jpeg',
    });
    return profilePublicId;
  }
  sendVerifyEmail(receiverEmail: string, emailVerificationToken: string) {
    const verificationLink = `${this.appConfigService.clientUrl}/confirm_email?v_token=${emailVerificationToken}`;
    const messageDetails: IEmailMessageDetails = {
      receiverEmail,
      verifyLink: verificationLink,
      template: EMAIL_TEMPLATES_NAME.VERIFY_EMAIL,
    };
    this.notificationsServiceClient.emit(EVENTS_RMQ.AUTH_EMAIL, messageDetails);
  }
  sendAuthInfoToBuyerService(auth: Auth) {
    const messageDetails: IAuthBuyerMessageDetails = {
      username: auth.username,
      email: auth.email,
      profilePublicId: auth.profilePublicId,
      country: auth.country,
      createdAt: auth.createdAt,
      type: 'auth',
    };
    this.notificationsServiceClient.emit(EVENTS_RMQ.USER_BUYER, messageDetails);
  }
  async getUserByCredential(
    loginUserDto: LoginUserDto,
  ): Promise<IServiceUserSearchResponse> {
    try {
      const user = await this.prismaService.auth.findUnique({
        where: { email: loginUserDto.email },
      });
      if (!user) {
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'user_search_by_credentials_not_found',
          user: null,
        };
      }
      await this.verifyPassword(loginUserDto.password, user.password);
      return {
        status: HttpStatus.OK,
        message: 'user_search_by_credentials_success',
        user: _.omit(user, sensitiveFields),
      };
    } catch (error) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'user_search_by_credentials_not_match',
        user: null,
      };
    }
  }
  async verifyPassword(plainTextPassword: string, hashedPassword: string) {
    const isPasswordMatching = await compare(plainTextPassword, hashedPassword);
    if (!isPasswordMatching) {
      throw new BadRequestException('Wrong credentials provided');
    }
  }
}
