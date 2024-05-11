import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  Matches,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MinLength,
  MaxLength,
  IsAlphanumeric,
  Length,
} from 'class-validator';
import { IAuthDocument } from '../interfaces';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @IsAlphanumeric()
  @Length(4, 16)
  @Transform(({ value }) => value.toLowerCase())
  @IsNotEmpty({ message: 'Username is a required field' })
  username: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(32, { message: 'Maximum password length is 32 characters' })
  @IsNotEmpty({ message: 'Password is a required field' })
  password: string;

  @IsString()
  @Length(4, 32)
  @IsNotEmpty({ message: 'Country is a required field' })
  country: string;

  @IsEmail(undefined, { message: 'Invalid email' })
  @Length(4, 32)
  @IsNotEmpty({ message: 'Email is a required field' })
  email: string;

  @IsOptional()
  profilePicture: string;

  @IsString()
  @Length(4, 32)
  @IsOptional()
  browserName: string;

  @IsString()
  @Length(4, 32)
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
  user: IAuthDocument;
  token: string;
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
  @ApiProperty({
    example: 'example@example.com',
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(12)
  password: string;

  @ApiProperty({
    example: 'Chrome',
  })
  @IsString()
  @IsOptional()
  browserName: string;

  @ApiProperty({
    example: 'Mobile',
  })
  @IsString()
  @IsOptional()
  deviceType: string;
}

export class EmailDto {
  @ApiProperty({
    example: 'example@example.com',
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class PasswordDto {
  @ApiProperty({
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(12)
  password: string;

  @ApiProperty({
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  @Matches('password')
  confirmPassword: string;
}

export class ChangePasswordDto {
  @ApiProperty({
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(8)
  currentPassword: string;

  @ApiProperty({
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(12)
  newPassword: string;
}
