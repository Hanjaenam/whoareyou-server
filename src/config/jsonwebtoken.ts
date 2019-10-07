import jwt from 'jsonwebtoken';
import { secret } from './env';

export const generateJwt = (id: number): string =>
  jwt.sign(
    {
      id,
    },
    secret,
    { expiresIn: '24h' },
  );
