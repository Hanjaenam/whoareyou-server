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
const pool_1 = __importDefault(require("database/pool"));
const utils_1 = require("utils");
const queries_1 = require("database/queries");
exports.getMe = (req, res, next) => pool_1.default
    .query(queries_1.USER.GET.ONE.BASIC('id'), [req.user.id])
    .then(([rows]) => res.json(rows[0]).end())
    .catch(next);
exports.getArticle = (req, res, next) => pool_1.default
    .query(queries_1.ARTICLE.GET.ALL.WR_CREATOR(req.query.page), [req.params.id])
    .then(([rows]) => __awaiter(this, void 0, void 0, function* () {
    try {
        const data = yield utils_1.articleDataTemplate(req.user, rows);
        return res.json(data).end();
    }
    catch (error) {
        return next(error);
    }
}))
    .catch(next);
// export const getAll = (
//   _: Request,
//   res: Response,
//   next: NextFunction,
// ): Promise<void> =>
//   pool
//     .query(USER.GET_ALL)
//     .then(([rows]) => res.json(rows).end())
//     .catch(next);
exports.getOne = (req, res, next) => pool_1.default
    .query(queries_1.USER.GET.ONE.BASIC('id'), [req.params.id])
    .then(([rows]) => res.json(rows[0]).end())
    .catch(next);
exports.remove = (req, res, next) => pool_1.default
    .query(queries_1.USER.REMOVE, [req.user.id])
    .then(([rows]) => utils_1.checkUpdated(rows, res))
    .catch(next);
exports.patch = (req, res, next) => {
    const { body: { name, avatar, introduce }, } = req;
    return pool_1.default
        .query(queries_1.USER.PATCH({
        name,
        avatar,
        introduce,
    }), [req.user.id])
        .then(([rows]) => utils_1.checkUpdated(rows, res))
        .catch(next);
};
exports.changePassword = (req, res, next) => {
    const { newPassword } = req.body;
    const { salt, hash } = utils_1.generatePbkdf2(newPassword);
    return pool_1.default
        .query(queries_1.USER.PATCH({ hash, salt }), [req.user.id])
        .then(([rows]) => utils_1.checkUpdated(rows, res))
        .catch(next);
};
exports.patchAvatar = (req, res, next) => pool_1.default
    .query(queries_1.USER.PATCH({ avatar: req.file.location }), [req.user.id])
    .then(([rows]) => {
    if (!utils_1.isUpdated(rows))
        return res.status(500).end();
    return res.json(req.file.location).end();
})
    .catch(next);
//# sourceMappingURL=user.js.map