import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AppConfigModule } from '@gateway/config/app/config.module';
import { AuthService } from './auth.service';

@Module({
  imports: [AppConfigModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
