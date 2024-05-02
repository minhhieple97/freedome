import JWT from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { UnauthorizedException } from '@nestjs/common';
const tokens: string[] = [
  'auth',
  'seller',
  'gig',
  'search',
  'buyer',
  'message',
  'order',
  'review',
];

export const verifyGatewayRequest = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  if (!req.headers?.gatewaytoken) {
    throw new UnauthorizedException(
      'Invalid request',
      'verifyGatewayRequest() method: Request not coming from api gateway',
    );
  }
  const token: string = req.headers?.gatewaytoken as string;
  if (!token) {
    throw new UnauthorizedException(
      'Invalid request',
      'verifyGatewayRequest() method: Request not coming from api gateway',
    );
  }

  try {
    const payload: { id: string; iat: number } = JWT.verify(
      token,
      '1282722b942e08c8a6cb033aa6ce850e',
    ) as { id: string; iat: number };
    if (!tokens.includes(payload.id)) {
      throw new UnauthorizedException(
        'Invalid request',
        'verifyGatewayRequest() method: Request payload is invalid',
      );
    }
  } catch (error) {
    throw new UnauthorizedException(
      'Invalid request',
      'verifyGatewayRequest() method: Request not coming from api gateway',
    );
  }
  next();
};
