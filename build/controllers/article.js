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
const queries_1 = require("database/queries");
const utils_1 = require("utils");
exports.getAll = (req, res, next) => {
    let query = '';
    const { query: { page }, } = req;
    switch (req.params.category) {
        case 'latest':
            query = queries_1.ARTICLE.GET.ALL.BASIC(page);
            break;
        case 'like':
            query = queries_1.ARTICLE.GET.ALL.FAVORITE(page);
            break;
        case 'bookmark':
            query = queries_1.ARTICLE.GET.ALL.BOOKMARK(page);
            break;
        default:
            throw new Error('article getAll no params');
    }
    return pool_1.default
        .query(query)
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
};
// article id 사용
exports.getOne = (req, res, next) => pool_1.default
    .query(queries_1.ARTICLE.GET.ONE.BASIC, [req.params.id])
    .then(([rows]) => {
    const article = rows[0];
    pool_1.default
        .query(queries_1.PHOTO.GET.ONE.ID_LOC_WR_ARTICLE, [article.id])
        .then(([rows]) => res.json(Object.assign({}, article, { files: rows })).end())
        .catch(next);
})
    .catch(next);
exports.getCreator = (req, res, next) => pool_1.default
    .query(queries_1.ARTICLE.GET.ONE.CREATOR, [req.params.id])
    .then(([rows]) => {
    const article = rows[0];
    pool_1.default
        .query(queries_1.USER.GET.ONE.ID_NM_AVT_WR_ID, [article.creator])
        .then(([rows2]) => res.json(rows2[0]).end())
        .catch(next);
})
    .catch(next);
// { fieldname: 'photos',
// originalname: 'Earth+8-2880x1800.jpg',
// encoding: '7bit',
// mimetype: 'image/jpeg',
// size: 1125349,
// bucket: 'whoareyou-community-file/article',
// key: 'c94c3fa350a456b78fade0e977502386',
// acl: 'public-read',
// contentType: 'application/octet-stream',
// contentDisposition: null,
// storageClass: 'STANDARD',
// serverSideEncryption: null,
// metadata: null,
// location:
//   'https://whoareyou-community-file.s3.ap-northeast-2.amazonaws.com/article/c94c3fa350a456b78fade0e977502386',
// etag: '"8b9e9138b343cbf60db7c258c0438364"',
// versionId: undefined }
exports.create = (req, res, next) => {
    const { files, body: { content }, } = req;
    pool_1.default
        .query(queries_1.ARTICLE.CREATE, [content, req.user.id])
        .then(([rows]) => {
        if (!utils_1.isUpdated)
            return res.status(500).end();
        const article = rows;
        const fileArr = files;
        pool_1.default
            .query(queries_1.PHOTO.CREATE.MANY, [
            fileArr.map(file => [article.insertId, file.location]),
        ])
            .then(([rows2]) => utils_1.checkUpdated(rows2, res))
            .catch(next);
    })
        .catch(next); // ARTICLE.CREATE
};
// query 해당하는 row 없을 시
// ResultSetHeader {
//   fieldCount: 0,
//   affectedRows: 0,
//   insertId: 0,
//   info: '',
//   serverStatus: 2,
//   warningStatus: 0 }
// 있을 시
// ResultSetHeader {
//   fieldCount: 0,
//   affectedRows: 1,
//   insertId: 0,
//   info: '',
//   serverStatus: 2,
//   warningStatus: 0 }
exports.remove = (req, res, next) => pool_1.default
    .query(queries_1.ARTICLE.REMOVE, [req.params.id, req.user.id])
    .then(([rows]) => {
    console.log('remove');
    console.log(rows);
    return utils_1.checkUpdated(rows, res);
})
    .catch(next);
exports.patch = (req, res, next) => {
    const { body: { title, content }, } = req;
    return pool_1.default
        .query(queries_1.ARTICLE.PATCH(title, content), [req.params.id, req.user.id])
        .then(([rows]) => utils_1.checkUpdated(rows, res))
        .catch(next);
};
//# sourceMappingURL=article.js.map