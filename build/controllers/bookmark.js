"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pool_1 = __importDefault(require("database/pool"));
const queries_1 = require("database/queries");
const utils_1 = require("utils");
exports.create = (req, res, next) => pool_1.default
    .query(queries_1.BOOKMARK.CREATE, [req.params.articleId, req.user.id])
    .then(([rows]) => utils_1.checkUpdated(rows, res))
    .catch(next);
exports.remove = (req, res, next) => pool_1.default
    .query(queries_1.BOOKMARK.REMOVE, [req.params.articleId, req.user.id])
    .then(([rows]) => utils_1.checkUpdated(rows, res))
    .catch(next);
//# sourceMappingURL=bookmark.js.map