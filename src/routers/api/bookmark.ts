import express from 'express';
import routes from 'routes';
import { create, remove } from 'controllers/bookmark';
import { isMine, isExistedArticle } from 'middlewares/common';

const router = express.Router();

router.post(routes.articleId + routes.bookmark, isExistedArticle, create);
router.delete(routes.articleId + routes.bookmark, isMine('favorite'), remove);

export default router;
