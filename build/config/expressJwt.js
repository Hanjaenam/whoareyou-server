"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_jwt_1 = __importDefault(require("express-jwt"));
const env_1 = require("config/env");
const getTokenFromHeader = (req) => {
    if ((req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'Token') ||
        (req.headers.authorization &&
            req.headers.authorization.split(' ')[0] === 'Bearer')) {
        return req.headers.authorization.split(' ')[1];
    }
    return null;
};
exports.default = {
    required: express_jwt_1.default({
        secret: env_1.secret,
        getToken: getTokenFromHeader,
    }),
};
//# sourceMappingURL=expressJwt.js.map