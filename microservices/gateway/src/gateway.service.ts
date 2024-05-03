import { NOTIFICATIONS_SERVICE } from '@freedome/common';
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs/operators';

@Injectable()
export class GatewayService {
  constructor(
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly clientNotificationsService: ClientProxy,
  ) {}

  //POST parameter from API
  justHello(postName: string, postPhone: string, postPrice: number) {
    const pattern = { cmd: 'just_hello' };
    const payload = { name: postName, phone: postPhone, price: postPrice };
    return this.clientNotificationsService
      .send<string>(pattern, payload)
      .pipe(map((message: string) => ({ message })));
  }
}
