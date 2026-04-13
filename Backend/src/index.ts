import 'reflect-metadata';
import AppDataSource from "./datasource";
import express from 'express';
import cors from 'cors';
import { errorHandler } from "./middleware/errorHandler";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes";
import categoryRouter from "./routes/categoryRoutes";
import productRouter from "./routes/productRoutes";
import cartRouter from "./routes/cartRoutes";
import addressRouter from "./routes/addressRoutes";
import orderRouter from "./routes/orderRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import { requireAuth } from "./middleware/authMidlleware";
import { Users } from "./entities/Users";
import { seed } from "./seeding/seed";
import passport from "passport";
import "./auth/passport";
import './cronjob/cronjob';
import images from "./controllers/imagesController";
import path from "path";
import { globalLimiter } from "./middleware/ratelimiter";

async function main() {
    await AppDataSource.initialize();

    const app = express();

    const userCount = await AppDataSource.getRepository(Users).count();

    if (userCount === 0) {
        await seed(AppDataSource);
        console.log("Database seeded");
    }
    else {
        console.log("Database already has data, skipping seed.");
    }

    app.use(cors({
        origin: 'http://localhost:4200',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }));


    app.use(express.json());
    app.use(cookieParser());
    app.use(passport.initialize());

    app.use(globalLimiter);

    app.use('/api/auth', authRouter);
    app.use('/api/category', categoryRouter);
    app.use('/api/product', productRouter);
    app.use('/api/cart', requireAuth, cartRouter);
    app.use('/api/address', requireAuth, addressRouter);
    app.use('/api/order', requireAuth, orderRouter);
    app.use('/api/payment', requireAuth, paymentRoutes);
    app.use('/api/review', reviewRoutes);
    app.use('/api/images', express.static('public'));

    app.use(errorHandler);

    const publicPath = path.join(__dirname, 'public')
    app.use(express.static(publicPath))
    app.get('/{*path}', (req,res) => {
        res.sendFile(path.join(publicPath, 'index.html'))
    })

    app.listen(3000, () => console.log('Server is running on http://localhost:3000'));
}

main();