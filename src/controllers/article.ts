import pool from 'database/pool';
import { USER, ARTICLE, PHOTO, BOOKMARK } from 'database/queries';
import { Request, Response, NextFunction } from 'express';
import { Basic } from 'types/database/article';
import { checkUpdated, isUpdated, articleDataTemplate } from 'utils';
import { OkPacket } from 'mysql';
import { IdNameAvt } from 'types/database/user';
import { Jwt } from 'types/reqUser';

export const getAll = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  let query = '';
  const {
    query: { page },
  } = req;
  switch (req.params.category) {
    case 'latest':
      query = ARTICLE.GET.ALL.BASIC(page);
      break;
    case 'like':
      query = ARTICLE.GET.ALL.FAVORITE(page);
      break;
    case 'bookmark':
      query = ARTICLE.GET.ALL.BOOKMARK(page);
      break;
    default:
      throw new Error('article getAll no params');
  }
  return pool
    .query(query)
    .then(async ([rows]) => {
      try {
        const data = await articleDataTemplate(req.user, rows);
        return res.json(data).end();
      } catch (error) {
        return next(error);
      }
    })
    .catch(next);
};

// article id 사용
export const getOne = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> =>
  pool
    .query(ARTICLE.GET.ONE.BASIC, [req.params.id])
    .then(([rows]) => {
      const article = (rows as Basic[])[0];
      pool
        .query(PHOTO.GET.ONE.ID_LOC_WR_ARTICLE, [article.id])
        .then(([rows]) => res.json({ ...article, files: rows }).end())
        .catch(next);
    })
    .catch(next);

export const getCreator = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> =>
  pool
    .query(ARTICLE.GET.ONE.CREATOR, [req.params.id])
    .then(([rows]) => {
      const article = (rows as { creator: number }[])[0];
      pool
        .query(USER.GET.ONE.ID_NM_AVT_WR_ID, [article.creator])
        .then(([rows2]) => res.json((rows2 as IdNameAvt[])[0]).end())
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
    .query(ARTICLE.CREATE, [content, (req.user as Jwt).id])
    .then(([rows]) => {
      if (!isUpdated) return res.status(500).end();
      const article = rows as OkPacket;
      const fileArr = files as Express.Multer.File[];

      pool
        .query(PHOTO.CREATE.MANY, [
          fileArr.map(file => [article.insertId, file.location]),
        ])
        .then(([rows2]) => checkUpdated(rows2, res))
        .catch(next);
    })
    .catch(next); // ARTICLE.CREATE
};

// query 해당하는 row 없을 시
// ResultSetHeader {
//   fieldCount: 0,
//   affectedRows: 0,
//   insertId: 0,
//   info: '',
//   serverStatus: 2,
//   warningStatus: 0 }
// 있을 시
// ResultSetHeader {
//   fieldCount: 0,
//   affectedRows: 1,
//   insertId: 0,
//   info: '',
//   serverStatus: 2,
//   warningStatus: 0 }
export const remove = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> =>
  pool
    .query(ARTICLE.REMOVE, [req.params.id, (req.user as Jwt).id])
    .then(([rows]) => {
      console.log('remove');
      console.log(rows);
      return checkUpdated(rows, res);
    })
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
    .query(ARTICLE.PATCH(title, content), [req.params.id, (req.user as Jwt).id])
    .then(([rows]) => checkUpdated(rows, res))
    .catch(next);
};
