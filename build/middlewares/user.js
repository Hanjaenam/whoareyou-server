"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pool_1 = __importDefault(require("database/pool"));
const queries_1 = require("database/queries");
const utils_1 = require("utils");
const awsS3_1 = __importDefault(require("config/awsS3"));
exports.isValidPassword = (req, res, next) => pool_1.default
    .query(queries_1.USER.VALIDATE_PASSWORD, req.user.id)
    .then(([rows]) => {
    const { prePassword } = req.body;
    const { hash, salt } = rows[0];
    if (!utils_1.validatePassword({ password: prePassword, hash, salt })) {
        // 403 : 무언가를 하려면 인증을 해야 하는데, 그에 대한 데이터를 보내지 않음
        // 401 : 데이터를 보냈지만 틀림
        return res
            .status(403)
            .json({ message: '현재 비밀번호가 일치하지 않습니다.' })
            .end();
    }
    return next();
})
    .catch(next);
exports.removePreAvatar = (req, res, next) => pool_1.default
    .query(queries_1.USER.GET.ONE.AVT_WR_ID, req.user.id)
    .then(([rows]) => {
    const { avatar } = rows[0];
    if (avatar) {
        //https://whoareyou-community-file.s3.ap-northeast-2.amazonaws.com/avatars/bc0a8e5e1a6aa111d48bf9ccc2783646
        const Key = avatar.substr(avatar.indexOf('avatars'));
        return awsS3_1.default.deleteObject({
            Bucket: process.env.BUCKET,
            Key,
        }, (err, _) => err ? next(err) : next());
    }
    return next();
})
    .catch(next);
//# sourceMappingURL=user.js.map