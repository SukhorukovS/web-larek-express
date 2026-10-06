import path from 'path';

const {
  PORT = 3000,
  DB_ADDRESS = 'mongodb://127.0.0.1:27017/weblarek',
  JWT_SECRET = 'dev-secret',
  AUTH_REFRESH_TOKEN_EXPIRY = '7d',
  AUTH_ACCESS_TOKEN_EXPIRY = '10m',
  UPLOAD_PATH = 'images',
  UPLOAD_PATH_TEMP = 'temp',
} = process.env;

export default {
  PORT,
  DB_ADDRESS,
  JWT_SECRET,
  AUTH_REFRESH_TOKEN_EXPIRY,
  AUTH_ACCESS_TOKEN_EXPIRY,
  UPLOAD_TEMP_DIR: path.join(__dirname, '..', UPLOAD_PATH_TEMP),
  UPLOAD_IMAGE_DIR: path.join(__dirname, 'public', UPLOAD_PATH),
};
