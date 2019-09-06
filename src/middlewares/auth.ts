import pool from 'database/pool';
import { Request, Response, NextFunction } from 'express';
import { User } from 'types/app';
import { USER } from 'database/queries';

export const isNotExistedUser = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> =>
  pool
    .query(USER.GET_ONE('email'), [req.body.email])
    .then(([rows]) => {
      if ((rows as User[]).length === 1)
        return res
          .status(409)
          .json({
            message: '이미 사용중인 이메일입니다.',
          })
          .end();
      return next();
    })
    .catch(next);

export const isExistedUser = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> =>
  pool
    .query(USER.GET_ONE('email'), [req.body.email])
    .then(([rows]) => {
      const user = rows as User[];
      if (user.length === 0)
        return res
          .status(404)
          .json({ message: '없는 이메일입니다.' })
          .end();
      req.user = user[0];
      return next();
    })
    // next 인자로 뭐라도 넘기기만 하면 에러는 발생되고 다음으로 넘어가지 않습니다.
    .catch(next);
