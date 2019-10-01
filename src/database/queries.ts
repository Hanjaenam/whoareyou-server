import { dbQueryToStr } from 'utils';

export const USER = {
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

// ! ARTICLE ---------------------------------------------------------------------------------------

export const ARTICLE = {
  GET: {
    ALL: {
      BASIC: (start = 0): string =>
        `SELECT id, content, createdAt, creator FROM Article ORDER BY createdAt DESC LIMIT 10 OFFSET ${start}`,
      WR_CREATOR: (start = 0): string =>
        `SELECT id, content, createdAt, creator FROM Article WHERE creator = ? ORDER BY createdAt DESC LIMIT 10 OFFSET ${start}`,
      FAVORITE: ({
        start = 0,
        creator,
      }: {
        start: number;
        creator: number;
      }): string =>
        `select A.id, A.content, A.createdAt, A.creator from Favorite as F, Article as A WHERE F.article = A.id AND F.creator=${creator} ORDER BY createdAt DESC LIMIT 10 OFFSET ${start};`,
      BOOKMARK: ({
        start = 0,
        creator,
      }: {
        start: number;
        creator: number;
      }): string =>
        `select A.id, A.content, A.createdAt, A.creator from Bookmark as B, Article as A WHERE B.article = A.id AND B.creator=${creator} ORDER BY createdAt DESC LIMIT 10 OFFSET ${start};`,
    },

    ONE: {
      BASIC: 'SELECT id, content, creator, createdAt FROM Article WHERE id = ?',
      CREATOR: 'SELECT creator FROM Article WHERE id = ? AND creator = ?',
      ID: 'SELECT id FROM Article WHERE id = ?',
    },
  },

  CREATE: 'INSERT INTO Article(content, creator) VALUES(?, ?)',
  REMOVE: 'DELETE FROM Article WHERE id = ? AND creator = ?',
  PATCH: (title: string, content: string): string =>
    `UPDATE Article SET ${dbQueryToStr({
      title,
      content,
    })} WHERE id = ? AND creator = ?`,
};

// ! PHOTO ---------------------------------------------------------------------------------------

export const PHOTO = {
  GET: {
    ALL: {
      LOC_WR_ARTICLE: 'SELECT location FROM Photo WHERE article = ?',
    },
    ONE: {
      ID_LOC_WR_ARTICLE: 'SELECT id, location FROM Photo WHERE article = ?',
    },
  },
  CREATE: {
    ONE: 'INSERT INTO Photo(article, location) VALUES (?, ?)',
    MANY: 'INSERT INTO Photo(article, location) VALUES ?',
  },
};

// ! COMMENT ---------------------------------------------------------------------------------------

export const COMMENT = {
  COUNT: 'SELECT count(*) as count FROM Comment WHERE article = ?',
  GET: {
    ONE: {
      USING_CREATE:
        'SELECT C.id, U.name as creator, C.content, C.createdAt From Comment as C, User as U WHERE C.id = ? AND C.creator = ?',
      USING_ARTICLE:
        'SELECT C.id, C.content, U.name as creator, C.createdAt from Comment as C, User as U WHERE C.article=? AND C.creator = U.id ORDER BY createdAt DESC LIMIT 3;',
      CREATOR: 'SELECT creator FROM Comment WHERE id = ? AND creator = ?',
    },
    ALL: {
      USING_ARTICLE:
        'SELECT C.id, U.name as creator, C.content, C.createdAt FROM Comment as C, User as U WHERE article=? AND U.id = C.creator ORDER BY createdAt DESC LIMIT 10 OFFSET 3',
    },
  },
  CREATE: 'INSERT INTO Comment(article, creator, content) VALUES(?, ?, ?)',
  REMOVE: 'DELETE FROM Comment WHERE id = ?',
  PATCH: 'UPDATE Comment SET content = ? WHERE id = ?',
};

// ! FAVORITE ---------------------------------------------------------------------------------------

export const FAVORITE = {
  GET: {
    ONE: {
      CREATOR: 'SELECT creator FROM Favorite WHERE article = ? AND creator = ?',
    },
  },
  COUNT: 'SELECT count(*) as count FROM Favorite WHERE article = ?',

  IS_LIKED:
    'SELECT IF(article, True, False) AS isLiked FROM Favorite WHERE article = ? AND creator = ?',

  CREATE: 'INSERT INTO Favorite(article, creator) VALUES(?, ?)',
  REMOVE: 'DELETE FROM Favorite WHERE article = ? AND creator = ?',
};

// ! BOOKMARK ---------------------------------------------------------------------------------------

export const BOOKMARK = {
  GET: {
    ONE: {
      CREATOR: 'SELECT creator FROM Bookmark WHERE article = ? AND creator = ?',
    },
  },
  IS_BOOKMARK:
    'SELECT IF(article, True, False) AS isBookmarked FROM Bookmark WHERE article = ? AND creator = ?',
  CREATE: 'INSERT INTO Bookmark(article, creator) VALUES(?, ?)',
  REMOVE: 'DELETE FROM Bookmark WHERE article = ? AND creator = ?',
};

// ! FOLLOW ---------------------------------------------------------------------------------------

export const FOLLOW = {
  CREATE: 'INSERT INTO Follow(fromUser, toUser) VALUES(?, ?)',

  REMOVE: 'DELETE FROM Follow WHERE fromUser=? AND toUser=?',
};
