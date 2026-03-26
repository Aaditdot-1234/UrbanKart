import { DataSource } from "typeorm";
import dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
    type: process.env.DB_TYPE as "better-sqlite3",
    database: process.env.DB_DATABASE ?? "database.db",
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true',
    entities: ['src/entities/**/*.ts'],
    migrations: ['src/migrations/**/*.ts']
})

export default AppDataSource;