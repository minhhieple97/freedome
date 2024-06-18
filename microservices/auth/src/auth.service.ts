import {
  IAccessTokenPayload,
  ITokenResponse,
} from '@freedome/common/interfaces';
import { UploadService } from '@freedome/common/upload';
import { AppConfigService } from '@auth/config/app/config.service';
import * as grpc from '@grpc/grpc-js';
import { PrismaService } from './prisma/prisma.service';
import * as crypto from 'crypto';
import { faker } from '@faker-js/faker';
import { generateUsername } from 'unique-username-generator';

import {
  CreateUserDto,
  EMAIL_TEMPLATES_NAME,
  EVENTS_RMQ,
  IAuthBuyerMessageDetails,
  IAuthDocument,
  IEmailMessageDetails,
  LoginUserDto,
  ResetPasswordDtoWithTokenDto,
  ResetPasswordDtoWithUserIdDto,
  SERVICE_NAME,
  dateToTimestamp,
} from '@freedome/common';
import { Inject, Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { v4 as uuidV4 } from 'uuid';
import { BUCKET_S3_FOLDER_NAME } from './common/constants';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { hash, compare } from 'bcryptjs';
import { Auth, Prisma } from '@prisma/client';
import { TokenService } from './services/token.service';
import { PrismaError } from '@freedome/common/enums';
import { sensitiveFields } from './prisma/sensitive-fields.prisma';
import { getRandomCharacters } from './common/helpers/random.helper';
import { DecodeTokenRequest, SeedUserRequest } from 'proto/types/auth';
@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly appConfigService: AppConfigService,
    @Inject(SERVICE_NAME.NOTIFICATIONS)
    private notificationsServiceClient: ClientProxy,
    @Inject(SERVICE_NAME.USER)
    private userServiceClient: ClientProxy,
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
      this.sendAuthInfoToBuyerService(createdUser);
      const accessToken = this.tokenService.createAccessToken({
        id: createdUser.id,
        email: createdUser.email,
        username: createdUser.username,
      });
      const refreshToken = this.tokenService.createRefreshToken({
        id: createdUser.id,
        email: createdUser.email,
        username: createdUser.username,
      });
      return {
        user: _.omit(createdUser, sensitiveFields),
        accessToken,
        refreshToken,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error?.code === PrismaError.UniqueConstraintFailed
      ) {
        throw new RpcException({
          code: grpc.status.ALREADY_EXISTS,
          message: 'Email already exists',
        });
      }
      throw new RpcException({
        code: grpc.status.INTERNAL,
        message: 'Sorry something went wrong',
      });
    }
  }
  async getAuthUserById(authId: number) {
    const user = await this.prismaService.auth.findUnique({
      where: {
        id: authId,
      },
    });
    if (!user) {
      throw new RpcException({
        code: grpc.status.NOT_FOUND,
        message: 'user_not_found',
      });
    }
    return _.omit(
      {
        ...user,
        createdAt: dateToTimestamp(user.createdAt),
        updatedAt: dateToTimestamp(user.updatedAt),
      },
      sensitiveFields,
    );
  }
  async updateAuthRecord(id: number, data: Partial<Auth>) {
    const updatedAuth = await this.prismaService.auth.update({
      where: { id },
      data,
    });
    return _.omit(updatedAuth, sensitiveFields);
  }
  updateVerifyEmailField(
    authId: number,
    emailVerified: boolean,
    emailVerificationToken?: string,
  ) {
    return this.prismaService.auth.update({
      where: { id: authId },
      data: {
        emailVerified,
        emailVerificationToken,
      },
    });
  }
  async getUserByUsernameOrEmail(
    username: string,
    email: string,
  ): Promise<Auth | null> {
    const user = await this.prismaService.auth.findFirst({
      where: {
        OR: [{ username }, { email: _.lowerCase(email) }],
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
        email: _.lowerCase(email),
      },
    });
    return user;
  }
  async updatePasswordToken(
    authId: number,
    token: string,
    tokenExpiration: Date,
  ) {
    await this.prismaService.auth.update({
      where: { id: authId },
      data: {
        passwordResetToken: token,
        passwordResetExpires: tokenExpiration,
      },
    });
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
      type: SERVICE_NAME.AUTH,
    };
    this.userServiceClient.emit(EVENTS_RMQ.USER_BUYER, messageDetails);
  }
  async getUserByCredential(
    loginUserDto: LoginUserDto,
  ): Promise<IAuthDocument | null> {
    const user = await this.prismaService.auth.findUnique({
      where: { email: loginUserDto.email },
    });
    if (!user) {
      throw new RpcException({
        code: grpc.status.NOT_FOUND,
        message: 'Wrong credentials provided',
      });
    }

    const isValidPassword = await this.verifyPassword(
      loginUserDto.password,
      user.password,
    );
    if (!isValidPassword) {
      throw new RpcException({
        code: grpc.status.NOT_FOUND,
        message: 'Wrong credentials provided',
      });
    }
    return _.omit(user, sensitiveFields);
  }
  verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return compare(plainTextPassword, hashedPassword);
  }
  async getUserByEmailToken(token: string): Promise<Partial<IAuthDocument>> {
    const user = await this.prismaService.auth.findUnique({
      where: {
        emailVerificationToken: token,
      },
    });
    if (!user)
      throw new RpcException({
        code: grpc.status.UNAUTHENTICATED,
        message: 'Wrong credentials provided',
      });
    return _.omit(user, sensitiveFields);
  }
  async verifyEmail(authId: number, emailVerified: boolean) {
    const updatedAuth = await this.prismaService.auth.update({
      where: { id: authId },
      data: {
        emailVerified,
        emailVerificationToken: null,
      },
    });
    return _.omit(updatedAuth, sensitiveFields);
  }
  async forgotPassword(email: string): Promise<void> {
    const user = await this.prismaService.auth.findUnique({
      where: {
        email,
      },
    });
    if (!user)
      throw new RpcException({
        code: grpc.status.UNAUTHENTICATED,
        message: 'Wrong credentials provided',
      });
    const token = uuidV4();
    const tokenExpiration = new Date();
    tokenExpiration.setHours(tokenExpiration.getHours() + 1);
    await this.updatePasswordToken(user.id, token, tokenExpiration);
    const resetLink = `${this.appConfigService.clientUrl}/reset_password?token=${token}`;
    const messageDetails: IEmailMessageDetails = {
      receiverEmail: email,
      resetLink,
      template: EMAIL_TEMPLATES_NAME.FORGOT_PASSWORD,
      username: user.username,
    };
    this.notificationsServiceClient.emit(EVENTS_RMQ.AUTH_EMAIL, messageDetails);
  }
  async resetPassword(
    resetPasswordDtoWithUserId: ResetPasswordDtoWithUserIdDto,
  ) {
    const { password, userId } = resetPasswordDtoWithUserId;
    const user = await this.prismaService.auth.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user)
      throw new RpcException({
        code: grpc.status.NOT_FOUND,
        message: 'User does not exist',
      });
    const hashedPassword = await this.hashPassword(password);
    await this.prismaService.auth.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });
  }

  async resetPasswordWithToken(
    resetPasswordDtoWithUserId: ResetPasswordDtoWithTokenDto,
  ) {
    const { password, token } = resetPasswordDtoWithUserId;
    const user = await this.prismaService.auth.findFirst({
      where: {
        passwordResetExpires: {
          gte: new Date(),
        },
        passwordResetToken: token,
      },
    });
    if (!user)
      throw new RpcException({
        code: grpc.status.NOT_FOUND,
        message: 'User does not exist',
      });
    const hashedPassword = await this.hashPassword(password);
    await this.prismaService.auth.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });
  }
  private hashPassword(password: string) {
    return hash(password, 10);
  }
  async resendEmail(email: string) {
    const user = await this.prismaService.auth.findUnique({
      where: {
        email,
        emailVerified: false,
      },
    });
    if (!user)
      throw new RpcException({
        code: grpc.status.NOT_FOUND,
        message: 'User does not exist',
      });
    const emailVerificationToken = await getRandomCharacters();
    await this.prismaService.auth.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerificationToken,
      },
    });
    this.sendVerifyEmail(user.email, emailVerificationToken);
  }
  createToken(data: IAccessTokenPayload): ITokenResponse {
    const { id, email, username } = data;
    const accessToken = this.tokenService.createAccessToken({
      id,
      email,
      username,
    });
    const refreshToken = this.tokenService.createRefreshToken({
      id,
      email,
      username,
    });
    return {
      accessToken,
      refreshToken,
    };
  }
  decodeToken(tokenValue: DecodeTokenRequest): Promise<IAccessTokenPayload> {
    return this.tokenService.decodeToken(tokenValue);
  }
  async seedUser(seedUserRequest: SeedUserRequest) {
    const { count } = seedUserRequest;
    const users = [];
    const usernames: string[] = [];
    for (let i = 0; i < count; i++) {
      const username: string = generateUsername('', 0, 12);
      usernames.push(username);
    }

    for (let i = 0; i < usernames.length; i++) {
      const username = usernames[i];
      const email = faker.internet.email();
      const password = 'qwerty';
      const country = faker.location.country();
      const profilePublicId = uuidV4();
      const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
      const randomCharacters: string = randomBytes.toString('hex');
      const authData: IAuthDocument = {
        username,
        email: _.lowerCase(email),
        profilePublicId,
        password,
        country,
        emailVerificationToken: randomCharacters,
        emailVerified: true,
        deviceType: 'mobile',
        browserName: 'Chrome',
      };
      users.push(authData);
    }
    await this.prismaService.auth.createMany({ data: users });
  }
}
