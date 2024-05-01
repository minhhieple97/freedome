import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsUrl,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class EmailAuthEventDto {
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

export class EmailOrderEventDto {
  @IsEmail()
  @IsNotEmpty()
  receiverEmail: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  template: string;

  @IsString()
  @IsNotEmpty()
  sender: string;

  @IsUrl()
  @IsNotEmpty()
  offerLink: string;

  @IsString()
  @IsNotEmpty()
  amount: string;

  @IsString()
  @IsNotEmpty()
  buyerUsername: string;

  @IsString()
  @IsNotEmpty()
  sellerUsername: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  deliveryDays: string;

  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsDateString()
  @IsNotEmpty()
  orderDue: string;

  @IsString()
  @IsOptional()
  requirements: string;

  @IsUrl()
  @IsNotEmpty()
  orderUrl: string;

  @IsString()
  @IsNotEmpty()
  originalDate: string;

  @IsString()
  @IsNotEmpty()
  newDate: string;

  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  header: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  serviceFee: string;

  @IsString()
  @IsNotEmpty()
  total: string;
}
