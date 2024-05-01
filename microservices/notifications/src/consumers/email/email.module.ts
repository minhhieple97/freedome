import { Module, Scope } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { AppConfigModule } from '../../config/app/config.module';
import { INQUIRER } from '@nestjs/core';
import { LoggerModule, LoggerService } from '@app/common';

@Module({
  imports: [AppConfigModule, LoggerModule],
  controllers: [EmailController],
  providers: [
    EmailService,
    {
      provide: LoggerService,
      scope: Scope.TRANSIENT,
      inject: [INQUIRER],
      useFactory: (parentClass: object) =>
        new LoggerService(parentClass.constructor.name),
    },
  ],
  exports: [EmailService],
})
export class EmailModule {}
