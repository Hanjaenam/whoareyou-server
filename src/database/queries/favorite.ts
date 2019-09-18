export default {
  COUNT: 'SELECT count(*) as count FROM Favorite WHERE article = ?',

  IS_LIKED:
    'SELECT IF(article, True, False) AS isLiked FROM Favorite WHERE article = ? AND creator = ?',
};
