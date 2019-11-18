import pool from 'database/pool';
import { Request, Response, NextFunction } from 'express';
import { FOLLOW } from 'database/queries';
import { checkUpdated } from 'utils';
import { Jwt } from 'types/reqUser';

export const create = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> =>
  pool
    .query(FOLLOW.CREATE, [(req.user as Jwt).id, req.body.whom])
    .then(([rows]) => checkUpdated(rows, res))
    .catch(next);

export const remove = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> =>
  pool
    .query(FOLLOW.REMOVE, [(req.user as Jwt).id, req.body.whom])
    .then(([rows]) => checkUpdated(rows, res))
    .catch(next);
