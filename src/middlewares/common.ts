import expressJwt from 'config/expressJwt';
import { Request, Response, NextFunction } from 'express';
import { ErrorWithStatus } from 'types/error';
import pool from 'database/pool';
import { COMMENT, ARTICLE, FAVORITE, BOOKMARK } from 'database/queries';
import { OnlyCreator } from 'types/database/article';
import { Jwt } from 'types/reqUser';
import { OnlyId } from 'types/database/user';

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

export const isMine = (
  queryType: 'article' | 'comment' | 'favorite' | 'bookmark',
): ((req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  let query = '';
  let id = '';
  switch (queryType) {
    case 'article':
      query = ARTICLE.GET.ONE.CREATOR;
      id = 'id';
      break;
    case 'comment':
      query = COMMENT.GET.ONE.CREATOR;
      id = 'id';
      break;
    case 'favorite':
      query = FAVORITE.GET.ONE.CREATOR;
      id = 'article';
      break;
    case 'bookmark':
      query = BOOKMARK.GET.ONE.CREATOR;
      id = 'article';
      break;
    default:
      throw new Error('common Middleware no Params');
  }
  return (req: Request, res: Response, next: NextFunction): Promise<void> =>
    pool
      .query(query, [
        id === 'article' ? req.params.articleId : req.params.id,
        (req.user as Jwt).id,
      ])
      .then(([rows]) =>
        (rows as OnlyCreator[]).length === 1 ? next() : res.status(403).end(),
      )
      .catch(next);
};

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
