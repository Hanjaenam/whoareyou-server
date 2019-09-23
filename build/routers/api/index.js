"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("./auth"));
const article_1 = __importDefault(require("./article"));
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("routes"));
const user_1 = __importDefault(require("./user"));
const common_1 = require("middlewares/common");
const router = express_1.default.Router();
router.use(routes_1.default.auth, auth_1.default);
// ...authRequired : Authorization Header - token 검사
router.use(routes_1.default.user, ...common_1.authRequired, user_1.default);
// ...authRequired : Authorization Header - token 검사
router.use(routes_1.default.article, article_1.default);
router.use((err, req, res, next) => {
    // mySql column 잘못됐을 때 error
    if (1364 === err.errno || 1406 === err.errno) {
        console.log('--- Query Error ---');
        console.log(err);
        return res.status(422).end();
    }
    // app.ts - 라우터 맨 아래 use로 이동
    return next(err);
});
exports.default = router;
//# sourceMappingURL=index.js.map