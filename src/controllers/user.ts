import pool from 'database/pool';
import { checkUpdated, generatePbkdf2 } from 'utils';
import { User, ReqUser } from 'types/app';
import { Request, Response, NextFunction } from 'express';
import { USER } from 'database/queries';

export const getMe = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> =>
  pool
    .query(USER.GET_ONE('id'), (req.user as ReqUser).id)
    .then(([rows]) => res.json((rows as User[])[0]).end())
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

// export const getOne = (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ): Promise<void> =>
//   pool
//     .query(USER.GET_ONE('id'), [req.params.id])
//     .then(([rows]) => res.json((rows as [User])[0]).end())
//     .catch(next);

export const remove = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> =>
  pool
    .query(USER.DELETE, [(req.user as User).id])
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
      [(req.user as User).id],
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
    .query(USER.PATCH({ hash, salt }), [(req.user as ReqUser).id])
    .then(([rows]) => checkUpdated(rows, res))
    .catch(next);
};

export const patchAvatar = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> | void =>
  pool
    .query(USER.PATCH({ avatar: req.file.location }), [
      (req.user as ReqUser).id,
    ])
    .then(([rows]) => checkUpdated(rows, res, req.file.location))
    .catch(next);
