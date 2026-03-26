import AppDataSource from "./datasource";
import express from 'express';
import { errorHandler } from "./middleware/errorHandler";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes";

async function main() {
    await AppDataSource.initialize();

    const app = express();

    app.use(express.json());
    app.use(cookieParser());

    app.use('/auth', authRouter);

    app.use(errorHandler);

    app.listen(3000, () => console.log('Server is running on http://localhost:3000'));
}

main();