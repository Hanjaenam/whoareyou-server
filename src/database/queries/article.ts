import { dbQueryToStr } from 'utils';

export default {
  GET: {
    ALL: {
      BASIC: (start = 0): string =>
        `SELECT id, content, createdAt, creator FROM Article ORDER BY createdAt DESC LIMIT ${start *
          10} ,${start * 10 + 10}`,
      WR_CREATOR: (start = 0): string =>
        `SELECT id, content, createdAt, creator FROM Article WHERE creator = ? ORDER BY createdAt DESC LIMIT ${start *
          10} ,${start * 10 + 10}`,
    },

    ONE: {
      BASIC: 'SELECT id, content, creator, createdAt FROM Article WHERE id = ?',
      CREATOR: 'SELECT creator FROM Article WHERE id = ?',
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
