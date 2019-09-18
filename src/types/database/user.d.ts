export interface Basic {
  id: number;
  email: string;
  name: string;
  avatar: string | null;
  introduce: string | null;
  createdAt: string;
}
export interface OnlyAvatar {
  avatar: string;
}
export interface OnlyId {
  id: number;
}
export interface IdNameAvt {
  id: number;
  name: string;
  avtar: string;
}
export interface IdEmlSecrt {
  id: number;
  email: string;
  secret: string;
}
export interface HashSalt {
  hash: string;
  salt: string;
}
export interface PwdHashSalt {
  password: string;
  hash: string;
  salt: string;
}
export interface LogIn {
  id: number;
  email: string;
  name: string;
  avatar: string | null;
  introduce: string | null;
  createdAt: string;
  valid: boolean;
}
export interface Passport extends LogIn {
  salt: string;
  hash: string;
}
