import express from 'express';
import routes from 'routes';
import {
  getOne,
  remove,
  patch,
  getAll,
  getMe,
  patchAvatar,
  changePassword,
} from 'controllers/user';
import { haveAtLeastOneData, requiredData } from 'middlewares';
import { isValidPassword } from 'middlewares/user';
import uplaodS3, { deletePreAvatar } from 'middlewares/awsS3';

const router = express.Router();
// 내 정보 가져오기
router.get(routes.me, getMe);

// router.get(routes.home, getAll);

// router.get(routes.id, getOne);
// 회원탈퇴
router.delete(routes.home, remove);
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
router.patch(routes.avatar, deletePreAvatar, uplaodS3, patchAvatar);

export default router;
