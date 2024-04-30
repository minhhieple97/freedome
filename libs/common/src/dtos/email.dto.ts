import { IsEmail, IsString } from 'class-validator';

export class EmailAuthDataEventDto {
  @IsEmail()
  receiverEmail: string;

  @IsString()
  username: string;

  @IsString()
  verifyLink: string;

  @IsString()
  resetLink: string;

  @IsString()
  template: string;

  @IsString()
  otp: string;
}
