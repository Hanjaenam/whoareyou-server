import express from 'express';
import routes from 'routes';
import {
  getOne,
  getAll,
  create,
  remove,
  patch,
  getCreator,
} from 'controllers/article';
import favorite from './favorite';
import bookmark from './bookmark';
import comment from './comment';
import { authRequired, isMine } from 'middlewares/common';
import multerS3 from 'middlewares/awsS3';
import { removePhotos, setLocalsUser } from 'middlewares/article';

const router = express.Router();

router.use(comment);
router.use(favorite);
router.use(bookmark);

// favorite route에만 authRequired가 적용되는 것이 아니라 현재 아래 코드 전체가
// authRequired호출되고 실행된다.
// router.use(...authRequired,favorite);
// router.use(favorite);

// 둘러보기 getAll - 권한 풀어주기
// BASIC 쿼리에선 req.user.id가 필요하지 않고, 나머지는 필요하므로
// error handling은 제외시킴
router.get(routes.category, setLocalsUser, getAll);

// 둘러보기 getOne -  권한 풀어주기
router.get(routes.id, getOne);
router.get(routes.id + routes.creator, getCreator);

// 권한 필수
router.post(
  routes.home,
  ...authRequired,
  multerS3('articles').array('photos', 50),
  create,
);

// 권한 필수
router.delete(
  routes.id,
  ...authRequired,
  isMine('article'),
  removePhotos,
  remove,
);

// 권한 필수
// router.patch(routes.id, patch);

export default router;
