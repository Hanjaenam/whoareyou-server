"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("utils");
exports.USER = {
    GET: {
        ONE: {
            BASIC: (key) => `SELECT id, email, name, avatar, introduce, createdAt From User WHERE ${key}=?`,
            ID_EML_SECRT_WR_EML: 'SELECT id, email, secret FROM User WHERE email = ?',
            ID_WR_EML: 'SELECT id FROM User WHERE email = ?',
            AVT_WR_ID: 'SELECT avatar FROM User WHERE id = ?',
            ID_NM_AVT_WR_ID: 'SELECT id, name, avatar FROM User WHERE id = ?',
        },
        ALL: 'SELECT id, name, avatar, introduce FROM User',
    },
    PASSPORT: 'select id, email, name, avatar, introduce, createdAt, valid, salt, hash FROM User WHERE email = ?',
    CREATE: (avatar) => `INSERT INTO User(email, name, salt, hash, secret ${avatar ? `,${avatar}` : ''}) VALUES(?, ?, ?, ?, ? ${avatar ? `,${avatar}` : ''})`,
    PATCH: (obj) => `UPDATE User SET ${utils_1.dbQueryToStr(obj)} WHERE id = ?`,
    REMOVE: 'DELETE FROM User WHERE id = ?',
    CREATE_GOOGLE: 'INSERT INTO User(email, name, googleId, avatar) VALUES(?, ?, ?, ?)',
    CREATE_NAVER: 'INSERT INTO User(email, name, naverId, avatar) VALUES(?, ?, ?, ?)',
    VALIDATE_PASSWORD: 'select salt, hash FROM User WHERE id = ?',
};
// ! ARTICLE ---------------------------------------------------------------------------------------
exports.ARTICLE = {
    GET: {
        ALL: {
            BASIC: (start = 0) => `SELECT id, content, createdAt, creator FROM Article ORDER BY createdAt DESC LIMIT 10 OFFSET ${start}`,
            WR_CREATOR: (start = 0) => `SELECT id, content, createdAt, creator FROM Article WHERE creator = ? ORDER BY createdAt DESC LIMIT 10 OFFSET ${start}`,
            FAVORITE: (start = 0) => `select A.id, A.content, A.createdAt, A.creator from Favorite as F, Article as A WHERE F.article = A.id ORDER BY createdAt DESC LIMIT 10 OFFSET ${start};`,
            BOOKMARK: (start = 0) => `select A.id, A.content, A.createdAt, A.creator from Bookmark as B, Article as A WHERE B.article = A.id ORDER BY createdAt DESC LIMIT 10 OFFSET ${start};`,
        },
        ONE: {
            BASIC: 'SELECT id, content, creator, createdAt FROM Article WHERE id = ?',
            CREATOR: 'SELECT creator FROM Article WHERE id = ?',
            ID: 'SELECT id FROM Article WHERE id = ?',
        },
    },
    CREATE: 'INSERT INTO Article(content, creator) VALUES(?, ?)',
    REMOVE: 'DELETE FROM Article WHERE id = ? AND creator = ?',
    PATCH: (title, content) => `UPDATE Article SET ${utils_1.dbQueryToStr({
        title,
        content,
    })} WHERE id = ? AND creator = ?`,
};
// ! PHOTO ---------------------------------------------------------------------------------------
exports.PHOTO = {
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
exports.COMMENT = {
    COUNT: 'SELECT count(*) as count FROM Comment WHERE article = ?',
    GET: {
        ONE: {
            USING_CREATE: 'SELECT C.id, U.name as creator, C.content, C.createdAt From Comment as C, User as U WHERE C.id = ? AND C.creator = ?',
            USING_ARTICLE: 'SELECT C.id, C.content, U.name as creator, C.createdAt from Comment as C, User as U WHERE C.article=? AND C.creator = U.id ORDER BY createdAt DESC LIMIT 3;',
            CREATOR: 'SELECT creator FROM Comment WHERE id = ?',
        },
        ALL: {
            USING_ARTICLE: 'SELECT C.id, U.name as creator, C.content, C.createdAt FROM Comment as C, User as U WHERE article=? AND U.id = C.creator ORDER BY createdAt DESC LIMIT 10 OFFSET 3',
        },
    },
    CREATE: 'INSERT INTO Comment(article, creator, content) VALUES(?, ?, ?)',
    REMOVE: 'DELETE FROM Comment WHERE id = ?',
    PATCH: 'UPDATE Comment SET content = ? WHERE id = ?',
};
// ! FAVORITE ---------------------------------------------------------------------------------------
exports.FAVORITE = {
    GET: {
        ONE: {
            CREATOR: 'SELECT creator FROM Favorite WHERE article = ?',
        },
    },
    COUNT: 'SELECT count(*) as count FROM Favorite WHERE article = ?',
    IS_LIKED: 'SELECT IF(article, True, False) AS isLiked FROM Favorite WHERE article = ? AND creator = ?',
    CREATE: 'INSERT INTO Favorite(article, creator) VALUES(?, ?)',
    REMOVE: 'DELETE FROM Favorite WHERE article = ? AND creator = ?',
};
// ! BOOKMARK ---------------------------------------------------------------------------------------
exports.BOOKMARK = {
    GET: {
        ONE: {
            CREATOR: 'SELECT creator FROM Bookmark WHERE article = ?',
        },
    },
    IS_BOOKMARK: 'SELECT IF(article, True, False) AS isBookmarked FROM Bookmark WHERE article = ? AND creator = ?',
    CREATE: 'INSERT INTO Bookmark(article, creator) VALUES(?, ?)',
    REMOVE: 'DELETE FROM Bookmark WHERE article = ? AND creator = ?',
};
// ! FOLLOW ---------------------------------------------------------------------------------------
exports.FOLLOW = {
    CREATE: 'INSERT INTO Follow(fromUser, toUser) VALUES(?, ?)',
    REMOVE: 'DELETE FROM Follow WHERE fromUser=? AND toUser=?',
};
//# sourceMappingURL=queries.js.map