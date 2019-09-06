import express from 'express';
import routes from 'routes';
import { follow, unfollow } from 'controllers/follow';

const router = express.Router();

router.post(routes.home, follow);
router.delete(routes.home, unfollow);

export default router;
