import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
    path: path.join(__dirname, '../../.env')
});

const PORT = process.env['PORT'] || 4000;
const JWT_SECRET_KEY = process.env['JWT_SECRET_KEY'] || 'qwerty';
const POSTGRES_HOST = process.env['POSTGRES_HOST'];
const POSTGRES_PORT = Number(process.env['POSTGRES_PORT']);
const POSTGRES_USER = process.env['POSTGRES_USER'];
const POSTGRES_PASSWORD = process.env['POSTGRES_PASSWORD'];
const POSTGRES_DATABASE = process.env['POSTGRES_DB'];
const USE_FASTIFY = process.env['USE_FASTIFY'] === 'true';

export { PORT, JWT_SECRET_KEY, POSTGRES_HOST, POSTGRES_PORT, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DATABASE, USE_FASTIFY };
