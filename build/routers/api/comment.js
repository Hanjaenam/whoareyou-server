"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("routes"));
const common_1 = require("middlewares/common");
const comment_1 = require("controllers/comment");
const router = express_1.default.Router();
router.get(routes_1.default.articleId + routes_1.default.comment, comment_1.getAll);
router.post(routes_1.default.articleId + routes_1.default.comment, common_1.requiredData(['content']), comment_1.create);
router.delete(routes_1.default.articleId + routes_1.default.comment + routes_1.default.id, common_1.isExistedArticle, common_1.isMine('comment'), comment_1.remove);
router.patch(routes_1.default.articleId + routes_1.default.comment + routes_1.default.id, common_1.requiredData(['content']), common_1.isExistedArticle, common_1.isMine('comment'), comment_1.patch);
exports.default = router;
//# sourceMappingURL=comment.js.map