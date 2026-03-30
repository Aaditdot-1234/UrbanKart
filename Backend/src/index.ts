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

async function main() {
    await AppDataSource.initialize();

    const app = express();

    app.use(cors({
        origin: 'http://localhost:4200',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }));

    app.use(express.json());
    app.use(cookieParser());

    app.use('/auth', authRouter);
    app.use('/category', categoryRouter);
    app.use('/product', productRouter);
    app.use('/cart', cartRouter);
    app.use('/address', addressRouter);
    app.use('/order', orderRouter);
    app.use('/payment', paymentRoutes);
    app.use('/review', reviewRoutes);

    app.use(errorHandler);

    app.listen(3000, () => console.log('Server is running on http://localhost:3000'));
}

main();