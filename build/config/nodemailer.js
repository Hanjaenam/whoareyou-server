"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const nodemailer_mailgun_transport_1 = __importDefault(require("nodemailer-mailgun-transport"));
const mailgunOptions = {
    auth: {
        api_key: process.env.MAIL_GUN_API_KEY,
        domain: process.env.MAIL_GUN_DOMAIN,
    },
};
const transport = nodemailer_mailgun_transport_1.default(mailgunOptions);
const client = nodemailer_1.default.createTransport(transport);
exports.default = ({ type, to, secret }) => {
    const subject = type === 'register'
        ? `${secret}, WhoAreYou 계정 활성화 코드입니다.`
        : `${secret}, WhoAreYou 계정 복구 코드입니다.`;
    const html = type === 'register'
        ? `원활환 활동을 위해 계정 활성화 코드인 <h1>${secret}</h1> 를 입력해주시길 바랍니다.`
        : `계정 복구를 위해 계정 복구 코드인 <h1>${secret}</h1> 를 입력해주시길 바랍니다.`;
    return client.sendMail({
        from: 'WhoAreYou@Community.com',
        to,
        subject,
        html,
    });
};
//# sourceMappingURL=nodemailer.js.map