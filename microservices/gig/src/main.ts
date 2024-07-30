import { NestFactory } from '@nestjs/core';
import { GigModule } from './gig.module';

async function bootstrap() {
  const app = await NestFactory.create(GigModule);
  await app.listen(3000);
}
bootstrap();
