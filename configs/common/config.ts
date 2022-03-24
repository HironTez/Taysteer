import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.join(__dirname, '../../../../.env'),
});

const PORT_BACKEND = process.env['PORT_BACKEND'];
const PORT_FRONTEND = process.env['PORT_FRONTEND'];
const SESSION_SECRET_KEY = process.env['SESSION_SECRET_KEY'];
const SESSION_SECRET_SALT = process.env['SESSION_SECRET_SALT'];
const POSTGRES_HOST = process.env['POSTGRES_HOST'];
const POSTGRES_PORT = Number(process.env['POSTGRES_PORT']);
const POSTGRES_USER = process.env['POSTGRES_USER'];
const POSTGRES_PASSWORD = process.env['POSTGRES_PASSWORD'];
const POSTGRES_DATABASE = process.env['POSTGRES_DB'];
const CLOUDINARY_CLOUD_NAME = process.env['CLOUDINARY_CLOUD_NAME'];
const CLOUDINARY_API_KEY = process.env['CLOUDINARY_API_KEY'];
const CLOUDINARY_API_SECRET = process.env['CLOUDINARY_API_SECRET'];
const ADMIN_LOGIN = process.env['ADMIN_LOGIN'];
const ADMIN_PASSWORD = process.env['ADMIN_PASSWORD'];

export {
  PORT_BACKEND,
  PORT_FRONTEND,
  SESSION_SECRET_KEY,
  SESSION_SECRET_SALT,
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DATABASE,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  ADMIN_LOGIN,
  ADMIN_PASSWORD,
};
