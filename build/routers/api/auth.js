"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("routes"));
const auth_1 = require("controllers/auth");
const common_1 = require("middlewares/common");
const auth_2 = require("middlewares/auth");
const router = express_1.default.Router();
// 1. email, password - 필수 데이터
router.post(routes_1.default.logIn, common_1.requiredData(['email', 'password']), auth_1.logIn);
// 1. email, name, password 필수 body 데이터
// 2. 존재하는 유저 : req.user
router.post(routes_1.default.register, common_1.requiredData(['email', 'name', 'password']), auth_2.isNotExistedUser, auth_1.register);
// 1. email - 필수데이터
// 2. 존재하는 유저 : req.user
router.post(routes_1.default.sendSecretKey, common_1.requiredData(['email', 'type']), auth_2.isExistedUser, auth_1.sendSecretKey);
// 1. email, secret - 필수 데이터
// 2. 존재하는 유저
router.post(routes_1.default.verifySecretKey, common_1.requiredData(['email', 'secret']), auth_2.isExistedUser, auth_1.verifySecretKey);
// 1. password - 필수데이터
// 2. 존재하는 유저 : req.user
router.patch(routes_1.default.changePasswod, common_1.requiredData(['email', 'password', 'secret']), auth_2.isExistedUser, auth_1.changePassword);
// google oauth
router.get(routes_1.default.google, auth_1.google);
router.get(routes_1.default.googleCallback, auth_1.googleCallback, auth_2.createGoogleAccount);
// naver oauth
router.get(routes_1.default.naver, auth_1.naver);
router.get(routes_1.default.naverCallback, auth_1.naverCallback, auth_2.createNaverAccount);
exports.default = router;
//# sourceMappingURL=auth.js.map