import pool from 'database/pool';
import { Request, Response, NextFunction } from 'express';
import { USER } from 'database/queries';
import { ReqUser, ValidateUser } from 'types/app';
import { validatePassword } from 'utils';

export const isValidPassword = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> =>
  pool
    .query(USER.VALIDATE_PASSWORD, (req.user as ReqUser).id)
    .then(([rows]) => {
      const { prePassword } = req.body;
      const { hash, salt } = (rows as ValidateUser[])[0];
      if (!validatePassword({ password: prePassword, hash, salt })) {
        // 403 : 무언가를 하려면 인증을 해야 하는데, 그에 대한 데이터를 보내지 않음
        // 401 : 데이터를 보냈지만 틀림
        return res
          .status(403)
          .json({ message: '현재 비밀번호가 일치하지 않습니다.' })
          .end();
      }
      return next();
    })
    .catch(next);
