export default {
  COUNT: 'SELECT count(*) as count FROM Comment WHERE article = ?',
  GET: {
    ONE: {
      BASIC:
        'select C.id, C.content, U.name as creator from Comment as C, User as U WHERE C.article=? AND C.creator = U.id LIMIT 3;',
    },
  },
};
