import './config/env';
import './config/passport';
import routers from './routers';
import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';
import { ErrorWithStatus } from 'types/app';

// * app.locals
// Once set, the value of app.locals properties persist throughout the life of the application,
// in contrast with res.locals properties that are valid only for the lifetime of the request.

const app = express();
const isProduction = process.env.NODE_ENV === 'production';

//enable pre-flight
app.set('port', process.env.PORT);
app.set('env', process.env.NODE_ENV);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(passport.initialize());

app.use(routers);

/// catch 404 and forward to error handler
app.use((_, __, next: NextFunction): void => {
  const error: ErrorWithStatus = new Error('Not Found');
  error.status = 404;
  return next(error);
});

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use((error: ErrorWithStatus, _: Request, res: Response): void => {
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
app.use((error: ErrorWithStatus, _: Request, res: Response): void =>
  res
    .status(error.status || 500)
    .json({
      errors: {
        message: error.message,
      },
    })
    .end(),
);

export default app;
