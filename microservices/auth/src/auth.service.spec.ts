import { Test } from '@nestjs/testing';
import { Auth } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { v4 as uuidV4 } from 'uuid';
import { getRandomCharacters } from './common/helpers/random.helper';
describe('The AuthenticationService', () => {
  let userData: Partial<Auth>;
  let authenticationService: AuthService;
  let password: string;
  beforeEach(async () => {
    password = 'strongPassword123';
    const hashedPassword = await bcrypt.hash(password, 10);
    userData = {
      id: 1,
      email: 'john@smith.com',
      username: 'hieple',
      password: hashedPassword,
      country: 'vietnam',
      browserName: 'chrome',
      deviceType: 'browser',
      profilePublicId: uuidV4(),
      emailVerificationToken: await getRandomCharacters(),
    };
    const module = await Test.createTestingModule({
      providers: [AuthService],
      imports: [],
    }).compile();

    authenticationService = await module.get(AuthService);
  });
  describe('when calling the createUser method', () => {
    // it('should return a new user and access token, refesh token', () => {});
  });
});
