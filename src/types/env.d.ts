declare namespace NodeJS {
  export interface Process {
    env: ProcessEnv;
  }
  export interface ProcessEnv {
    NODE_ENV: 'development' | 'production';
    PORT: string | '4000';
    DB_USER: string;
    DB_PASSWORD: string;
    CONNECTION_LIMIT: string | '10';
    DB_URL: string;
    DB_PORT: string;
    DB_DATABASE: string;
    JWT_SECRET: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_SECRET_KEY: string;
    NAVER_CLIENT_ID: string;
    NAVER_SECRET_KEY: string;
    MAIL_GUN_API_KEY: string;
    MAIL_GUN_DOMAIN: string;
    AWS_ACCESS_KEY: string;
    AWS_SECRET_KEY: string;
  }
}
