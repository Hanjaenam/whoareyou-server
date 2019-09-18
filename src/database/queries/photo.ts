export default {
  GET: {
    ONE: {
      ID_LOC_WR_ARTICLE: 'SELECT id, location FROM Photo WHERE article = ?',
    },
  },
  CREATE_ONE: 'INSERT INTO PHOTO(article, location) VALUES (?, ?)',
  CREATE_MANY: 'INSERT INTO PHOTO(article, location) VALUES ?',
};
