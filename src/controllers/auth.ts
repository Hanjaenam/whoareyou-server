import passport from 'passport';
import pool from 'database/pool';
import sendEmail from 'config/nodemailer';
import { generateJwt, generatePbkdf2, isUpdated, checkUpdated } from 'utils';
import { USER } from 'database/queries';
import { Request, Response, NextFunction } from 'express';
import { User } from 'types/app';

export const logIn = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> =>
  passport.authenticate(
    'local',
    { session: false },
    (error, user: User, info) => {
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
      return res.json({ user, token }).end();
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
        .then(() =>
          res
            .status(200)
            .json({ message: `${email} 로 보안코드가 전송되었습니다.` })
            .end(),
        )
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
    .query(USER.PATCH({ secret }), [(req.user as User).id])
    .then(([rows]) => {
      if (!isUpdated(rows)) return res.status(500).end();
      return sendEmail({
        type: req.body.type,
        to: (req.user as User).email,
        secret,
      })
        .then(() => res.status(200).end())
        .catch(next);
    })
    .catch(next);
};

export const verifySecretKey = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> | void =>
  (req.user as User).secret !== req.body.secret
    ? res
        .status(403)
        .json({ message: '보안코드가 일치하지 않습니다.' })
        .end()
    : pool
        .query(USER.PATCH({ valid: true, secret: null }), [
          (req.user as User).id,
        ])
        .then(([rows2]) => {
          if (!isUpdated(rows2)) return res.status(500).end();
          const token = generateJwt((req.user as User).id);
          return res.json({ user: req.user, token }).end();
        })
        .catch(next);

export const changePassword = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { salt, hash } = generatePbkdf2(req.body.password);
  return pool
    .query(USER.PATCH({ hash, salt }), [(req.user as User).id])
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
): Promise<void> =>
  passport.authenticate('google', (error, user, _) => {
    if (error) return next(error);
    const {
      id,
      _json: { email, name, picture },
    } = user;

    return pool
      .query(USER.GET_ONE('email'), [email])
      .then(([rows]) => {
        // user is already existed
        if ((rows as User[]).length === 1) {
          const token = generateJwt((rows as User[])[0].id);
          return pool
            .query(USER.PATCH({ googleId: id }), [email])
            .then(() => res.redirect(`http://localhost:3000/#/?token=${token}`))
            .catch(next);
        }
        // create user
        return pool
          .query(USER.CREATE_GOOGLE, [email, name, id, picture])
          .then(([rows2]) => {
            if (!isUpdated(rows2)) return res.status(500).end();

            return pool
              .query(USER.GET_ONE('email'), [email])
              .then(([rows]) => {
                const token = generateJwt((rows as User[])[0].id);
                return res.redirect(`http://localhost:3000/#/?token=${token}`);
              })
              .catch(next);
          })
          .catch(next);
      })
      .catch(next);
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
      .query(USER.GET_ONE('email'), [email])
      .then(([rows]) => {
        // user is already existed
        if ((rows as User[]).length === 1) {
          const token = generateJwt((rows as User[])[0].id);
          return pool
            .query(USER.PATCH({ naverId: id }), [email])
            .then(() => res.redirect(`http://localhost:3000/#/?token=${token}`))
            .catch(next);
        }
        // create user
        return pool
          .query(USER.CREATE_NAVER, [email, nickname, id, profile_image])
          .then(([rows2]) => {
            if (!isUpdated(rows2)) return res.status(500).end();
            return pool
              .query(USER.GET_ONE('email'), [email])
              .then(([rows]) => {
                const token = generateJwt((rows as User[])[0].id);
                return res.redirect(`http://localhost:3000/#/?token=${token}`);
              })
              .catch(next);
          })
          .catch(next);
      })
      .catch(next);
  })(req, res, next);
