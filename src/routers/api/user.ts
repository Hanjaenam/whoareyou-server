import express from 'express';
import routes from 'routes';
import {
  getOne,
  remove,
  patch,
  getMe,
  patchAvatar,
  changePassword,
  getArticle,
} from 'controllers/user';
import { haveAtLeastOneData, requiredData } from 'middlewares/common';
import { isValidPassword, removePreAvatar } from 'middlewares/user';
import multerS3 from 'middlewares/awsS3';

const router = express.Router();
// 내 정보 가져오기
router.get(routes.me, getMe);

// get 유저 정보
router.get(routes.id, getOne);
router.get(routes.id + routes.article, getArticle);

// 회원탈퇴
router.delete(routes.home, remove);

// 아바타 삭제 라우터 넣을 것.

// 유저 정보 수정
// haveAtLeastOneData : 최소한 name, avatar 두개 중 하나의 데이터는 보내야 한다.
router.patch(routes.home, haveAtLeastOneData(['name', 'introduce']), patch);

// 비밀번호 변경
router.patch(
  routes.changePasswod,
  requiredData(['prePassword', 'newPassword']),
  isValidPassword,
  changePassword,
);
// 아바타 변경
router.patch(
  routes.avatar,
  removePreAvatar,
  multerS3('avatars').single('avatar'),
  patchAvatar,
);

export default router;
