"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("config/env");
const queries_1 = require("database/queries");
const pool_1 = __importDefault(require("database/pool"));
exports.dbQueryToStr = (obj) => Object.keys(obj)
    .filter(key => obj[key] !== undefined)
    .map(key => {
    let value = '';
    if (typeof obj[key] === 'string')
        value = `"${obj[key]}"`;
    if (typeof obj[key] === 'boolean') {
        if (obj[key])
            value = 'True';
        else
            value = 'False';
    }
    if (obj[key] === null)
        value = 'NULL';
    return `${key}=${value}`;
})
    .join();
exports.generateJwt = (id) => jsonwebtoken_1.default.sign({
    id,
}, env_1.secret, { expiresIn: '24h' });
exports.generatePbkdf2 = (password) => {
    const salt = crypto_1.default.randomBytes(32).toString('hex');
    const hash = crypto_1.default
        .pbkdf2Sync(password, salt, 10, 32, 'sha512')
        .toString('hex');
    return { salt, hash };
};
exports.validatePassword = ({ password, hash, salt, }) => crypto_1.default.pbkdf2Sync(password, salt, 10, 32, 'sha512').toString('hex') === hash;
exports.checkUpdated = (rows, res) => rows.affectedRows === 0
    ? res.status(500).end()
    : res.json(200).end();
exports.isUpdated = (rows) => rows.affectedRows !== 0;
exports.articleDataTemplate = (user, rows) => __awaiter(this, void 0, void 0, function* () {
    const articles = rows;
    const creators = articles.map(article => pool_1.default.query(queries_1.USER.GET.ONE.ID_NM_AVT_WR_ID, [article.creator]));
    const photos = articles.map(article => pool_1.default.query(queries_1.PHOTO.GET.ONE.ID_LOC_WR_ARTICLE, [article.id]));
    const likes = articles.map(article => pool_1.default.query(queries_1.FAVORITE.COUNT, [article.id]));
    const commentNumber = articles.map(article => pool_1.default.query(queries_1.COMMENT.COUNT, [article.id]));
    const comments = articles.map(article => pool_1.default.query(queries_1.COMMENT.GET.ONE.USING_ARTICLE, [article.id]));
    const isLiked = user &&
        articles.map(article => pool_1.default.query(queries_1.FAVORITE.IS_LIKED, [article.id, user.id]));
    const isBookmarked = user &&
        articles.map(article => pool_1.default.query(queries_1.BOOKMARK.IS_BOOKMARK, [article.id, user.id]));
    try {
        const creatorRes = yield Promise.all(creators);
        const photRes = yield Promise.all(photos);
        const likeRes = yield Promise.all(likes);
        const commntNumRes = yield Promise.all(commentNumber);
        const comntRes = yield Promise.all(comments);
        const isLikedRes = isLiked ? yield Promise.all(isLiked) : undefined;
        const isBokmkedRes = isBookmarked
            ? yield Promise.all(isBookmarked)
            : undefined;
        const data = articles.map((article, index) => (Object.assign({}, article, { creator: creatorRes[index][0][0], photos: photRes[index][0], likeNumber: likeRes[index][0][0].count, commentNumber: commntNumRes[index][0][0].count, comments: comntRes[index][0], isLiked: user ? isLikedRes[index][0].length === 1 : false, isBookmarked: user
                ? isBokmkedRes[index][0].length === 1
                : false })));
        return data;
    }
    catch (error) {
        throw new Error(error);
    }
});
//# sourceMappingURL=utils.js.map