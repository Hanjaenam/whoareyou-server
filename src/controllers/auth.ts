import passport from 'passport';
import pool from 'database/pool';
import sendEmail from 'config/sendGrid';
import { generatePbkdf2, isUpdated, checkUpdated } from 'utils';
import { generateJwt } from 'config/jsonwebtoken';
import { USER } from 'database/queries';
import { Request, Response, NextFunction } from 'express';
import { LogIn, Basic } from 'types/database/user';
import { IdEmlSecrt, OnlyId } from 'types/database/user';

export const logIn = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> =>
  passport.authenticate(
    'local',
    { session: false },
    (error, user: LogIn, info) => {
      if (error) return next(error);
      if (!user)
        return res
          .status(422)
          .json(info)
          .end();
      if (!user.valid)
        return res
          .status(401)
          .json({ message: '보안코드를 입력하시지 않으셨습니다.' })
          .end();
      const token = generateJwt(user.id);
      const { valid, ...rest } = user;
      return res.json({ ...rest, token }).end();
    },
  )(req, res, next);

export const register = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const {
    body: { email, name, password, avatar },
  } = req;
  const { salt, hash } = generatePbkdf2(password);
  const secret = Math.round(Math.random() * 1000000).toString();
  return pool
    .query(USER.CREATE(avatar), [email, name, salt, hash, secret])
    .then(([rows]) => {
      if (!isUpdated(rows)) return res.status(500).end();

      return sendEmail({ type: 'register', to: email, secret })
        .then(() => res.status(200).end())
        .catch(next);
    })
    .catch(next);
};

export const sendSecretKey = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const secret = Math.floor(100000 + Math.random() * 900000).toString();
  return pool
    .query(USER.PATCH({ secret }), [(req.user as IdEmlSecrt).id])
    .then(([rows]) => {
      if (!isUpdated(rows)) return res.status(500).end();
      return sendEmail({
        type: req.body.type,
        to: (req.user as IdEmlSecrt).email,
        secret,
      })
        .then(() => res.status(200).end())
        .catch(next);
    }) //query(USER.PATCH)
    .catch(next);
};

export const verifySecretKey = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> | void =>
  (req.user as IdEmlSecrt).secret !== req.body.secret
    ? res
        .status(403)
        .json({ message: '보안코드가 일치하지 않습니다.' })
        .end()
    : pool
        .query(USER.PATCH({ valid: true, secret: null }), [
          (req.user as IdEmlSecrt).id,
        ])
        .then(([rows2]) => {
          if (!isUpdated(rows2)) return res.status(500).end();
          pool
            .query(USER.GET.ONE.BASIC('id'), (req.user as IdEmlSecrt).id)
            .then(([rows3]) =>
              res
                .json({
                  ...(rows3 as Basic[])[0],
                  token: generateJwt((req.user as IdEmlSecrt).id),
                })
                .end(),
            )
            .catch(next);
        })
        .catch(next);

export const changePassword = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { salt, hash } = generatePbkdf2(req.body.password);
  return pool
    .query(USER.PATCH({ hash, salt }), [(req.user as IdEmlSecrt).id])
    .then(([rows]) => checkUpdated(rows, res))
    .catch(next);
};

export const google = passport.authenticate('google', {
  scope: ['profile', 'email'],
});

export const googleCallback = (
  req: Request,
  res: Response,
  next: NextFunction,
): void =>
  passport.authenticate('google', (error, user, _) => {
    if (error) return next(error);
    const {
      id,
      _json: { email, name, picture },
    } = user;

    return pool
      .query(USER.GET.ONE.ID_WR_EML, [email])
      .then(([rows]) => {
        const user = rows as OnlyId[];
        // user is already existed
        if (user.length === 1) {
          const token = generateJwt(user[0].id);
          const redirectUrl =
            process.env.NODE_ENV === 'development'
              ? `http://localhost:3000/#/callback?token=${token}`
              : `${process.env.PRODUCTION_URL}/#/callback?token=${token}`;
          return pool
            .query(USER.PATCH({ googleId: id }), [user[0].id])
            .then(() => res.redirect(redirectUrl))
            .catch(next);
        }
        // next create user
        res.locals = {
          googleId: id,
          email,
          name,
          picture,
        };
        return next();
      })
      .catch(next); // pool.query(USER.GET_ONE)
  })(req, res, next);

export const naver = passport.authenticate('naver');

export const naverCallback = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> =>
  passport.authenticate('naver', (error, user, _) => {
    if (error) return next(error);
    const {
      id,
      _json: { email, profile_image, nickname },
    } = user;

    pool
      .query(USER.GET.ONE.ID_WR_EML, [email])
      .then(([rows]) => {
        // user is already existed
        const user = rows as OnlyId[];
        if (user.length === 1) {
          const token = generateJwt(user[0].id);
          const redirectUrl =
            process.env.NODE_ENV === 'development'
              ? `http://localhost:3000/#/callback?token=${token}`
              : `${process.env.PRODUCTION_URL}/#/callback?token=${token}`;
          return pool
            .query(USER.PATCH({ naverId: id }), [user[0].id])
            .then(() => res.redirect(redirectUrl))
            .catch(next);
        }
        // create user
        res.locals = {
          naverId: id,
          email,
          profile_image,
          nickname,
        };
        return next();
      })
      .catch(next); //pool.query(USER.GET_ONE)
  })(req, res, next);
