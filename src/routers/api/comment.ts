import express from 'express';
import routes from 'routes';
import { isExistedArticle, requiredData, isMine } from 'middlewares/common';
import { create, remove, getAll, patch } from 'controllers/comment';

const router = express.Router();

router.get(routes.articleId + routes.comment, getAll);
router.post(
  routes.articleId + routes.comment,
  requiredData(['content']),
  create,
);
router.delete(
  routes.articleId + routes.comment + routes.id,
  isExistedArticle,
  isMine('comment'),
  remove,
);
router.patch(
  routes.articleId + routes.comment + routes.id,
  requiredData(['content']),
  isExistedArticle,
  isMine('comment'),
  patch,
);

export default router;
