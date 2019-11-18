import pool from 'database/pool';
import { Request, Response, NextFunction } from 'express';
import { USER } from 'database/queries';
import { validatePassword } from 'utils';
import { HashSalt, Basic } from 'types/database/user';
import { Jwt } from 'types/reqUser';
import { OnlyAvatar } from 'types/database/user';
import s3 from 'config/awsS3';
import { ErrorWithStatus } from 'types/error';

export const isValidPassword = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> =>
  pool
    .query(USER.VALIDATE_PASSWORD, (req.user as Jwt).id)
    .then(([rows]) => {
      const { prePassword } = req.body;
      const { hash, salt } = (rows as HashSalt[])[0];
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

export const removePreAvatar = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | AWS.Request<AWS.S3.DeleteObjectOutput, AWS.AWSError>> =>
  pool
    .query(USER.GET.ONE.AVT_WR_ID, (req.user as Jwt).id)
    .then(([rows]) => {
      const { avatar } = (rows as OnlyAvatar[])[0];
      if (avatar) {
        //https://whoareyou-community-file.s3.ap-northeast-2.amazonaws.com/avatars/bc0a8e5e1a6aa111d48bf9ccc2783646
        const Key = avatar.substr(avatar.indexOf('avatars'));
        return s3.deleteObject(
          {
            Bucket: process.env.BUCKET,
            Key,
          },
          (err: Error, _: AWS.S3.DeleteObjectOutput) =>
            err ? next(err) : next(),
        );
      }

      return next();
    })
    .catch(next);

export const getOneCheckLogin = (
  err: ErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction,
): void | Promise<void> =>
  err.name === 'UnauthorizedError'
    ? pool
        .query(USER.GET.ONE.BASIC, [req.params.id])
        .then(([rows]) => res.json((rows as Basic[])[0]).end())
        .catch(next)
    : next();
