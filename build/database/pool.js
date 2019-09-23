"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const host = process.env.NODE_ENV === 'production' ? 'localhost' : process.env.DB_URL;
const pool = promise_1.default.createPool({
    connectionLimit: Number(process.env.CONNECTION_LIMIT),
    host,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});
exports.testConnection = () => pool
    .getConnection()
    .then(conn => {
    console.log('✅ MySQL connect success');
    conn.release();
})
    .catch(error => {
    if (error)
        console.log('❌ MySQL connect error: ', error);
    process.exit(1);
});
exports.default = pool;
//# sourceMappingURL=pool.js.map