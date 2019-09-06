import { dbQueryToStr } from 'utils';

export const AUTH = {
  VALIDATE_PASSWORD: (key: 'id' | 'email'): string =>
    `select salt, hash FROM User WHERE ${key} = ?`,
};

export const USER = {
  GET_ALL: 'SELECT id, name, avatar, introduce FROM User',

  GET_ONE: (key: 'id' | 'email'): string =>
    `SELECT id, email, name, valid, avatar, introduce, secret, naverId, googleId, createdAt FROM User WHERE ${key}=?`,

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
};

export const FOLLOW = {
  CREATE: 'INSERT INTO Follow(fromUser, toUser) VALUES(?, ?)',

  DELETE: 'DELETE FROM Follow WHERE fromUser=? AND toUser=?',
};

export const ARTICLE = {
  GET_ALL: 'SELECT hex(id), title, author, createdAt FROM Article',

  GET_ONE:
    'SELECT hex(id), title, content, author, createdAt FROM Article WHERE id = ?',

  CREATE: 'INSERT INTO Article(title, content, author) VALUES(?, ?, ?)',

  REMOVE: 'DELETE FROM Article WHERE id = unhex(?) AND author = ?',

  PATCH: (title: string, content: string): string =>
    `UPDATE Article SET ${dbQueryToStr({
      title,
      content,
    })} WHERE id = unhex(?) AND author = ?`,
};

export const TAG = {
  CREATE: 'INSERT INTO Tag(article, name) VALUES(unhex(?), ?)',
};
