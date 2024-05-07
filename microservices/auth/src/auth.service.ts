import { AppConfigService } from '@auth/config/app/config.service';
import { PrismaService } from './prisma/prisma.service';
import { CreateUserDto } from '@freedome/common';
import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { v4 as uuidV4 } from 'uuid';
import crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { PrismaError } from '@freedome/common/prisma';
@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly appConfigService: AppConfigService,
  ) {}
  async createUser(userInfo: CreateUserDto) {
    try {
      const profilePublicId = uuidV4();
      const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
      const randomCharacters: string = randomBytes.toString('hex');
      const createdUser = await this.prismaService.auth.create({
        data: {
          ...userInfo,
          profilePublicId,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error?.code === PrismaError.UniqueConstraintFailed
      ) {
        throw new BadRequestException('User with that email already exists');
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
