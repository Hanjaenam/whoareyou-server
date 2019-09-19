import { Request, Response, NextFunction } from 'express';
import pool from 'database/pool';
import { ARTICLE, COMMENT } from 'database/queries';
import { OnlyId } from 'types/database/user';
import { OnlyCreator } from 'types/database/article';
import { Jwt } from 'types/reqUser';

export const isExistedArticle = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> =>
  pool
    .query(ARTICLE.GET.ONE.ID, [req.params.articleId])
    .then(([rows]) =>
      (rows as OnlyId[]).length === 0 ? res.status(204).end() : next(),
    )
    .catch(next);

export const isMine = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> =>
  pool
    .query(COMMENT.GET.ONE.CREATOR, [req.params.id])
    .then(([rows]) =>
      (rows as OnlyCreator[])[0].creator === (req.user as Jwt).id
        ? next()
        : res.status(403).end(),
    )
    .catch(next);
