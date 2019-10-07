import express from 'express';
import routes from 'routes';
import { create, remove } from 'controllers/bookmark';
import { authRequired, isMine, isExistedArticle } from 'middlewares/common';

const router = express.Router();

router.post(
  routes.articleId + routes.bookmark,
  ...authRequired,
  isExistedArticle,
  create,
);
router.delete(
  routes.articleId + routes.bookmark,
  ...authRequired,
  isMine('bookmark'),
  remove,
);

export default router;
