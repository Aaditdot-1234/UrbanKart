"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = require("path");
dotenv_1.default.config();
const isCompiled = !__filename.endsWith('.ts');
const AppDataSource = new typeorm_1.DataSource({
    type: process.env.DB_TYPE,
    database: process.env.DB_DATABASE ?? "database.db",
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true',
    entities: [
        (0, path_1.join)(__dirname, 'entities', isCompiled ? '*.js' : '*.ts')
    ],
    migrations: [
        (0, path_1.join)(__dirname, 'migrations', isCompiled ? '*.js' : '*.ts')
    ]
});
exports.default = AppDataSource;
