import { dbQueryToStr } from 'utils';

export const PASSPORT_LOGIN =
  'select hex(id) as id, email, name, valid, avatar, introduce, secret, naverId, googleId, createdAt, salt, hash FROM User WHERE email = ?';

export const USER = {
  GET_ALL: 'SELECT hex(id) as id, name, avatar, introduce FROM User',

  GET_ONE: (key: 'id' | 'email'): string =>
    `SELECT hex(id) as id, email, name, valid, avatar, introduce, secret, naverId, googleId, createdAt FROM User WHERE ${
      key === 'id' ? 'id = unhex(?)' : 'email = ?'
    }`,

  CREATE: (avatar?: string): string =>
    `INSERT INTO User(email, name, salt, hash, secret ${
      avatar ? `,${avatar}` : ''
    }) VALUES(?, ?, ?, ?, ? ${avatar ? `,${avatar}` : ''})`,

  CREATE_GOOGLE:
    'INSERT INTO User(email, name, googleId, avatar) VALUES(?, ?, ?, ?)',

  CREATE_NAVER:
    'INSERT INTO User(email, name, naverId, avatar) VALUES(?, ?, ?, ?)',

  DELETE: 'DELETE FROM User WHERE id = unhex(?)',

  PATCH: (obj: Record<string, any>): string =>
    `UPDATE User SET ${dbQueryToStr(obj)} WHERE id = unhex(?)`,

  VALIDATE_PASSWORD: 'select salt, hash FROM User WHERE id = unhex(?)',
};

export const ARTICLE = {
  GET_ALL: 'SELECT hex(id) as id, title, author, createdAt FROM Article',

  GET_ONE:
    'SELECT hex(id) as id, title, content, author, createdAt FROM Article WHERE id = ?',

  CREATE: 'INSERT INTO Article(title, content, author) VALUES(?, ?, ?)',

  REMOVE: 'DELETE FROM Article WHERE id = unhex(?) AND author = ?',

  PATCH: (title: string, content: string): string =>
    `UPDATE Article SET ${dbQueryToStr({
      title,
      content,
    })} WHERE id = unhex(?) AND author = ?`,
};

export const FOLLOW = {
  CREATE: 'INSERT INTO Follow(fromUser, toUser) VALUES(?, ?)',

  DELETE: 'DELETE FROM Follow WHERE fromUser=? AND toUser=?',
};

export const TAG = {
  CREATE: 'INSERT INTO Tag(article, name) VALUES(unhex(?), ?)',
};
