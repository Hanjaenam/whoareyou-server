import pool from 'database/pool';
import { checkUpdated, generatePbkdf2, articleDataTemplate } from 'utils';
import { Basic } from 'types/database/user';
import { Jwt } from 'types/reqUser';
import { Request, Response, NextFunction } from 'express';
import USER from 'database/queries/user';
import ARTICLE from 'database/queries/article';

export const getMe = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> =>
  pool
    .query(USER.GET.ONE.BASIC('id'), [(req.user as Jwt).id])
    .then(([rows]) => res.json((rows as Basic[])[0]).end())
    .catch(next);

export const getArticle = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> =>
  pool
    .query(ARTICLE.GET.ALL.WR_CREATOR(req.query.page), [req.params.id])
    .then(async ([rows]) => {
      try {
        const data = await articleDataTemplate(req.user, rows);
        return res.json(data).end();
      } catch (error) {
        return next(error);
      }
    })
    .catch(next);

// export const getAll = (
//   _: Request,
//   res: Response,
//   next: NextFunction,
// ): Promise<void> =>
//   pool
//     .query(USER.GET_ALL)
//     .then(([rows]) => res.json(rows).end())
//     .catch(next);

export const getOne = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> =>
  pool
    .query(USER.GET.ONE.BASIC('id'), [req.params.id])
    .then(([rows]) => res.json((rows as Basic[])[0]).end())
    .catch(next);

export const remove = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> =>
  pool
    .query(USER.REMOVE, [(req.user as Jwt).id])
    .then(([rows]) => checkUpdated(rows, res))
    .catch(next);

export const patch = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> | void => {
  const {
    body: { name, avatar, introduce },
  } = req;
  return pool
    .query(
      USER.PATCH({
        name,
        avatar,
        introduce,
      }),
      [(req.user as Jwt).id],
    )
    .then(([rows]) => checkUpdated(rows, res))
    .catch(next);
};

export const changePassword = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { newPassword } = req.body;
  const { salt, hash } = generatePbkdf2(newPassword);
  return pool
    .query(USER.PATCH({ hash, salt }), [(req.user as Jwt).id])
    .then(([rows]) => checkUpdated(rows, res))
    .catch(next);
};

export const patchAvatar = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> | void =>
  pool
    .query(USER.PATCH({ avatar: req.file.location }), [(req.user as Jwt).id])
    .then(([rows]) => checkUpdated(rows, res, req.file.location))
    .catch(next);
