import express from 'express';
import routes from 'routes';
import { create, remove } from 'controllers/favorite';
import { isMine, isExistedArticle } from 'middlewares/common';

const router = express.Router();

router.delete(routes.articleId + routes.favorite, isMine('favorite'), remove);
router.post(routes.articleId + routes.favorite, isExistedArticle, create);

export default router;
