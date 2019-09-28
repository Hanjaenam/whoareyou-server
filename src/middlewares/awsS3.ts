import s3 from 'config/awsS3';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { Key } from 'types/middlewares/awsS3';

export default (key: Key): multer.Instance =>
  multer({
    storage: multerS3({
      s3,
      bucket: `${process.env.BUCKET}/${key}`,
      acl: 'public-read',
    }),
  });
