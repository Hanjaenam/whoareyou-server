"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const expressJwt_1 = __importDefault(require("config/expressJwt"));
const pool_1 = __importDefault(require("database/pool"));
const queries_1 = require("database/queries");
exports.requiredData = (args) => (req, res, next) => {
    const emptyKeys = args.filter(arg => req.body[arg] === undefined);
    if (emptyKeys.length !== 0)
        return res
            .status(422)
            .json({ message: `${emptyKeys.join()} can't be blank` })
            .end();
    return next();
};
exports.haveAtLeastOneData = (args) => (req, res, next) => {
    const isEveryEmpty = args.every(arg => req.body[arg] === undefined);
    if (isEveryEmpty)
        return res
            .status(422)
            .json({ message: 'there is no data to change' })
            .end();
    return next();
};
exports.tokenErrorHandling = (err, _, res, next) => err.name === 'UnauthorizedError'
    ? res
        .status(401)
        .json({ message: 'invalid token' })
        .end()
    : next();
exports.authRequired = [expressJwt_1.default.required, exports.tokenErrorHandling];
exports.isMine = (queryType) => {
    let query = '';
    let id = '';
    switch (queryType) {
        case 'article':
            query = queries_1.ARTICLE.GET.ONE.CREATOR;
            id = 'id';
            break;
        case 'comment':
            query = queries_1.COMMENT.GET.ONE.CREATOR;
            id = 'id';
            break;
        case 'favorite':
            query = queries_1.FAVORITE.GET.ONE.CREATOR;
            id = 'article';
            break;
        case 'bookmark':
            query = '';
            id = 'article';
        default:
            throw new Error('common Middleware no Params');
    }
    return (req, res, next) => pool_1.default
        .query(query, [id === 'article' ? req.params.articleId : req.params.id])
        .then(([rows]) => rows[0].creator === req.user.id
        ? next()
        : res.status(403).end())
        .catch(next);
};
exports.isExistedArticle = (req, res, next) => pool_1.default
    .query(queries_1.ARTICLE.GET.ONE.ID, [req.params.articleId])
    .then(([rows]) => rows.length === 0 ? res.status(204).end() : next())
    .catch(next);
//# sourceMappingURL=common.js.map