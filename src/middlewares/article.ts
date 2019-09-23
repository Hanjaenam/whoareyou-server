import pool from 'database/pool';
import s3 from 'config/awsS3';
import { Request, Response, NextFunction } from 'express';
import { PHOTO } from 'database/queries';
import { S3 } from 'aws-sdk';

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
