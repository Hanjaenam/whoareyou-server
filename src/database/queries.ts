import { dbQueryToStr } from 'utils';

export const PASSPORT_LOGIN =
  'select id, email, name, valid, avatar, introduce, secret, naverId, googleId, createdAt, salt, hash FROM User WHERE email = ?';

export const USER = {
  GET_NAME: 'SELECT name FROM User WHERE id = ?',
  GET_ALL: 'SELECT id, name, avatar, introduce FROM User',

  GET_ONE: (key: 'id' | 'email'): string =>
    `SELECT id, email, name, valid, avatar, introduce, secret, naverId, googleId, createdAt FROM User WHERE ${key}=?`,

  M_GET_ONE: `SELECT id, name, avatar FROM User WHERE id = ?`,

  CREATE: (avatar?: string): string =>
    `INSERT INTO User(email, name, salt, hash, secret ${
      avatar ? `,${avatar}` : ''
    }) VALUES(?, ?, ?, ?, ? ${avatar ? `,${avatar}` : ''})`,

  CREATE_GOOGLE:
    'INSERT INTO User(email, name, googleId, avatar) VALUES(?, ?, ?, ?)',

  CREATE_NAVER:
    'INSERT INTO User(email, name, naverId, avatar) VALUES(?, ?, ?, ?)',

  DELETE: 'DELETE FROM User WHERE id = ?',

  PATCH: (obj: Record<string, any>): string =>
    `UPDATE User SET ${dbQueryToStr(obj)} WHERE id = ?`,

  VALIDATE_PASSWORD: 'select salt, hash FROM User WHERE id = ?',
};

export const ARTICLE = {
  GET_ALL: (start: number): string =>
    `SELECT id, content, creator, createdAt FROM Article LIMIT ${start *
      10} ,${start * 10 + 10}`,

  GET_ONE:
    'SELECT id, title, content, creator, createdAt FROM Article WHERE id = ?',

  CREATE: 'INSERT INTO Article(content, creator) VALUES(?, ?)',

  REMOVE: 'DELETE FROM Article WHERE id = ? AND creator = ?',

  PATCH: (title: string, content: string): string =>
    `UPDATE Article SET ${dbQueryToStr({
      title,
      content,
    })} WHERE id = ? AND creator = ?`,
};

export const PHOTO = {
  GET_BY_ARTICLE: 'SELECT id, location FROM Photo WHERE article = ?',

  CREATE_ONE: 'INSERT INTO PHOTO(article, location) VALUES (?, ?)',

  CREATE_MANY: 'INSERT INTO PHOTO(article, location) VALUES ?',
};

export const COMMENT = {
  COUNT: 'SELECT count(*) as count FROM Comment WHERE article = ?',

  GET_BY_ARTICLE:
    'select C.id, C.content, U.name as creator from Comment as C, User as U WHERE C.article=? AND C.creator = U.id LIMIT 3;',
};

export const FAVORITE = {
  COUNT: 'SELECT count(*) as count FROM Favorite WHERE article = ?',

  IS_LIKED:
    'SELECT IF(article, True, False) AS isLiked FROM Favorite WHERE article = ? AND creator = ?',
};

export const BOOKMARK = {
  IS_BOOKMARK:
    'SELECT IF(article, True, False) AS isBookmarked FROM Bookmark WHERE article = ? AND creator = ?',
};

// 아직 사용 안함
export const FOLLOW = {
  CREATE: 'INSERT INTO Follow(fromUser, toUser) VALUES(?, ?)',

  DELETE: 'DELETE FROM Follow WHERE fromUser=? AND toUser=?',
};
