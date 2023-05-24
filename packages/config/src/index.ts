import { config as configureDotENV } from 'dotenv';

configureDotENV();

export const PORT_BACKEND = Number(process.env.PORT_BACKEND ?? 4000);
// export const PORT_FRONTEND = Number(process.env.PORT_FRONTEND ?? 3000)
export const SESSION_SECRET_KEY = process.env.SESSION_SECRET_KEY;
export const SESSION_SECRET_SALT = process.env.SESSION_SECRET_SALT;
