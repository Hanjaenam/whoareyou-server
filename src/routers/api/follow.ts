import express from 'express';
import routes from 'routes';
import { create, remove } from 'controllers/follow';
import { authRequired } from 'middlewares/common';

const router = express.Router();

router.post(routes.home, ...authRequired, create);
router.delete(routes.home, ...authRequired, remove);

export default router;
