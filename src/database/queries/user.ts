import { dbQueryToStr } from 'utils';

export default {
  GET: {
    ONE: {
      BASIC: (key: 'id' | 'email'): string =>
        `SELECT id, email, name, avatar, introduce, createdAt From User WHERE ${key}=?`,
      ID_EML_SECRT_WR_EML: 'SELECT id, email, secret FROM User WHERE email = ?',
      ID_WR_EML: 'SELECT id FROM User WHERE email = ?',
      AVT_WR_ID: 'SELECT avatar FROM User WHERE id = ?',
      ID_NM_AVT_WR_ID: 'SELECT id, name, avatar FROM User WHERE id = ?',
    },
    ALL: 'SELECT id, name, avatar, introduce FROM User',
  },

  PASSPORT:
    'select id, email, name, avatar, introduce, createdAt, valid, salt, hash FROM User WHERE email = ?',
  CREATE: (avatar?: string): string =>
    `INSERT INTO User(email, name, salt, hash, secret ${
      avatar ? `,${avatar}` : ''
    }) VALUES(?, ?, ?, ?, ? ${avatar ? `,${avatar}` : ''})`,
  PATCH: (obj: Record<string, any>): string =>
    `UPDATE User SET ${dbQueryToStr(obj)} WHERE id = ?`,
  REMOVE: 'DELETE FROM User WHERE id = ?',
  CREATE_GOOGLE:
    'INSERT INTO User(email, name, googleId, avatar) VALUES(?, ?, ?, ?)',
  CREATE_NAVER:
    'INSERT INTO User(email, name, naverId, avatar) VALUES(?, ?, ?, ?)',
  VALIDATE_PASSWORD: 'select salt, hash FROM User WHERE id = ?',
};
