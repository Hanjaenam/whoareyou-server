import aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { Request, Response, NextFunction } from 'express';
import pool from 'database/pool';
import USER from 'database/queries/user';
import { Jwt } from 'types/reqUser';
import { OnlyAvatar } from 'types/database/user';

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: 'ap-northeast-2',
});

export const removePreAvatar = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | aws.Request<aws.S3.DeleteObjectOutput, aws.AWSError>> =>
  pool
    .query(USER.GET.ONE.AVT_WR_ID, (req.user as Jwt).id)
    .then(([rows]) => {
      const { avatar } = (rows as OnlyAvatar[])[0];
      if (avatar) {
        const Key = avatar.slice(avatar.lastIndexOf('/') + 1);
        return s3.deleteObject(
          {
            Bucket: 'whoareyou-community-file/user',
            Key,
          },
          (err: Error, _: aws.S3.DeleteObjectOutput) =>
            err ? next(err) : next(),
        );
      }

      return next();
    })
    .catch(next);

export default (bucket: 'user' | 'article'): multer.Instance =>
  multer({
    storage: multerS3({
      s3,
      bucket: `whoareyou-community-file/${bucket}`,
      acl: 'public-read',
    }),
  });
