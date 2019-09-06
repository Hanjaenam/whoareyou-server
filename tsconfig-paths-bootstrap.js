// 절대경로 설정하기 위한 js
const tsConfig = require('./tsconfig.json');
const tsConfigPaths = require('tsconfig-paths');

const isEnvProduction = process.env.NODE_ENV === 'production';

const cleanup = tsConfigPaths.register({
  baseUrl: isEnvProduction ? 'build' : tsConfig.compilerOptions.baseUrl,
  paths: [],
});
