import jwt from 'express-jwt';
import { secret } from 'config/env';
import { Request } from 'express';

const getTokenFromHeader = (req: Request): string | null => {
  if (
    (req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Token') ||
    (req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Bearer')
  ) {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
};

export default {
  required: jwt({
    secret,
    getToken: getTokenFromHeader,
  }),
};
