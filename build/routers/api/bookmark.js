"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("routes"));
const bookmark_1 = require("controllers/bookmark");
const common_1 = require("middlewares/common");
const router = express_1.default.Router();
router.post(routes_1.default.articleId + routes_1.default.bookmark, common_1.isExistedArticle, bookmark_1.create);
router.delete(routes_1.default.articleId + routes_1.default.bookmark, common_1.isMine('favorite'), bookmark_1.remove);
exports.default = router;
//# sourceMappingURL=bookmark.js.map