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

router.get(routes.me, getMe);
// router.get(routes.home, getAll);
// router.get(routes.id, getOne);
router.delete(routes.home, remove);
// 1. 최소한 name, avatar 두개 중 하나의 데이터는 보내야 한다.
router.patch(
  routes.home,
  haveAtLeastOneData(['name', 'avatar', 'introduce']),
  patch,
);
router.patch(
  routes.changePasswod,
  requiredData(['prePassword', 'newPassword']),
  isValidPassword,
  changePassword,
);
router.patch(routes.avatar, deletePreAvatar, uplaodS3, patchAvatar);

export default router;
