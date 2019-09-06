import nodemailer from 'nodemailer';
import mailgunTransport from 'nodemailer-mailgun-transport';
import { SendMailParams } from 'types/app';

const mailgunOptions = {
  auth: {
    api_key: process.env.MAIL_GUN_API_KEY,
    domain: process.env.MAIL_GUN_DOMAIN,
  },
};
const transport = mailgunTransport(mailgunOptions);
const client = nodemailer.createTransport(transport);

export default ({ type, to, secret }: SendMailParams): Promise<any> => {
  const subject =
    type === 'register'
      ? `${secret}, WhoAreYou 계정 활성화 코드입니다.`
      : `${secret}, WhoAreYou 계정 복구 코드입니다.`;
  const html =
    type === 'register'
      ? `원활환 활동을 위해 계정 활성화 코드인 <h1>${secret}</h1> 를 입력해주시길 바랍니다.`
      : `계정 복구를 위해 계정 복구 코드인 <h1>${secret}</h1> 를 입력해주시길 바랍니다.`;

  return client.sendMail({
    from: 'WhoAreYou@Community.com',
    to,
    subject,
    html,
  });
};
