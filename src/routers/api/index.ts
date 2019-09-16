import auth from './auth';
import article from './article';
import express, { Request, NextFunction, Response } from 'express';
import routes from 'routes';
import user from './user';
import { authRequired } from 'middlewares';
import { QueryError } from 'mysql2';
import pool from 'database/pool';

const router = express.Router();

router.post(
  '/t',
  (req: Request, res: Response, next: NextFunction): Promise<void> =>
    pool
      .query('INSERT INTO test(content) VALUES("tetetet")')
      .then(([rows]) => {
        console.log(rows);
        return res.status(200).end();
      })
      .catch(next),
);

router.use(routes.auth, auth);
// ...authRequired : Authorization Header - token 검사
router.use(routes.user, ...authRequired, user);
// ...authRequired : Authorization Header - token 검사
router.use(routes.article, article);

router.use(
  (err: QueryError, req: Request, res: Response, next: NextFunction): void => {
    // mySql column 잘못됐을 때 error
    if (1364 === err.errno || 1406 === err.errno) {
      console.log('--- Query Error ---');
      console.log(err);
      return res.status(422).end();
    }
    // app.ts - 라우터 맨 아래 use로 이동
    return next(err);
  },
);
export default router;
