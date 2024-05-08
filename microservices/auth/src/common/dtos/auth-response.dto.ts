import { Exclude } from 'class-transformer';

export class AuthResponseDto {
  id: number;

  email: string;

  username: string;

  profilePublicId: string;

  country: string;

  profilePicture: string;

  @Exclude()
  emailVerified: boolean;

  browserName: string;

  deviceType: string;

  @Exclude()
  otp: string;

  @Exclude()
  otpExpiration: Date;

  createdAt: Date;

  @Exclude()
  passwordResetToken: string;

  @Exclude()
  passwordResetExpires: Date;

  @Exclude()
  password: string;

  @Exclude()
  emailVerificationToken: string;
}
