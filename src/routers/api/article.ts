import express from 'express';
import routes from 'routes';
import { getOne, getAll, create, remove, patch } from 'controllers/article';
import { authRequired } from 'middlewares';
import multerS3 from 'middlewares/awsS3';

const router = express.Router();

// 둘러보기 getAll - 권한 풀어주기
router.get(routes.home, getAll);

// 둘러보기 getOne -  권한 풀어주기
router.get(routes.id, getOne);

// 권한 필수
router.post(
  routes.home,
  ...authRequired,
  multerS3('article').array('photos', 50),
  create,
);

// 권한 필수
// router.delete(routes.id, remove);

// 권한 필수
// router.patch(routes.id, patch);

export default router;
