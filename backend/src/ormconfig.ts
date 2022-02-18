import { ConnectionOptions } from 'typeorm';
import path from 'path';
import { POSTGRES_HOST, POSTGRES_PORT, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DATABASE } from './common/config';

export const connectionOptions = {
    type: 'postgres',
    host: POSTGRES_HOST,
    port: POSTGRES_PORT,
    username: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DATABASE,
    migrationsRun: false,
    synchronize: true,
    logging: false,
    keepConnectionAlive: true,
    autoReconnect: true,
    reconnectTries: 100,
    reconnectionInterval: 2000,
    entities: [path.join(__dirname, './resources/**/*.model.ts')],
    // migrations: [path.join(__dirname, './migrations/*.ts')],
    // cli: {
    //     migrationsDir: './migrations',
    // },
} as ConnectionOptions;
