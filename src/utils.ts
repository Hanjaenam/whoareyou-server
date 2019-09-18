import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { secret } from 'config/env';
import { RowDataPacket, OkPacket } from 'mysql';
import { Response } from 'express';
import { PwdHashSalt } from 'types/database/user';
import {
  ArticleTemplate,
  Article2,
  Creator,
  Photo,
  LikeNumber,
  CommentNumber,
  IsLiked,
  IsBookmarked,
  Comment,
} from 'types/articleTemplate';
import { USER, PHOTO, FAVORITE, COMMENT, BOOKMARK } from 'database/queries';
import pool from 'database/pool';
import { Jwt } from 'types/reqUser';

export const dbQueryToStr = (obj: Record<string, string | null>): string =>
  Object.keys(obj)
    .filter(key => obj[key] !== undefined)
    .map(key => {
      let value = '';
      if (typeof obj[key] === 'string') value = `"${obj[key]}"`;
      if (typeof obj[key] === 'boolean') {
        if (obj[key]) value = 'True';
        else value = 'False';
      }
      if (obj[key] === null) value = 'NULL';
      return `${key}=${value}`;
    })
    .join();

export const generateJwt = (id: number): string =>
  jwt.sign(
    {
      id,
    },
    secret,
    { expiresIn: '24h' },
  );

export const generatePbkdf2 = (
  password: string,
): { salt: string; hash: string } => {
  const salt = crypto.randomBytes(32).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 10, 32, 'sha512')
    .toString('hex');
  return { salt, hash };
};

export const validatePassword = ({
  password,
  hash,
  salt,
}: PwdHashSalt): boolean =>
  crypto.pbkdf2Sync(password, salt, 10, 32, 'sha512').toString('hex') === hash;

export const checkUpdated = (
  rows: RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[],
  res: Response,
  data?: any,
): void => {
  if ((rows as OkPacket).affectedRows === 0) return res.status(500).end();
  else if (data) return res.json(data).end();
  return res.json(200).end();
};

export const isUpdated = (
  rows: RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[],
): boolean => (rows as OkPacket).affectedRows !== 0;

export const articleDataTemplate = async (
  user: Express.User,
  rows: RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[],
): Promise<ArticleTemplate[]> => {
  const articles = rows as Article2[];
  const creators = articles.map(article =>
    pool.query(USER.GET.ONE.ID_NM_AVT_WR_ID, [article.creator]),
  );
  const photos = articles.map(article =>
    pool.query(PHOTO.GET.ONE.ID_LOC_WR_ARTICLE, [article.id]),
  );
  const likes = articles.map(article =>
    pool.query(FAVORITE.COUNT, [article.id]),
  );
  const commentNumber = articles.map(article =>
    pool.query(COMMENT.COUNT, [article.id]),
  );
  const comments = articles.map(article =>
    pool.query(COMMENT.GET.ONE.BASIC, [article.id]),
  );
  const isLiked =
    user &&
    articles.map(article =>
      pool.query(FAVORITE.IS_LIKED, [article.id, (user as Jwt).id]),
    );
  const isBookmarked =
    user &&
    articles.map(article =>
      pool.query(BOOKMARK.IS_BOOKMARK, [article.id, (user as Jwt).id]),
    );

  try {
    const creatorRes = await Promise.all(creators);
    const photRes = await Promise.all(photos);
    const likeRes = await Promise.all(likes);
    const commntNumRes = await Promise.all(commentNumber);
    const comntRes = await Promise.all(comments);
    const isLikedRes = isLiked ? await Promise.all(isLiked) : undefined;
    const isBokmkedRes = isBookmarked
      ? await Promise.all(isBookmarked)
      : undefined;
    const data = articles.map((article, index) => ({
      // any[index][0] 여기까진 고정 그 뒤 [0]부턴 row가 있다는 뜻
      ...article,
      creator: (creatorRes[index][0] as Creator[])[0],
      photos: photRes[index][0] as Photo[],
      likeNumber: (likeRes[index][0] as LikeNumber[])[0].count,
      commentNumber: (commntNumRes[index][0] as CommentNumber[])[0].count,
      comments: comntRes[index][0] as Comment[],
      isLiked: user ? (isLikedRes[index][0] as IsLiked[]).length === 1 : false,
      isBookmarked: user
        ? (isBokmkedRes[index][0] as IsBookmarked[]).length === 1
        : false,
    }));
    return data;
  } catch (error) {
    throw new Error(error);
  }
};
