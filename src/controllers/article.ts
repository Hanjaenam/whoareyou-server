import pool from 'database/pool';
import { ARTICLE } from 'database/queries';
import { Request, Response, NextFunction } from 'express';
import { User } from 'types/app';
import { checkUpdated } from 'utils';

export const getAll = (
  _: Request,
  res: Response,
  next: NextFunction,
): Promise<void> =>
  pool
    .query(ARTICLE.GET_ALL)
    .then(([rows]) => res.json((rows as [any])[0]).end())
    .catch(next);

export const getOne = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> =>
  pool
    .query(ARTICLE.GET_ONE, [req.params.id])
    .then(([rows]) => res.json(rows).end())
    .catch(next);

export const create = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> =>
  pool
    .query(ARTICLE.CREATE, [
      req.body.title,
      req.body.content,
      (req.user as User).email,
    ])
    .then(([rows]) => checkUpdated(rows, res))
    .catch(next);

export const remove = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> =>
  pool
    .query(ARTICLE.REMOVE, [req.params.id, (req.user as User).email])
    .then(([rows]) => checkUpdated(rows, res))
    .catch(next);

export const patch = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const {
    body: { title, content },
  } = req;
  return pool
    .query(ARTICLE.PATCH(title, content), [(req.user as User).email])
    .then(([rows]) => checkUpdated(rows, res))
    .catch(next);
};
