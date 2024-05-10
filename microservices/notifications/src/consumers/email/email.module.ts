import { Module, Scope } from '@nestjs/common';
import { EmailService } from './email.service';
import { INQUIRER } from '@nestjs/core';
import { LoggerModule, LoggerService } from '@freedome/common';
import { AppConfigModule } from '@notifications/config/app/config.module';

@Module({
  imports: [AppConfigModule, LoggerModule],
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
