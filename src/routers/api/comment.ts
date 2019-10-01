import express from 'express';
import routes from 'routes';
import {
  authRequired,
  isExistedArticle,
  requiredData,
  isMine,
} from 'middlewares/common';
import { create, remove, getAll, patch } from 'controllers/comment';

const router = express.Router();

// 댓글 읽어오기 -> 권한 X
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
  isMine('comment'),
  remove,
);
router.patch(
  routes.articleId + routes.comment + routes.id,
  ...authRequired,
  requiredData(['content']),
  isExistedArticle,
  isMine('comment'),
  patch,
);

export default router;
