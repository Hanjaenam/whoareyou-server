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
const routes_1 = __importDefault(require("routes"));
const passport_local_1 = require("passport-local");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_naver_1 = require("passport-naver");
const queries_1 = require("database/queries");
const utils_1 = require("utils");
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false,
}, (email, password, done) => {
    pool_1.default
        .query(queries_1.USER.PASSPORT, [email])
        .then(([rows]) => {
        const user = rows;
        if (user.length === 0)
            return done(null, false, {
                message: '없는 이메일입니다.',
            });
        if (!utils_1.validatePassword({
            password,
            hash: user[0].hash,
            salt: user[0].salt,
        }))
            return done(null, false, {
                message: '비밀번호가 일치하지 않습니다.',
            });
        const _a = user[0], { hash, salt } = _a, rest = __rest(_a, ["hash", "salt"]);
        return done(null, rest);
    })
        .catch(err => done(err)); // pool.query(PASSPORT_LOGIN)
}));
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET_KEY,
    callbackURL: routes_1.default.api + routes_1.default.auth + routes_1.default.googleCallback,
}, (_, __, profile, done) => done(null, profile)));
passport_1.default.use(new passport_naver_1.Strategy({
    clientID: process.env.NAVER_CLIENT_ID,
    clientSecret: process.env.NAVER_SECRET_KEY,
    callbackURL: routes_1.default.api + routes_1.default.auth + routes_1.default.naverCallback,
}, (_, __, profile, done) => done(null, profile)));
//# sourceMappingURL=passport.js.map