"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("app"));
const pool_1 = require("database/pool");
pool_1.testConnection();
app_1.default.listen(app_1.default.get('port'), () => {
    console.log('✅ Server is Running ... >>', app_1.default.get('port'));
});
//# sourceMappingURL=index.js.map