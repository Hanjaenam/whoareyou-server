"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pool_1 = __importDefault(require("database/pool"));
const awsS3_1 = __importDefault(require("config/awsS3"));
const queries_1 = require("database/queries");
exports.removePhotos = (req, res, next) => pool_1.default
    .query(queries_1.PHOTO.GET.ALL.LOC_WR_ARTICLE, [req.params.id])
    .then(([rows]) => {
    const locations = rows;
    const params = {
        Bucket: process.env.BUCKET,
        Delete: {
            Objects: locations.map(data => ({
                Key: data.location.substr(data.location.indexOf('articles')),
            })),
            Quiet: false,
        },
    };
    awsS3_1.default.deleteObjects(params, (err, _) => err ? next(err) : next());
})
    .catch(next);
//# sourceMappingURL=article.js.map