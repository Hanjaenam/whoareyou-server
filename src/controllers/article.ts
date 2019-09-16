import pool from 'database/pool';
import {
  ARTICLE,
  PHOTO,
  USER,
  FAVORITE,
  COMMENT,
  BOOKMARK,
} from 'database/queries';
import { Request, Response, NextFunction } from 'express';
import { User, Article, ReqUser } from 'types/app';
import { checkUpdated, isUpdated } from 'utils';
import { OkPacket, RowDataPacket } from 'mysql';

export const getAll = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const {
    query: { page = 0 },
  } = req;
  return pool
    .query(ARTICLE.GET_ALL(page))
    .then(async ([rows]) => {
      const articles = rows as Article[];
      const creators = articles.map(article =>
        pool.query(USER.M_GET_ONE, [article.creator]),
      );
      const photos = articles.map(article =>
        pool.query(PHOTO.GET_BY_ARTICLE, [article.id]),
      );
      const likes = articles.map(article =>
        pool.query(FAVORITE.COUNT, [article.id]),
      );
      const commentNumber = articles.map(article =>
        pool.query(COMMENT.COUNT, [article.id]),
      );
      const comments = articles.map(article =>
        pool.query(COMMENT.GET_BY_ARTICLE, [article.id]),
      );
      const isLiked =
        req.user &&
        articles.map(article =>
          pool.query(FAVORITE.IS_LIKED, [article.id, (req.user as ReqUser).id]),
        );
      const isBookmarked =
        req.user &&
        articles.map(article =>
          pool.query(BOOKMARK.IS_BOOKMARK, [
            article.id,
            (req.user as ReqUser).id,
          ]),
        );

      try {
        const creatRes = await Promise.all(creators);
        const photRes = await Promise.all(photos);
        const likeRes = await Promise.all(likes);
        const commntNumRes = await Promise.all(commentNumber);
        const comntRes = await Promise.all(comments);
        const isLikedRes = isLiked ? await Promise.all(isLiked) : undefined;
        const isBokmkedRes = isBookmarked
          ? await Promise.all(isBookmarked)
          : undefined;
        const data = articles.map((article, index) => ({
          ...article,
          creator: (creatRes[index] as RowDataPacket)[0][0],
          photos: photRes[index][0],
          likeNumber: (likeRes[index] as RowDataPacket)[0][0].count,
          commentNumber: (commntNumRes[index] as RowDataPacket)[0][0].count,
          comments: comntRes[index][0],
          isLiked: req.user
            ? (isLikedRes[index] as RowDataPacket)[0][0] || false
            : false,
          isBookmarked: req.user
            ? (isBokmkedRes[index] as RowDataPacket)[0][0] || false
            : false,
        }));
        return res.json(data).end();
      } catch (error) {
        return next(error);
      }
    })
    .catch(next);
};

export const getOne = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> =>
  pool
    .query(ARTICLE.GET_ONE, [req.params.id])
    .then(([rows]) => {
      const article = (rows as Article[])[0];
      pool
        .query(PHOTO.GET_BY_ARTICLE, [article.id])
        .then(([rows]) => res.json({ ...article, files: rows }).end())
        .catch(next);
    })
    .catch(next);

// { fieldname: 'photos',
// originalname: 'Earth+8-2880x1800.jpg',
// encoding: '7bit',
// mimetype: 'image/jpeg',
// size: 1125349,
// bucket: 'whoareyou-community-file/article',
// key: 'c94c3fa350a456b78fade0e977502386',
// acl: 'public-read',
// contentType: 'application/octet-stream',
// contentDisposition: null,
// storageClass: 'STANDARD',
// serverSideEncryption: null,
// metadata: null,
// location:
//   'https://whoareyou-community-file.s3.ap-northeast-2.amazonaws.com/article/c94c3fa350a456b78fade0e977502386',
// etag: '"8b9e9138b343cbf60db7c258c0438364"',
// versionId: undefined }
export const create = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const {
    files,
    body: { content },
  } = req;
  pool
    .query(ARTICLE.CREATE, [content, (req.user as User).id])
    .then(([rows]) => {
      if (!isUpdated) return res.status(500).end();
      const article = rows as OkPacket;
      const fileArr = files as Express.Multer.File[];

      pool
        .query(PHOTO.CREATE_MANY, [
          fileArr.map(file => [article.insertId, file.location]),
        ])
        .then(([rows2]) => checkUpdated(rows2, res))
        .catch(next);
    })
    .catch(next); // ARTICLE.CREATE
};

export const remove = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> =>
  pool
    .query(ARTICLE.REMOVE, [req.params.id, (req.user as User).email])
    .then(([rows]) => checkUpdated(rows, res))
    .catch(next);

export const patch = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const {
    body: { title, content },
  } = req;
  return pool
    .query(ARTICLE.PATCH(title, content), [(req.user as User).email])
    .then(([rows]) => checkUpdated(rows, res))
    .catch(next);
};
