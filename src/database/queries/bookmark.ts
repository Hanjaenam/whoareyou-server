export default {
  IS_BOOKMARK:
    'SELECT IF(article, True, False) AS isBookmarked FROM Bookmark WHERE article = ? AND creator = ?',
};
