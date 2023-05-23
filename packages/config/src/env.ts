import { config } from 'dotenv';
config();

export default {
  PORT_BACKEND: Number(process.env.PORT_BACKEND ?? 4000),
  // PORT_FRONTEND: Number(process.env.PORT_FRONTEND ?? 3000),
};
