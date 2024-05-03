import * as shell from 'shelljs';

shell.cp(
  '-R',
  'microservices/notifications/src/config/email-templates',
  'dist/microservices/notifications',
);
