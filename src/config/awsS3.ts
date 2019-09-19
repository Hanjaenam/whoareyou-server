import aws from 'aws-sdk';

const params = {
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: 'ap-northeast-2',
};

export default new aws.S3(params);
