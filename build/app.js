"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./config/env");
require("./config/passport");
const routers_1 = __importDefault(require("./routers"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const passport_1 = __importDefault(require("passport"));
const cors_1 = __importDefault(require("cors"));
// * app.locals
// Once set, the value of app.locals properties persist throughout the life of the application,
// in contrast with res.locals properties that are valid only for the lifetime of the request.
const app = express_1.default();
const isProduction = process.env.NODE_ENV === 'production';
//enable pre-flight
app.set('port', process.env.PORT);
app.set('env', process.env.NODE_ENV);
if (process.env.NODE_ENV === 'production') {
    console.log('✅ cors origin >>', origin);
    app.use(cors_1.default({ origin: 'https://whoru.netlify.com' }));
}
app.use(helmet_1.default());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(morgan_1.default('dev'));
app.use(passport_1.default.initialize());
app.use(routers_1.default);
/// catch 404 and forward to error handler
app.use((_, __, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    return next(error);
});
// development error handler
// will print stacktrace
if (!isProduction) {
    app.use((error, _, res) => {
        console.log(error);
        return res
            .status(error.status || 500)
            .json({
            errors: {
                message: error.message,
                error,
            },
        })
            .end();
    });
}
// production error handler
// no stacktraces leaked to user
app.use((error, _, res) => res
    .status(error.status || 500)
    .json({
    errors: {
        message: error.message,
    },
})
    .end());
exports.default = app;
//# sourceMappingURL=app.js.map