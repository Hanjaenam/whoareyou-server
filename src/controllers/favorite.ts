import { Request, Response, NextFunction } from 'express';
import pool from 'database/pool';
import { FAVORITE } from 'database/queries';
import { Jwt } from 'types/reqUser';
import { checkUpdated } from 'utils';

export const create = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> =>
  pool
    .query(FAVORITE.CREATE, [req.params.articleId, (req.user as Jwt).id])
    .then(([rows]) => checkUpdated(rows, res))
    .catch(next);

export const remove = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> =>
  pool
    .query(FAVORITE.REMOVE, [req.params.articleId, (req.user as Jwt).id])
    .then(([rows]) => checkUpdated(rows, res))
    .catch(next);
