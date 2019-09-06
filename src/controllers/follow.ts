import pool from 'database/pool';
import { User } from 'types/app';
import { FOLLOW } from 'database/queries';
import { Request, Response, NextFunction } from 'express';
import { checkUpdated } from 'utils';

export const follow = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> =>
  pool
    .query(FOLLOW.CREATE, [(req.user as User).email, req.body.to])
    .then(([rows]) => checkUpdated(rows, res))
    .catch(next);

export const unfollow = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> =>
  pool
    .query(FOLLOW.DELETE, [(req.user as User).email, req.body.to])
    .then(([rows]) => checkUpdated(rows, res))
    .catch(next);
