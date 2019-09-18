import expressJwt from 'config/expressJwt';
import { Request, Response, NextFunction } from 'express';
import { ErrorWithStatus } from 'types/error';

export const requiredData = (args: string[]) => (
  req: Request,
  res: Response,
  next: NextFunction,
): Response | void => {
  const emptyKeys = args.filter(arg => req.body[arg] === undefined);
  if (emptyKeys.length !== 0)
    return res
      .status(422)
      .json({ message: `${emptyKeys.join()} can't be blank` })
      .end();
  return next();
};

export const haveAtLeastOneData = (args: string[]) => (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const isEveryEmpty = args.every(arg => req.body[arg] === undefined);
  if (isEveryEmpty)
    return res
      .status(422)
      .json({ message: 'there is no data to change' })
      .end();
  return next();
};

export const tokenErrorHandling = (
  err: ErrorWithStatus,
  _: Request,
  res: Response,
  next: NextFunction,
): Response | void =>
  err.name === 'UnauthorizedError'
    ? res
        .status(401)
        .json({ message: 'invalid token' })
        .end()
    : next();

export const authRequired = [expressJwt.required, tokenErrorHandling];
