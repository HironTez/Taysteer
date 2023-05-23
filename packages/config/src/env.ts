import {config} from "dotenv";
config();

export default {
  PORT_BACKEND: Number(process.env.PORT_BACKEND ?? 4000),
  PORT: Number(process.env.PORT ?? 3000),
};
