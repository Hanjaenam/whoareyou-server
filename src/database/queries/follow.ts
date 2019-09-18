export default {
  CREATE: 'INSERT INTO Follow(fromUser, toUser) VALUES(?, ?)',

  REMOVE: 'DELETE FROM Follow WHERE fromUser=? AND toUser=?',
};
