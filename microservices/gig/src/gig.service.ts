import { Injectable } from '@nestjs/common';

@Injectable()
export class GigService {
  getHello(): string {
    return 'Hello World!';
  }
}
