import * as crypto from 'crypto';
export const getRandomCharacters = async (): Promise<string> => {
  const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
  const randomCharacters: string = randomBytes.toString('hex');
  return randomCharacters;
};
