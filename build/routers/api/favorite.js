"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("routes"));
const favorite_1 = require("controllers/favorite");
const common_1 = require("middlewares/common");
const router = express_1.default.Router();
router.delete(routes_1.default.articleId + routes_1.default.favorite, common_1.isMine('favorite'), favorite_1.remove);
router.post(routes_1.default.articleId + routes_1.default.favorite, common_1.isExistedArticle, favorite_1.create);
exports.default = router;
//# sourceMappingURL=favorite.js.map