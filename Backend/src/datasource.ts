import { DataSource } from "typeorm";
import dotenv from 'dotenv';
import { join } from 'path';

dotenv.config();

const isCompiled = !__filename.endsWith('.ts');

const AppDataSource = new DataSource({
    type: process.env.DB_TYPE as "better-sqlite3",
    database: process.env.DB_DATABASE ?? "database.db",
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true',
    entities: [
        join(__dirname, 'entities', isCompiled ? '*.js' : '*.ts')
    ],
    migrations: [
        join(__dirname, 'migrations', isCompiled ? '*.js' : '*.ts')
    ]
});

export default AppDataSource;