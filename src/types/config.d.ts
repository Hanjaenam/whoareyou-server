export interface SendMailParams {
  type: 'register' | 'newPassword';
  to: string;
  secret: string;
}
