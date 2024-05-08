import { AppConfigService } from '@auth/config/app/config.service';
import { PrismaService } from './prisma/prisma.service';
import {
  CreateUserDto,
  EVENTS_RMQ,
  IEmailMessageDetails,
  SERVICE_NAME,
} from '@freedome/common';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { v4 as uuidV4 } from 'uuid';
import { EMAIL_TEMPLATES_NAME } from './common/constants';
import { ClientProxy } from '@nestjs/microservices';
import { hash } from 'bcryptjs';
import { Prisma } from '@prisma/client';
import { TokenService } from './services/token.service';
import { PrismaError } from '@freedome/common/enums';
@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly appConfigService: AppConfigService,
    @Inject(SERVICE_NAME.NOTIFICATIONS)
    private notificationsServiceClient: ClientProxy,
    private readonly tokenService: TokenService,
  ) {}
  async createUser(userInfo: CreateUserDto) {
    try {
      const profilePublicId = uuidV4();
      const hasPassword = await hash(userInfo.password, 10);
      const createdUser = await this.prismaService.auth.create({
        data: {
          ...userInfo,
          profilePublicId,
          password: hasPassword,
        },
      });
      const verificationLink = `${this.appConfigService.clientUrl}/confirm_email?v_token=${createdUser.emailVerificationToken}`;
      const messageDetails: IEmailMessageDetails = {
        receiverEmail: createdUser.email,
        verifyLink: verificationLink,
        template: EMAIL_TEMPLATES_NAME.VERIFY_EMAIL,
      };
      this.notificationsServiceClient.emit(
        EVENTS_RMQ.AUTH_EMAIL,
        messageDetails,
      );
      const token = this.tokenService.createToken(
        createdUser.id,
        createdUser.email,
        createdUser.username,
      );
      return {
        status: HttpStatus.CREATED,
        message: 'user_create_success',
        user: createdUser,
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
}
