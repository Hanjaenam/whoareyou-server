"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pool_1 = __importDefault(require("database/pool"));
const queries_1 = require("database/queries");
const utils_1 = require("utils");
exports.isNotExistedUser = (req, res, next) => pool_1.default
    .query(queries_1.USER.GET.ONE.ID_WR_EML, [req.body.email])
    .then(([rows]) => {
    if (rows.length === 1)
        return res
            .status(409)
            .json({
            message: '이미 사용중인 이메일입니다.',
        })
            .end();
    return next();
})
    .catch(next);
//sendSecretKey : id, email
//verifySecretKey : secret ,id
//changePassword : id
exports.isExistedUser = (req, res, next) => pool_1.default
    .query(queries_1.USER.GET.ONE.ID_EML_SECRT_WR_EML, [req.body.email])
    .then(([rows]) => {
    const user = rows;
    if (user.length === 0)
        return res
            .status(204)
            .json({ message: '없는 이메일입니다.' })
            .end();
    req.user = user[0];
    return next();
})
    // next 인자로 뭐라도 넘기기만 하면 에러는 발생되고 다음으로 넘어가지 않습니다.
    .catch(next);
exports.createGoogleAccount = (req, res, next) => {
    const { googleId, email, name, picture } = res.locals;
    return pool_1.default
        .query(queries_1.USER.CREATE_GOOGLE, [email, name, googleId, picture])
        .then(([rows]) => {
        if (!utils_1.isUpdated(rows))
            return res.status(500).end();
        return pool_1.default
            .query(queries_1.USER.GET.ONE.ID_WR_EML, [email])
            .then(([rows2]) => {
            const token = utils_1.generateJwt(rows2[0].id);
            return res.redirect(`http://localhost:3000/#/?token=${token}`);
        })
            .catch(next); // pool.query(USER.CREATE_GOOGLE)
    })
        .catch(next); // pool.query(USER_CREATE_GOOGLE)
};
exports.createNaverAccount = (req, res, next) => {
    const { naverId, email, profile_image, nickname } = res.locals;
    return pool_1.default
        .query(queries_1.USER.CREATE_NAVER, [email, nickname, naverId, profile_image])
        .then(([rows]) => {
        if (!utils_1.isUpdated(rows))
            return res.status(500).end();
        return pool_1.default
            .query(queries_1.USER.GET.ONE.ID_WR_EML, [email])
            .then(([rows2]) => {
            const token = utils_1.generateJwt(rows2[0].id);
            return res.redirect(`http://localhost:3000/#/?token=${token}`);
        })
            .catch(next); // pool.query(USER.GET_ONE)
    })
        .catch(next); // pool.query(USER.CREATE_NAVER)
};
//# sourceMappingURL=auth.js.map