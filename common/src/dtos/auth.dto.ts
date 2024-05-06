import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  Matches,
  IsEmail,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { IAuthDocument } from '../interfaces';

export class CreateUserDto {
  @IsString()
  @Matches(/^.{4,12}$/, { message: 'Invalid username' })
  @IsNotEmpty({ message: 'Username is a required field' })
  username: string;

  @IsString()
  @Matches(/^.{4,12}$/, { message: 'Invalid password' })
  @IsNotEmpty({ message: 'Password is a required field' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Country is a required field' })
  country: string;

  @IsEmail(undefined, { message: 'Invalid email' })
  @IsNotEmpty({ message: 'Email is a required field' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Please add a profile picture' })
  profilePicture: string;

  @IsString()
  @IsOptional()
  browserName: string;

  @IsString()
  @IsOptional()
  deviceType: string;
}

export class GetUserByTokenResponseDto {
  @ApiProperty({ example: 'user_get_by_id_success' })
  message: string;
  @ApiProperty({
    example: {
      user: {
        email: 'test@denrox.com',
        is_confirmed: true,
        id: '5d987c3bfb881ec86b476bcc',
      },
    },
    nullable: true,
  })
  data: {
    user: IAuthDocument;
  };
  @ApiProperty({ example: null, nullable: true })
  errors: { [key: string]: any };
}

export class CreateUserResponseDto {
  @ApiProperty({ example: 'user_create_success' })
  message: string;
  @ApiProperty({
    example: {
      user: {
        email: 'test@denrox.com',
        is_confirmed: false,
        id: '5d987c3bfb881ec86b476bcc',
      },
    },
    nullable: true,
  })
  data: {
    user: IAuthDocument;
    token: string;
  };
  @ApiProperty({ example: null, nullable: true })
  errors: { [key: string]: any };
}

export class LoginUserResponseDto {
  @ApiProperty({ example: 'token_create_success' })
  message: string;
  @ApiProperty({
    example: { token: 'someEncodedToken' },
    nullable: true,
  })
  data: {
    token: string;
  };
  @ApiProperty({ example: null, nullable: true })
  errors: { [key: string]: any };
}

export class LoginUserDto {
  @ApiProperty({ example: 'test1@denrox.com' })
  email: string;
  @ApiProperty({ example: 'test11' })
  password: string;
}
