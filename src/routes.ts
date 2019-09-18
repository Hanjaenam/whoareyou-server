const HOME = '/';
const API = '/api';

const USER = '/user';
const AVATAR = '/avatar';
const ME = '/me';

const AUTH = '/auth';
const LOG_IN = '/logIn';
const REGISTER = '/register';
const VERIFY_SECRET_KEY = '/verifySecretKey';
const SEND_SECRET_KEY = '/sendSecretKey';
const CHANGE_PASSWORD = '/changePassword';
const GOOGLE = '/google';
const GOOGLE_CALLBACK = '/google/callback';
const NAVER = '/naver';
const NAVER_CALLBACK = '/naver/callback';

const FOLLOW = '/follow';

const ARTICLE = '/article';

const ID = '/:id';
const CREATOR = '/:creator';
const TAG = '/tag';

export default {
  home: HOME,
  api: API,

  user: USER,
  me: ME,
  avatar: AVATAR,

  auth: AUTH,
  logIn: LOG_IN,
  register: REGISTER,
  verifySecretKey: VERIFY_SECRET_KEY,
  sendSecretKey: SEND_SECRET_KEY,
  changePasswod: CHANGE_PASSWORD,
  google: GOOGLE,
  googleCallback: GOOGLE_CALLBACK,
  naver: NAVER,
  naverCallback: NAVER_CALLBACK,

  follow: FOLLOW,

  article: ARTICLE,

  id: ID,
  creator: CREATOR,
  tag: TAG,
};
