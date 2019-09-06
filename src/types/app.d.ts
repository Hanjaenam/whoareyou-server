export interface CUDRows {
  affectedRows: number;
}

export interface User {
  id: number;
  email: string;
  name: string;
  introduce: string | null;
  avatar: string | null;
  coverImg: string | null;
  valid: boolean;
  secret: string;
  naverId: string | null;
  googleId: string | null;
  createdAt: string;
}

export interface ValidateUser {
  salt: string;
  hash: string;
}
export interface ErrorWithStatus {
  status?: number;
  name: string;
  message: string;
  stack?: string;
}
export interface AuthRegisterBody {
  email: string;
  name: string;
  provider: 'local' | 'google' | 'naver';
  avatar?: string;
  password?: string;
}
export interface SendMailParams {
  type: 'register' | 'newPassword';
  to: string;
  secret: string;
}
export interface ReqUser {
  id: number;
  iat: number;
  exp: number;
}
