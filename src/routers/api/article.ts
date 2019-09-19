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
import { authRequired } from 'middlewares/common';
import multerS3 from 'middlewares/awsS3';
import { isMine, removePhotos } from 'middlewares/article';
import comment from './comment';

const router = express.Router();

//comment
router.use(comment);

// 둘러보기 getAll - 권한 풀어주기
router.get(routes.home, getAll);

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
router.delete(routes.id, ...authRequired, isMine, removePhotos, remove);

// 권한 필수
// router.patch(routes.id, patch);

export default router;
