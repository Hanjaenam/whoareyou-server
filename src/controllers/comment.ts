import pool from 'database/pool';
import { COMMENT } from 'database/queries';
import { Request, Response, NextFunction } from 'express';
import { Jwt } from 'types/reqUser';
import { checkUpdated } from 'utils';
import { OkPacket } from 'mysql';
import { Basic } from 'types/database/comment';

export const getAll = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const {
    query: { page = 0 },
  } = req;
  return pool
    .query(COMMENT.GET.ALL(page), [req.params.articleId])
    .then(([rows]) => res.json(rows).end())
    .catch(next);
};

export const create = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> =>
  pool
    .query(COMMENT.CREATE, [
      req.params.articleId,
      (req.user as Jwt).id,
      req.body.content,
    ])
    .then(([rows]) => {
      const affected = rows as OkPacket;
      if (affected.affectedRows === 0) return res.status(500).end();
      pool
        .query(COMMENT.GET.ONE.USING_CREATE, [
          affected.insertId,
          (req.user as Jwt).id,
        ])
        .then(([rows]) => res.json((rows as Basic[])[0]).end())
        .catch(next);
    })
    .catch(next);

export const remove = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> =>
  pool
    .query(COMMENT.REMOVE, [req.params.id])
    .then(([rows]) => checkUpdated(rows, res))
    .catch(next);

export const patch = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> =>
  pool
    .query(COMMENT.PATCH, [req.body.content, req.params.id])
    .then(([rows]) => checkUpdated(rows, res))
    .catch(next);
