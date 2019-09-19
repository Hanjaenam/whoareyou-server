import express from 'express';
import routes from 'routes';
import { authRequired, requiredData } from 'middlewares/common';
import { create, remove, getAll } from 'controllers/comment';
import { isMine, isExistedArticle } from 'middlewares/comment';

const router = express.Router();

router.get(routes.articleId + routes.comment, getAll);
router.post(
  routes.articleId + routes.comment,
  ...authRequired,
  requiredData(['content']),
  create,
);
router.delete(
  routes.articleId + routes.comment + routes.id,
  ...authRequired,
  isExistedArticle,
  isMine,
  remove,
);

export default router;
