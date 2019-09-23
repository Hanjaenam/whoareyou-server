"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("routes"));
const article_1 = require("controllers/article");
const common_1 = require("middlewares/common");
const awsS3_1 = __importDefault(require("middlewares/awsS3"));
const article_2 = require("middlewares/article");
const comment_1 = __importDefault(require("./comment"));
const favorite_1 = __importDefault(require("./favorite"));
const bookmark_1 = __importDefault(require("./bookmark"));
const router = express_1.default.Router();
//comment
router.use(...common_1.authRequired, comment_1.default);
router.use(...common_1.authRequired, favorite_1.default);
router.use(...common_1.authRequired, bookmark_1.default);
// 둘러보기 getAll - 권한 풀어주기
router.get(routes_1.default.category, article_1.getAll);
// 둘러보기 getOne -  권한 풀어주기
router.get(routes_1.default.id, article_1.getOne);
router.get(routes_1.default.id + routes_1.default.creator, article_1.getCreator);
// 권한 필수
router.post(routes_1.default.home, ...common_1.authRequired, awsS3_1.default('articles').array('photos', 50), article_1.create);
// 권한 필수
router.delete(routes_1.default.id, ...common_1.authRequired, common_1.isMine('article'), article_2.removePhotos, article_1.remove);
// 권한 필수
// router.patch(routes.id, patch);
exports.default = router;
//# sourceMappingURL=article.js.map