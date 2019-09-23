"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const pool_1 = __importDefault(require("database/pool"));
const nodemailer_1 = __importDefault(require("config/nodemailer"));
const utils_1 = require("utils");
const queries_1 = require("database/queries");
exports.logIn = (req, res, next) => passport_1.default.authenticate('local', { session: false }, (error, user, info) => {
    if (error)
        return next(error);
    if (!user)
        return res
            .status(422)
            .json(info)
            .end();
    if (!user.valid)
        return res
            .status(401)
            .json({ message: '보안코드를 입력하시지 않으셨습니다.' })
            .end();
    const token = utils_1.generateJwt(user.id);
    const { valid } = user, rest = __rest(user, ["valid"]);
    return res.json(Object.assign({}, rest, { token })).end();
})(req, res, next);
exports.register = (req, res, next) => {
    const { body: { email, name, password, avatar }, } = req;
    const { salt, hash } = utils_1.generatePbkdf2(password);
    const secret = Math.round(Math.random() * 1000000).toString();
    return pool_1.default
        .query(queries_1.USER.CREATE(avatar), [email, name, salt, hash, secret])
        .then(([rows]) => {
        if (!utils_1.isUpdated(rows))
            return res.status(500).end();
        return nodemailer_1.default({ type: 'register', to: email, secret })
            .then(() => res.status(200).end())
            .catch(next);
    })
        .catch(next);
};
exports.sendSecretKey = (req, res, next) => {
    const secret = Math.floor(100000 + Math.random() * 900000).toString();
    return pool_1.default
        .query(queries_1.USER.PATCH({ secret }), [req.user.id])
        .then(([rows]) => {
        if (!utils_1.isUpdated(rows))
            return res.status(500).end();
        return nodemailer_1.default({
            type: req.body.type,
            to: req.user.email,
            secret,
        })
            .then(() => res.status(200).end())
            .catch(next);
    }) //query(USER.PATCH)
        .catch(next);
};
exports.verifySecretKey = (req, res, next) => req.user.secret !== req.body.secret
    ? res
        .status(403)
        .json({ message: '보안코드가 일치하지 않습니다.' })
        .end()
    : pool_1.default
        .query(queries_1.USER.PATCH({ valid: true, secret: null }), [
        req.user.id,
    ])
        .then(([rows2]) => {
        if (!utils_1.isUpdated(rows2))
            return res.status(500).end();
        return res
            .json({ token: utils_1.generateJwt(req.user.id) })
            .end();
    })
        .catch(next);
exports.changePassword = (req, res, next) => {
    const { salt, hash } = utils_1.generatePbkdf2(req.body.password);
    return pool_1.default
        .query(queries_1.USER.PATCH({ hash, salt }), [req.user.id])
        .then(([rows]) => utils_1.checkUpdated(rows, res))
        .catch(next);
};
exports.google = passport_1.default.authenticate('google', {
    scope: ['profile', 'email'],
});
exports.googleCallback = (req, res, next) => passport_1.default.authenticate('google', (error, user, _) => {
    if (error)
        return next(error);
    const { id, _json: { email, name, picture }, } = user;
    return pool_1.default
        .query(queries_1.USER.GET.ONE.ID_WR_EML, [email])
        .then(([rows]) => {
        const user = rows;
        // user is already existed
        if (user.length === 1) {
            const token = utils_1.generateJwt(user[0].id);
            return pool_1.default
                .query(queries_1.USER.PATCH({ googleId: id }), [user[0].id])
                .then(() => res.redirect(`http://localhost:3000/#/callback?token=${token}`))
                .catch(next);
        }
        // next create user
        res.locals = {
            googleId: id,
            email,
            name,
            picture,
        };
        return next();
    })
        .catch(next); // pool.query(USER.GET_ONE)
})(req, res, next);
exports.naver = passport_1.default.authenticate('naver');
exports.naverCallback = (req, res, next) => passport_1.default.authenticate('naver', (error, user, _) => {
    if (error)
        return next(error);
    const { id, _json: { email, profile_image, nickname }, } = user;
    pool_1.default
        .query(queries_1.USER.GET.ONE.ID_WR_EML, [email])
        .then(([rows]) => {
        // user is already existed
        const user = rows;
        if (user.length === 1) {
            const token = utils_1.generateJwt(user[0].id);
            return pool_1.default
                .query(queries_1.USER.PATCH({ naverId: id }), [user[0].id])
                .then(() => res.redirect(`http://localhost:3000/#/callback?token=${token}`))
                .catch(next);
        }
        // create user
        res.locals = {
            naverId: id,
            email,
            profile_image,
            nickname,
        };
        return next();
    })
        .catch(next); //pool.query(USER.GET_ONE)
})(req, res, next);
//# sourceMappingURL=auth.js.map