import express from 'express';
import routes from 'routes';
import {
  logIn,
  register,
  google,
  googleCallback,
  naver,
  naverCallback,
  verifySecretKey,
  changePassword,
  sendSecretKey,
} from 'controllers/auth';
import { requiredData } from 'middlewares/common';
import {
  isNotExistedUser,
  isExistedUser,
  createGoogleAccount,
  createNaverAccount,
} from 'middlewares/auth';

const router = express.Router();

// 1. email, password - 필수 데이터
router.post(routes.logIn, requiredData(['email', 'password']), logIn);
// 1. email, name, password 필수 body 데이터
// 2. 존재하는 유저 : req.user
router.post(
  routes.register,
  requiredData(['email', 'name', 'password']),
  isNotExistedUser,
  register,
);
// 1. email - 필수데이터
// 2. 존재하는 유저 : req.user
router.post(
  routes.sendSecretKey,
  requiredData(['email', 'type']),
  isExistedUser,
  sendSecretKey,
);
// 1. email, secret - 필수 데이터
// 2. 존재하는 유저
router.post(
  routes.verifySecretKey,
  requiredData(['email', 'secret']),
  isExistedUser,
  verifySecretKey,
);
// 1. password - 필수데이터
// 2. 존재하는 유저 : req.user
router.patch(
  routes.changePasswod,
  requiredData(['email', 'password', 'secret']),
  isExistedUser,
  changePassword,
);
// google oauth
router.get(routes.google, google);
router.get(routes.googleCallback, googleCallback, createGoogleAccount);
// naver oauth
router.get(routes.naver, naver);
router.get(routes.naverCallback, naverCallback, createNaverAccount);

export default router;
