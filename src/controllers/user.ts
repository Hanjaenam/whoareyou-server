import pool from 'database/pool';
import {
  checkUpdated,
  generatePbkdf2,
  articleDataTemplate,
  isUpdated,
} from 'utils';
import { Basic } from 'types/database/user';
import { Jwt } from 'types/reqUser';
import { Request, Response, NextFunction } from 'express';
import { USER, ARTICLE, FOLLOW } from 'database/queries';
import expressJwt from 'config/expressJwt';

export const getAll = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> =>
  pool
    .query(USER.GET.ALL, [(req.user as Jwt).id, (req.user as Jwt).id])
    .then(([rows]) => res.json(rows).end())
    .catch(next);

export const getMe = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  return pool
    .query(USER.GET.ONE.BASIC, [(req.user as Jwt).id])
    .then(([rows]) =>
      pool
        .query(FOLLOW.GET.ALL, [(req.user as Jwt).id])
        .then(([rows2]) =>
          res.json({ ...(rows as Basic[])[0], follows: rows2 }).end(),
        ),
    )
    .catch(next);
};

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

export const getOne = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> =>
  pool
    .query(USER.GET.ONE.FOLLOW, [
      (req.user as Jwt).id,
      req.params.id,
      req.params.id,
    ])
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
    .then(([rows]) => {
      if (!isUpdated(rows)) return res.status(500).end();
      return res.json(req.file.location).end();
    })
    .catch(next);

export const search = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> =>
  pool
    .query(USER.SEARCH, ['%' + req.query.name + '%'])
    .then(([rows]) => res.json(rows).end())
    .catch(next);
