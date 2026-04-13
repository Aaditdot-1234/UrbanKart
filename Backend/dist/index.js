"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const datasource_1 = __importDefault(require("./datasource"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const errorHandler_1 = require("./middleware/errorHandler");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const cartRoutes_1 = __importDefault(require("./routes/cartRoutes"));
const addressRoutes_1 = __importDefault(require("./routes/addressRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes"));
const authMidlleware_1 = require("./middleware/authMidlleware");
const Users_1 = require("./entities/Users");
const seed_1 = require("./seeding/seed");
const passport_1 = __importDefault(require("passport"));
require("./auth/passport");
require("./cronjob/cronjob");
const path_1 = __importDefault(require("path"));
const ratelimiter_1 = require("./middleware/ratelimiter");
async function main() {
    await datasource_1.default.initialize();
    const app = (0, express_1.default)();
    const userCount = await datasource_1.default.getRepository(Users_1.Users).count();
    if (userCount === 0) {
        await (0, seed_1.seed)(datasource_1.default);
        console.log("Database seeded");
    }
    else {
        console.log("Database already has data, skipping seed.");
    }
    app.use((0, cors_1.default)({
        origin: 'http://localhost:4200',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }));
    app.use(express_1.default.json());
    app.use((0, cookie_parser_1.default)());
    app.use(passport_1.default.initialize());
    app.use(ratelimiter_1.globalLimiter);
    app.use('/api/auth', authRoutes_1.default);
    app.use('/api/category', categoryRoutes_1.default);
    app.use('/api/product', productRoutes_1.default);
    app.use('/api/cart', authMidlleware_1.requireAuth, cartRoutes_1.default);
    app.use('/api/address', authMidlleware_1.requireAuth, addressRoutes_1.default);
    app.use('/api/order', authMidlleware_1.requireAuth, orderRoutes_1.default);
    app.use('/api/payment', authMidlleware_1.requireAuth, paymentRoutes_1.default);
    app.use('/api/review', reviewRoutes_1.default);
    app.use('/api/images', express_1.default.static('public'));
    app.use(errorHandler_1.errorHandler);
    const publicPath = path_1.default.join(__dirname, 'public');
    app.use(express_1.default.static(publicPath));
    app.get('/{*path}', (req, res) => {
        res.sendFile(path_1.default.join(publicPath, 'index.html'));
    });
    app.listen(3000, () => console.log('Server is running on http://localhost:3000'));
}
main();
