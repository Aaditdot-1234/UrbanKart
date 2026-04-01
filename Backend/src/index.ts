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

    app.use('/auth', authRouter);
    app.use('/category', requireAuth, categoryRouter);
    app.use('/product', productRouter);
    app.use('/cart', requireAuth, cartRouter);
    app.use('/address', requireAuth, addressRouter);
    app.use('/order', requireAuth, orderRouter);
    app.use('/payment', requireAuth, paymentRoutes);
    app.use('/review', requireAuth, reviewRoutes);

    app.use(errorHandler);

    app.listen(3000, () => console.log('Server is running on http://localhost:3000'));
}

main();