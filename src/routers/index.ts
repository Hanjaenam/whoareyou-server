import api from './api';
import express from 'express';
import routes from 'routes';

const router = express.Router();

router.use(routes.api, api);

export default router;
