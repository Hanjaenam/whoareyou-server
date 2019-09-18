import passport from 'passport';
import pool from 'database/pool';
import routes from 'routes';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as NaverStrategy } from 'passport-naver';
import USER from 'database/queries/user';
import { Passport } from 'types/database/user';
import { validatePassword } from 'utils';

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: false,
    },
    (email, password, done): void => {
      pool
        .query(USER.PASSPORT, [email])
        .then(([rows]) => {
          const user = rows as Passport[];
          if (user.length === 0)
            return done(null, false, {
              message: '없는 이메일입니다.',
            });
          if (
            !validatePassword({
              password,
              hash: user[0].hash,
              salt: user[0].salt,
            })
          )
            return done(null, false, {
              message: '비밀번호가 일치하지 않습니다.',
            });

          const { hash, salt, ...rest } = user[0];
          return done(null, rest);
        })
        .catch(err => done(err)); // pool.query(PASSPORT_LOGIN)
    },
  ),
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET_KEY,
      callbackURL: routes.api + routes.auth + routes.googleCallback,
    },
    (_, __, profile, done): void => done(null, profile),
  ),
);

passport.use(
  new NaverStrategy(
    {
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_SECRET_KEY,
      callbackURL: routes.api + routes.auth + routes.naverCallback,
    },
    (_, __, profile, done): void => done(null, profile),
  ),
);
