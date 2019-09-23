"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("routes"));
const user_1 = require("controllers/user");
const common_1 = require("middlewares/common");
const user_2 = require("middlewares/user");
const awsS3_1 = __importDefault(require("middlewares/awsS3"));
const router = express_1.default.Router();
// 내 정보 가져오기
router.get(routes_1.default.me, user_1.getMe);
// get 유저 정보
router.get(routes_1.default.id, user_1.getOne);
router.get(routes_1.default.id + routes_1.default.article, user_1.getArticle);
// 회원탈퇴
router.delete(routes_1.default.home, user_1.remove);
// 아바타 삭제 라우터 넣을 것.
// 유저 정보 수정
// haveAtLeastOneData : 최소한 name, avatar 두개 중 하나의 데이터는 보내야 한다.
router.patch(routes_1.default.home, common_1.haveAtLeastOneData(['name', 'introduce']), user_1.patch);
// 비밀번호 변경
router.patch(routes_1.default.changePasswod, common_1.requiredData(['prePassword', 'newPassword']), user_2.isValidPassword, user_1.changePassword);
// 아바타 변경
router.patch(routes_1.default.avatar, user_2.removePreAvatar, awsS3_1.default('avatars').single('avatar'), user_1.patchAvatar);
exports.default = router;
//# sourceMappingURL=user.js.map