import pool from 'database/pool';
import s3 from 'config/awsS3';
import { Request, Response, NextFunction } from 'express';
import { ARTICLE, PHOTO } from 'database/queries';
import { OnlyCreator } from 'types/database/article';
import { Jwt } from 'types/reqUser';
import { S3 } from 'aws-sdk';

export const isMine = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> =>
  pool
    .query(ARTICLE.GET.ONE.CREATOR, [req.params.id])
    .then(([rows]) =>
      (rows as OnlyCreator[])[0].creator !== (req.user as Jwt).id
        ? // 허가 실패 - 403
          res.status(403).end()
        : next(),
    )
    .catch(next);

export const removePhotos = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> =>
  pool
    .query(PHOTO.GET.ALL.LOC_WR_ARTICLE, [req.params.id])
    .then(([rows]) => {
      const locations = rows as { location: string }[];

      const params: S3.DeleteObjectsRequest = {
        Bucket: process.env.BUCKET,
        Delete: {
          Objects: locations.map(data => ({
            Key: data.location.substr(data.location.indexOf('articles')),
          })),
          Quiet: false,
        },
      };
      s3.deleteObjects(params, (err: Error, _: AWS.S3.DeleteObjectsOutput) =>
        err ? next(err) : next(),
      );
    })
    .catch(next);
