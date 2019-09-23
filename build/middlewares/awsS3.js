"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const awsS3_1 = __importDefault(require("config/awsS3"));
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
exports.default = (key) => multer_1.default({
    storage: multer_s3_1.default({
        s3: awsS3_1.default,
        bucket: `${process.env.BUCKET}/${key}`,
        acl: 'public-read',
    }),
});
//# sourceMappingURL=awsS3.js.map