"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pool_1 = __importDefault(require("database/pool"));
const queries_1 = require("database/queries");
const utils_1 = require("utils");
exports.getAll = (req, res, next) => pool_1.default
    .query(queries_1.COMMENT.GET.ALL.USING_ARTICLE, [req.params.articleId])
    .then(([rows]) => res.json(rows).end())
    .catch(next);
exports.create = (req, res, next) => pool_1.default
    .query(queries_1.COMMENT.CREATE, [
    req.params.articleId,
    req.user.id,
    req.body.content,
])
    .then(([rows]) => {
    const affected = rows;
    if (affected.affectedRows === 0)
        return res.status(500).end();
    pool_1.default
        .query(queries_1.COMMENT.GET.ONE.USING_CREATE, [
        affected.insertId,
        req.user.id,
    ])
        .then(([rows]) => res.json(rows[0]).end())
        .catch(next);
})
    .catch(next);
exports.remove = (req, res, next) => pool_1.default
    .query(queries_1.COMMENT.REMOVE, [req.params.id])
    .then(([rows]) => utils_1.checkUpdated(rows, res))
    .catch(next);
exports.patch = (req, res, next) => pool_1.default
    .query(queries_1.COMMENT.PATCH, [req.body.content, req.params.id])
    .then(([rows]) => utils_1.checkUpdated(rows, res))
    .catch(next);
//# sourceMappingURL=comment.js.map