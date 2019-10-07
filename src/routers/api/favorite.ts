import express from 'express';
import routes from 'routes';
import { create, remove } from 'controllers/favorite';
import { authRequired, isMine, isExistedArticle } from 'middlewares/common';

const router = express.Router();

router.delete(
  routes.articleId + routes.favorite,
  ...authRequired,
  isMine('favorite'),
  remove,
);
router.post(
  routes.articleId + routes.favorite,
  ...authRequired,
  isExistedArticle,
  create,
);

export default router;
