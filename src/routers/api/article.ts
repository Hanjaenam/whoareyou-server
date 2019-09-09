import express from 'express';
import routes from 'routes';
import { getOne, getAll, create, remove, patch } from 'controllers/article';
const router = express.Router();

router.get(routes.home, getAll);
// router.get(routes.id, getOne);
// router.post(routes.home, create);
// router.delete(routes.id, remove);
// router.patch(routes.id, patch);

export default router;
