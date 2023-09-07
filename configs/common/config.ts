export const HOST_BACKEND = process.env['HOST_BACKEND'] || 'localhost';
export const HOST_FRONTEND = process.env['HOST_FRONTEND'] || 'localhost';
export const PORT_BACKEND = process.env['PORT'] || 4000;
export const PORT_FRONTEND = process.env['PORT_FRONTEND'] || 3000;
export const SESSION_SECRET_KEY =
  process.env['SESSION_SECRET_KEY'] || 'qwertyuiop[]';
export const SESSION_SECRET_SALT =
  process.env['SESSION_SECRET_SALT'] || 'qwertyuiop[]';
export const POSTGRES_HOST = process.env['POSTGRES_HOST'];
export const POSTGRES_PORT = Number(process.env['POSTGRES_PORT']);
export const POSTGRES_USER = process.env['POSTGRES_USER'];
export const POSTGRES_PASSWORD = process.env['POSTGRES_PASSWORD'];
export const POSTGRES_DATABASE = process.env['POSTGRES_DB'];
export const CLOUDINARY_CLOUD_NAME = process.env['CLOUDINARY_CLOUD_NAME'];
export const CLOUDINARY_API_KEY = process.env['CLOUDINARY_API_KEY'];
export const CLOUDINARY_API_SECRET = process.env['CLOUDINARY_API_SECRET'];
export const ADMIN_LOGIN = process.env['ADMIN_LOGIN'] || 'admin';
export const ADMIN_PASSWORD = process.env['ADMIN_PASSWORD'] || 'admin';
