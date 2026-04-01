import { Types } from "../entities/Types";
import { Categories } from "../entities/Categories";
import { SubCategories } from "../entities/SubCategories";
import { Products } from "../entities/Products";
import { ProductImages } from "../entities/ProductImages";
import { Users, UserRole } from "../entities/Users";
import { Address } from "../entities/Address";
import { Orders, OrderStatus } from "../entities/Orders";
import { OrderedProducts } from "../entities/OrderedProducts";
import { Payments, PaymentMethod, PaymentStatus } from "../entities/Payments";
import { Reviews } from "../entities/Reviews";
import bcrypt from 'bcrypt';
import { DataSource } from "typeorm";

function daysAgo(n: number): Date {
    return new Date(Date.now() - n * 86400000);
}
function daysAhead(n: number): Date {
    return new Date(Date.now() + n * 86400000);
}

export async function seed(dataSource: DataSource) {
    console.log('Database connected. Starting seed...');

    const typeRepo = dataSource.getRepository(Types);
    const categoryRepo = dataSource.getRepository(Categories);
    const subCategoryRepo = dataSource.getRepository(SubCategories);
    const productRepo = dataSource.getRepository(Products);
    const productImagesRepo = dataSource.getRepository(ProductImages);
    const userRepo = dataSource.getRepository(Users);
    const addressRepo = dataSource.getRepository(Address);
    const orderRepo = dataSource.getRepository(Orders);
    const orderedProductsRepo = dataSource.getRepository(OrderedProducts);
    const paymentsRepo = dataSource.getRepository(Payments);
    const reviewsRepo = dataSource.getRepository(Reviews);

    const existingTypes = await typeRepo.count();
    if (existingTypes > 0) {
        console.log('Database already seeded. Exiting.');
        await dataSource.destroy();
        return;
    }

    // ─── TYPES ───────────────────────────────────────────────────────────────
    const typeNames = ['Electronics', 'Fashion', 'Groceries & Food', 'Home & Kitchen', 'Sports & Beauty'];
    const savedTypes: Types[] = [];
    for (const type_name of typeNames) {
        savedTypes.push(await typeRepo.save(typeRepo.create({ type_name })));
    }
    console.log(`Seeded ${savedTypes.length} types`);

    // ─── CATEGORIES ──────────────────────────────────────────────────────────
    const categoryData = [
        // Electronics (type 0)
        { category_name: 'Smartphones & Tablets', category_description: 'Mobile phones, tablets, and accessories', types: savedTypes[0] },
        { category_name: 'Computers & Accessories', category_description: 'Laptops, desktops, and peripherals', types: savedTypes[0] },
        { category_name: 'Audio & Visual', category_description: 'Headphones, speakers, TVs and monitors', types: savedTypes[0] },
        // Fashion (type 1)
        { category_name: "Men's Fashion", category_description: 'Clothing and accessories for men', types: savedTypes[1] },
        { category_name: "Women's Fashion", category_description: 'Clothing and accessories for women', types: savedTypes[1] },
        { category_name: 'Footwear & Bags', category_description: 'Shoes, sandals, bags, and wallets', types: savedTypes[1] },
        // Groceries (type 2)
        { category_name: 'Fresh Produce & Dairy', category_description: 'Fruits, vegetables, dairy products', types: savedTypes[2] },
        { category_name: 'Snacks & Beverages', category_description: 'Snacks, drinks, juices and more', types: savedTypes[2] },
        { category_name: 'Pantry Staples', category_description: 'Rice, grains, oils, spices, and condiments', types: savedTypes[2] },
        // Home & Kitchen (type 3)
        { category_name: 'Cookware & Appliances', category_description: 'Pots, pans, and kitchen appliances', types: savedTypes[3] },
        { category_name: 'Furniture & Decor', category_description: 'Home furniture and decorative items', types: savedTypes[3] },
        { category_name: 'Bedding & Bath', category_description: 'Bed sheets, towels, and bath accessories', types: savedTypes[3] },
        // Sports & Beauty (type 4)
        { category_name: 'Fitness & Sports', category_description: 'Exercise equipment and sports gear', types: savedTypes[4] },
        { category_name: 'Beauty & Skincare', category_description: 'Face care, body lotions, and beauty products', types: savedTypes[4] },
        { category_name: 'Personal Care', category_description: 'Hair care, oral care, and hygiene products', types: savedTypes[4] },
    ];
    const savedCategories: Categories[] = [];
    for (const c of categoryData) {
        savedCategories.push(await categoryRepo.save(categoryRepo.create(c)));
    }
    console.log(`Seeded ${savedCategories.length} categories`);

    // ─── SUBCATEGORIES ────────────────────────────────────────────────────────
    const subCategoryData = [
        // Smartphones & Tablets (cat 0)
        { subcategory_name: 'Android Phones', subcategory_description: 'Latest Android smartphones', categories: savedCategories[0] },
        { subcategory_name: 'Apple iPhones', subcategory_description: 'iPhone and Apple mobile devices', categories: savedCategories[0] },
        { subcategory_name: 'Tablets & E-readers', subcategory_description: 'iPads, Android tablets, Kindle', categories: savedCategories[0] },
        // Computers & Accessories (cat 1)
        { subcategory_name: 'Laptops', subcategory_description: 'Windows and Mac laptops', categories: savedCategories[1] },
        { subcategory_name: 'Keyboards & Mice', subcategory_description: 'Computer input devices', categories: savedCategories[1] },
        { subcategory_name: 'Storage & Memory', subcategory_description: 'SSDs, HDDs, RAM, USB drives', categories: savedCategories[1] },
        // Audio & Visual (cat 2)
        { subcategory_name: 'Headphones & Earbuds', subcategory_description: 'Wired and wireless audio', categories: savedCategories[2] },
        { subcategory_name: 'Bluetooth Speakers', subcategory_description: 'Portable and home speakers', categories: savedCategories[2] },
        { subcategory_name: 'TVs & Monitors', subcategory_description: 'Smart TVs and computer monitors', categories: savedCategories[2] },
        // Men's Fashion (cat 3)
        { subcategory_name: "Men's T-Shirts & Casual", subcategory_description: 'Casual wear for men', categories: savedCategories[3] },
        { subcategory_name: "Men's Formal Wear", subcategory_description: 'Suits, shirts, and formal attire', categories: savedCategories[3] },
        { subcategory_name: "Men's Outerwear", subcategory_description: 'Jackets, coats, and hoodies', categories: savedCategories[3] },
        // Women's Fashion (cat 4)
        { subcategory_name: "Women's Dresses", subcategory_description: 'Casual and formal dresses', categories: savedCategories[4] },
        { subcategory_name: "Women's Tops & Blouses", subcategory_description: 'Tops, blouses, and shirts', categories: savedCategories[4] },
        { subcategory_name: "Women's Activewear", subcategory_description: 'Gym and athleisure clothing', categories: savedCategories[4] },
        // Footwear & Bags (cat 5)
        { subcategory_name: 'Sneakers & Casual Shoes', subcategory_description: 'Everyday casual footwear', categories: savedCategories[5] },
        { subcategory_name: 'Formal & Dress Shoes', subcategory_description: 'Heels, oxfords, and loafers', categories: savedCategories[5] },
        { subcategory_name: 'Bags & Wallets', subcategory_description: 'Handbags, backpacks, and wallets', categories: savedCategories[5] },
        // Fresh Produce & Dairy (cat 6)
        { subcategory_name: 'Fruits & Vegetables', subcategory_description: 'Fresh seasonal produce', categories: savedCategories[6] },
        { subcategory_name: 'Dairy Products', subcategory_description: 'Milk, cheese, butter, yogurt', categories: savedCategories[6] },
        { subcategory_name: 'Eggs & Poultry', subcategory_description: 'Fresh eggs and chicken', categories: savedCategories[6] },
        // Snacks & Beverages (cat 7)
        { subcategory_name: 'Chips & Crackers', subcategory_description: 'Savory snacks and crisps', categories: savedCategories[7] },
        { subcategory_name: 'Juices & Soft Drinks', subcategory_description: 'Packaged drinks and juices', categories: savedCategories[7] },
        { subcategory_name: 'Tea & Coffee', subcategory_description: 'Hot beverages and blends', categories: savedCategories[7] },
        // Pantry Staples (cat 8)
        { subcategory_name: 'Rice & Grains', subcategory_description: 'Basmati, white rice, oats, quinoa', categories: savedCategories[8] },
        { subcategory_name: 'Oils & Condiments', subcategory_description: 'Cooking oils, sauces, and condiments', categories: savedCategories[8] },
        { subcategory_name: 'Spices & Herbs', subcategory_description: 'Whole and ground spices', categories: savedCategories[8] },
        // Cookware & Appliances (cat 9)
        { subcategory_name: 'Pots & Pans', subcategory_description: 'Non-stick and stainless cookware', categories: savedCategories[9] },
        { subcategory_name: 'Kitchen Appliances', subcategory_description: 'Mixers, toasters, microwaves', categories: savedCategories[9] },
        { subcategory_name: 'Bakeware & Utensils', subcategory_description: 'Baking trays, spatulas, ladles', categories: savedCategories[9] },
        // Furniture & Decor (cat 10)
        { subcategory_name: 'Living Room Furniture', subcategory_description: 'Sofas, coffee tables, shelves', categories: savedCategories[10] },
        { subcategory_name: 'Lighting & Lamps', subcategory_description: 'LED lights, table lamps, chandeliers', categories: savedCategories[10] },
        { subcategory_name: 'Wall Art & Decor', subcategory_description: 'Paintings, frames, and decorative pieces', categories: savedCategories[10] },
        // Bedding & Bath (cat 11)
        { subcategory_name: 'Bed Sheets & Covers', subcategory_description: 'Cotton and microfiber bed linen', categories: savedCategories[11] },
        { subcategory_name: 'Towels & Robes', subcategory_description: 'Bath and hand towels', categories: savedCategories[11] },
        { subcategory_name: 'Pillows & Cushions', subcategory_description: 'Sleeping pillows and sofa cushions', categories: savedCategories[11] },
        // Fitness & Sports (cat 12)
        { subcategory_name: 'Exercise Equipment', subcategory_description: 'Dumbbells, resistance bands, treadmills', categories: savedCategories[12] },
        { subcategory_name: 'Yoga & Pilates', subcategory_description: 'Mats, blocks, and straps', categories: savedCategories[12] },
        { subcategory_name: 'Sports Clothing', subcategory_description: 'Athletic wear and jerseys', categories: savedCategories[12] },
        // Beauty & Skincare (cat 13)
        { subcategory_name: 'Face Care', subcategory_description: 'Moisturizers, serums, and cleansers', categories: savedCategories[13] },
        { subcategory_name: 'Body Lotions & Oils', subcategory_description: 'Body moisturizers and massage oils', categories: savedCategories[13] },
        { subcategory_name: 'Sunscreen & SPF', subcategory_description: 'Sun protection products', categories: savedCategories[13] },
        // Personal Care (cat 14)
        { subcategory_name: 'Hair Care', subcategory_description: 'Shampoos, conditioners, and treatments', categories: savedCategories[14] },
        { subcategory_name: 'Oral Care', subcategory_description: 'Toothbrushes, toothpaste, and mouthwash', categories: savedCategories[14] },
        { subcategory_name: 'Deodorants & Perfumes', subcategory_description: 'Body sprays, deodorants, and fragrances', categories: savedCategories[14] },
    ];
    const savedSubCategories: SubCategories[] = [];
    for (const sc of subCategoryData) {
        savedSubCategories.push(await subCategoryRepo.save(subCategoryRepo.create(sc)));
    }
    console.log(`Seeded ${savedSubCategories.length} subcategories`);

    // ─── PRODUCTS ─────────────────────────────────────────────────────────────
    // 5 products per subcategory = 225 products total
    type ProductTemplate = {
        product_name: string; product_description: string;
        product_price: number; stock: number; subIdx: number;
        mfgDaysAgo: number; expiryDaysAhead: number | null;
    };
    const productTemplates: ProductTemplate[] = [
        // ── Android Phones (subIdx 0)
        { product_name: 'Samsung Galaxy S24 Ultra', product_description: 'Flagship Android with 200MP camera and S Pen', product_price: 1299.99, stock: 45, subIdx: 0, mfgDaysAgo: 90, expiryDaysAhead: null },
        { product_name: 'Google Pixel 8 Pro', product_description: 'AI-powered smartphone with 7-year update guarantee', product_price: 999.00, stock: 30, subIdx: 0, mfgDaysAgo: 120, expiryDaysAhead: null },
        { product_name: 'OnePlus 12', product_description: 'Snapdragon 8 Gen 3 with 50W wireless charging', product_price: 799.00, stock: 60, subIdx: 0, mfgDaysAgo: 80, expiryDaysAhead: null },
        { product_name: 'Samsung Galaxy A55', product_description: 'Mid-range Android with 50MP camera', product_price: 449.99, stock: 100, subIdx: 0, mfgDaysAgo: 60, expiryDaysAhead: null },
        { product_name: 'Xiaomi 14 Pro', product_description: 'Leica optics and 90W HyperCharge', product_price: 699.00, stock: 55, subIdx: 0, mfgDaysAgo: 70, expiryDaysAhead: null },
        // ── Apple iPhones (subIdx 1)
        { product_name: 'iPhone 15 Pro Max', product_description: 'Titanium design with A17 Pro chip and ProRes video', product_price: 1199.99, stock: 40, subIdx: 1, mfgDaysAgo: 100, expiryDaysAhead: null },
        { product_name: 'iPhone 15', product_description: 'Dynamic Island and 48MP main camera', product_price: 799.99, stock: 75, subIdx: 1, mfgDaysAgo: 100, expiryDaysAhead: null },
        { product_name: 'iPhone 14 Plus', product_description: 'Large screen with excellent battery life', product_price: 699.99, stock: 50, subIdx: 1, mfgDaysAgo: 200, expiryDaysAhead: null },
        { product_name: 'iPhone SE (3rd Gen)', product_description: 'Compact iPhone with A15 Bionic chip', product_price: 429.99, stock: 80, subIdx: 1, mfgDaysAgo: 300, expiryDaysAhead: null },
        { product_name: 'Apple Watch Series 9', product_description: 'Advanced health tracking with S9 chip', product_price: 399.99, stock: 65, subIdx: 1, mfgDaysAgo: 90, expiryDaysAhead: null },
        // ── Tablets & E-readers (subIdx 2)
        { product_name: 'iPad Pro 12.9"', product_description: 'M2 chip with Liquid Retina XDR display', product_price: 1099.00, stock: 35, subIdx: 2, mfgDaysAgo: 150, expiryDaysAhead: null },
        { product_name: 'Samsung Galaxy Tab S9', product_description: 'Android tablet with AMOLED and S Pen', product_price: 799.99, stock: 40, subIdx: 2, mfgDaysAgo: 110, expiryDaysAhead: null },
        { product_name: 'Amazon Kindle Paperwhite', product_description: 'Waterproof e-reader with adjustable warm light', product_price: 139.99, stock: 120, subIdx: 2, mfgDaysAgo: 180, expiryDaysAhead: null },
        { product_name: 'iPad Air (5th Gen)', product_description: 'M1 chip with 10.9" Liquid Retina display', product_price: 749.00, stock: 50, subIdx: 2, mfgDaysAgo: 200, expiryDaysAhead: null },
        { product_name: 'Lenovo Tab P12 Pro', product_description: 'Premium Android tablet with 12.6" AMOLED', product_price: 599.99, stock: 30, subIdx: 2, mfgDaysAgo: 130, expiryDaysAhead: null },
        // ── Laptops (subIdx 3)
        { product_name: 'MacBook Pro 14" M3', product_description: 'Apple M3 chip, 16GB RAM, Liquid Retina XDR', product_price: 1999.00, stock: 25, subIdx: 3, mfgDaysAgo: 80, expiryDaysAhead: null },
        { product_name: 'Dell XPS 15', product_description: 'Intel i9, 32GB RAM, OLED display', product_price: 1799.00, stock: 20, subIdx: 3, mfgDaysAgo: 100, expiryDaysAhead: null },
        { product_name: 'ASUS ROG Zephyrus G16', product_description: 'RTX 4080, Ryzen 9, 240Hz gaming display', product_price: 2499.00, stock: 15, subIdx: 3, mfgDaysAgo: 60, expiryDaysAhead: null },
        { product_name: 'Lenovo ThinkPad X1 Carbon', product_description: 'Business ultrabook with Intel Core Ultra 7', product_price: 1499.00, stock: 30, subIdx: 3, mfgDaysAgo: 90, expiryDaysAhead: null },
        { product_name: 'HP Pavilion 15', product_description: 'AMD Ryzen 5, 8GB RAM, 512GB SSD', product_price: 649.00, stock: 60, subIdx: 3, mfgDaysAgo: 120, expiryDaysAhead: null },
        // ── Keyboards & Mice (subIdx 4)
        { product_name: 'Logitech MX Keys S', product_description: 'Wireless keyboard with smart illumination', product_price: 119.99, stock: 90, subIdx: 4, mfgDaysAgo: 200, expiryDaysAhead: null },
        { product_name: 'Razer BlackWidow V4', product_description: 'Mechanical keyboard with Razer Green switches', product_price: 139.99, stock: 75, subIdx: 4, mfgDaysAgo: 150, expiryDaysAhead: null },
        { product_name: 'Logitech MX Master 3S', product_description: 'Wireless mouse with MagSpeed scrolling', product_price: 99.99, stock: 100, subIdx: 4, mfgDaysAgo: 180, expiryDaysAhead: null },
        { product_name: 'Apple Magic Keyboard with Touch ID', product_description: 'Slim wireless keyboard for Mac', product_price: 99.00, stock: 85, subIdx: 4, mfgDaysAgo: 250, expiryDaysAhead: null },
        { product_name: 'Keychron K2 Pro', product_description: 'Compact wireless mechanical keyboard', product_price: 89.99, stock: 110, subIdx: 4, mfgDaysAgo: 160, expiryDaysAhead: null },
        // ── Storage & Memory (subIdx 5)
        { product_name: 'Samsung 990 Pro 2TB SSD', product_description: 'PCIe 4.0 NVMe SSD with 7450MB/s read', product_price: 149.99, stock: 80, subIdx: 5, mfgDaysAgo: 100, expiryDaysAhead: null },
        { product_name: 'WD Black 4TB HDD', product_description: '3.5" desktop hard drive for gaming storage', product_price: 89.99, stock: 65, subIdx: 5, mfgDaysAgo: 200, expiryDaysAhead: null },
        { product_name: 'Corsair Vengeance 32GB DDR5', product_description: 'DDR5-5200 RAM kit with XMP support', product_price: 119.99, stock: 70, subIdx: 5, mfgDaysAgo: 120, expiryDaysAhead: null },
        { product_name: 'SanDisk 256GB USB-C Drive', product_description: 'High-speed portable flash drive USB 3.2', product_price: 29.99, stock: 200, subIdx: 5, mfgDaysAgo: 300, expiryDaysAhead: null },
        { product_name: 'Seagate Backup Plus 2TB', product_description: 'Portable external hard drive', product_price: 69.99, stock: 90, subIdx: 5, mfgDaysAgo: 180, expiryDaysAhead: null },
        // ── Headphones & Earbuds (subIdx 6)
        { product_name: 'Sony WH-1000XM5', product_description: 'Industry-leading noise canceling headphones', product_price: 349.99, stock: 55, subIdx: 6, mfgDaysAgo: 120, expiryDaysAhead: null },
        { product_name: 'Apple AirPods Pro (2nd Gen)', product_description: 'ANC earbuds with Adaptive Audio', product_price: 249.00, stock: 80, subIdx: 6, mfgDaysAgo: 100, expiryDaysAhead: null },
        { product_name: 'Bose QuietComfort 45', product_description: 'Premium ANC headphones with 24h battery', product_price: 279.99, stock: 45, subIdx: 6, mfgDaysAgo: 150, expiryDaysAhead: null },
        { product_name: 'Samsung Galaxy Buds2 Pro', product_description: 'True wireless earbuds with Hi-Fi and ANC', product_price: 199.99, stock: 70, subIdx: 6, mfgDaysAgo: 130, expiryDaysAhead: null },
        { product_name: 'JBL Tune 770NC', product_description: 'Wireless adaptive noise canceling headphones', product_price: 99.99, stock: 95, subIdx: 6, mfgDaysAgo: 180, expiryDaysAhead: null },
        // ── Bluetooth Speakers (subIdx 7)
        { product_name: 'JBL Charge 5', product_description: 'Portable speaker with 20h battery and powerbank', product_price: 179.99, stock: 60, subIdx: 7, mfgDaysAgo: 140, expiryDaysAhead: null },
        { product_name: 'Bose SoundLink Max', product_description: 'Premium portable speaker with 360° sound', product_price: 399.99, stock: 35, subIdx: 7, mfgDaysAgo: 80, expiryDaysAhead: null },
        { product_name: 'Sony SRS-XB43', product_description: 'Extra bass wireless speaker 24h battery', product_price: 149.99, stock: 70, subIdx: 7, mfgDaysAgo: 200, expiryDaysAhead: null },
        { product_name: 'Marshall Emberton II', product_description: 'Iconic portable speaker with 30h playtime', product_price: 149.99, stock: 50, subIdx: 7, mfgDaysAgo: 160, expiryDaysAhead: null },
        { product_name: 'Anker Soundcore Motion X600', product_description: 'Hi-Res audio speaker with spatial sound', product_price: 109.99, stock: 85, subIdx: 7, mfgDaysAgo: 120, expiryDaysAhead: null },
        // ── TVs & Monitors (subIdx 8)
        { product_name: 'LG OLED 55" C3', product_description: '55" OLED evo 4K TV with Dolby Vision', product_price: 1299.00, stock: 20, subIdx: 8, mfgDaysAgo: 90, expiryDaysAhead: null },
        { product_name: 'Samsung 65" Neo QLED 4K', product_description: 'Quantum Mini LED 4K TV with AI processor', product_price: 1499.00, stock: 15, subIdx: 8, mfgDaysAgo: 100, expiryDaysAhead: null },
        { product_name: 'Dell 27" S2722DC Monitor', product_description: '4K USB-C IPS monitor 60Hz', product_price: 449.99, stock: 40, subIdx: 8, mfgDaysAgo: 180, expiryDaysAhead: null },
        { product_name: 'LG UltraGear 27" 144Hz', product_description: 'Gaming monitor 1ms G-Sync compatible', product_price: 329.99, stock: 50, subIdx: 8, mfgDaysAgo: 150, expiryDaysAhead: null },
        { product_name: 'Sony X85L 43" 4K TV', product_description: 'Google TV with X-Reality PRO processor', product_price: 699.00, stock: 30, subIdx: 8, mfgDaysAgo: 120, expiryDaysAhead: null },
        // ── Men's T-Shirts & Casual (subIdx 9)
        { product_name: "Levi's Classic Crew Neck Tee", product_description: '100% cotton crew neck t-shirt', product_price: 24.99, stock: 200, subIdx: 9, mfgDaysAgo: 180, expiryDaysAhead: null },
        { product_name: 'Nike Dri-FIT Training T-Shirt', product_description: 'Moisture-wicking performance tee', product_price: 34.99, stock: 180, subIdx: 9, mfgDaysAgo: 150, expiryDaysAhead: null },
        { product_name: 'H&M Slim Fit Polo Shirt', product_description: 'Slim fit polo in stretch cotton piqué', product_price: 19.99, stock: 220, subIdx: 9, mfgDaysAgo: 200, expiryDaysAhead: null },
        { product_name: 'Ralph Lauren Classic Chinos', product_description: 'Stretch straight-fit chino pants', product_price: 79.99, stock: 150, subIdx: 9, mfgDaysAgo: 160, expiryDaysAhead: null },
        { product_name: 'Zara Men Slim Jeans', product_description: 'Dark indigo slim-fit jeans with stretch', product_price: 49.99, stock: 175, subIdx: 9, mfgDaysAgo: 120, expiryDaysAhead: null },
        // ── Men's Formal Wear (subIdx 10)
        { product_name: 'Arrow Men Formal Shirt', product_description: 'Wrinkle-free formal shirt for office wear', product_price: 44.99, stock: 160, subIdx: 10, mfgDaysAgo: 200, expiryDaysAhead: null },
        { product_name: 'Raymond Slim Suit Blazer', product_description: 'Single-breasted blazer in charcoal grey', product_price: 199.99, stock: 80, subIdx: 10, mfgDaysAgo: 300, expiryDaysAhead: null },
        { product_name: 'Van Heusen Tie Set (3pcs)', product_description: 'Set of 3 silk ties in classic patterns', product_price: 39.99, stock: 120, subIdx: 10, mfgDaysAgo: 250, expiryDaysAhead: null },
        { product_name: 'Park Avenue Formal Trousers', product_description: 'Flat-front trousers in pure cotton', product_price: 59.99, stock: 140, subIdx: 10, mfgDaysAgo: 180, expiryDaysAhead: null },
        { product_name: 'Louis Philippe Waistcoat', product_description: 'Formal waistcoat for suit ensembles', product_price: 89.99, stock: 60, subIdx: 10, mfgDaysAgo: 240, expiryDaysAhead: null },
        // ── Men's Outerwear (subIdx 11)
        { product_name: 'The North Face Nuptse Jacket', product_description: '700-fill down puffer for extreme cold', product_price: 299.99, stock: 70, subIdx: 11, mfgDaysAgo: 180, expiryDaysAhead: null },
        { product_name: 'Adidas Track Jacket', product_description: 'Classic 3-stripe track jacket', product_price: 69.99, stock: 130, subIdx: 11, mfgDaysAgo: 150, expiryDaysAhead: null },
        { product_name: 'H&M Hooded Sweatshirt', product_description: 'Relaxed hoodie in soft cotton blend', product_price: 34.99, stock: 200, subIdx: 11, mfgDaysAgo: 120, expiryDaysAhead: null },
        { product_name: 'Columbia Watertight Rain Jacket', product_description: 'Packable rain jacket with sealed seams', product_price: 89.99, stock: 90, subIdx: 11, mfgDaysAgo: 200, expiryDaysAhead: null },
        { product_name: 'Zara Men Smart Blazer', product_description: 'Structured slim blazer for smart-casual', product_price: 119.99, stock: 85, subIdx: 11, mfgDaysAgo: 130, expiryDaysAhead: null },
        // ── Women's Dresses (subIdx 12)
        { product_name: 'Zara Floral Midi Dress', product_description: 'Flowy midi with floral print and v-neck', product_price: 59.99, stock: 140, subIdx: 12, mfgDaysAgo: 120, expiryDaysAhead: null },
        { product_name: 'H&M Wrap Dress', product_description: 'Classic wrap dress in woven fabric', product_price: 39.99, stock: 180, subIdx: 12, mfgDaysAgo: 150, expiryDaysAhead: null },
        { product_name: 'ASOS Little Black Dress', product_description: 'Fitted sleeveless LBD for evenings', product_price: 49.99, stock: 120, subIdx: 12, mfgDaysAgo: 100, expiryDaysAhead: null },
        { product_name: 'Mango Linen Shirt Dress', product_description: 'Relaxed linen shirt dress with pockets', product_price: 69.99, stock: 100, subIdx: 12, mfgDaysAgo: 80, expiryDaysAhead: null },
        { product_name: 'Only Maxi Boho Dress', product_description: 'Bohemian maxi with tiered ruffle hem', product_price: 44.99, stock: 130, subIdx: 12, mfgDaysAgo: 110, expiryDaysAhead: null },
        // ── Women's Tops & Blouses (subIdx 13)
        { product_name: 'Vero Moda Floral Blouse', product_description: 'Lightweight woven blouse with pattern', product_price: 29.99, stock: 200, subIdx: 13, mfgDaysAgo: 130, expiryDaysAhead: null },
        { product_name: 'Zara Ribbed Tank Top (2pcs)', product_description: 'Pack of 2 fitted ribbed tank tops', product_price: 22.99, stock: 250, subIdx: 13, mfgDaysAgo: 160, expiryDaysAhead: null },
        { product_name: 'H&M Oversized Sweatshirt', product_description: 'Relaxed sweatshirt in fleece fabric', product_price: 27.99, stock: 220, subIdx: 13, mfgDaysAgo: 140, expiryDaysAhead: null },
        { product_name: 'Mango Satin Blouse', product_description: 'Silky satin blouse with relaxed collar', product_price: 49.99, stock: 150, subIdx: 13, mfgDaysAgo: 90, expiryDaysAhead: null },
        { product_name: 'Gap Classic White Oxford Shirt', product_description: 'Crisp Oxford shirt in 100% cotton', product_price: 54.99, stock: 170, subIdx: 13, mfgDaysAgo: 200, expiryDaysAhead: null },
        // ── Women's Activewear (subIdx 14)
        { product_name: 'Lululemon Align Leggings 25"', product_description: 'Buttery soft high-rise yoga leggings', product_price: 98.00, stock: 110, subIdx: 14, mfgDaysAgo: 100, expiryDaysAhead: null },
        { product_name: 'Nike Pro Sports Bra', product_description: 'Medium support compression Dri-FIT bra', product_price: 39.99, stock: 180, subIdx: 14, mfgDaysAgo: 120, expiryDaysAhead: null },
        { product_name: 'Adidas Tiro Track Pants', product_description: 'Soccer-inspired tapered track pants', product_price: 54.99, stock: 150, subIdx: 14, mfgDaysAgo: 140, expiryDaysAhead: null },
        { product_name: 'Under Armour HeatGear Crop', product_description: 'Fitted crop top for high-intensity training', product_price: 34.99, stock: 170, subIdx: 14, mfgDaysAgo: 130, expiryDaysAhead: null },
        { product_name: 'Puma Seamless Gym Set', product_description: 'Matching leggings and sports bra set', product_price: 79.99, stock: 120, subIdx: 14, mfgDaysAgo: 90, expiryDaysAhead: null },
        // ── Sneakers & Casual Shoes (subIdx 15)
        { product_name: 'Nike Air Force 1 Low', product_description: 'Classic low-top sneaker in white leather', product_price: 99.99, stock: 150, subIdx: 15, mfgDaysAgo: 180, expiryDaysAhead: null },
        { product_name: 'Adidas Ultraboost 23', product_description: 'Premium running shoe with Boost midsole', product_price: 189.99, stock: 100, subIdx: 15, mfgDaysAgo: 120, expiryDaysAhead: null },
        { product_name: 'Converse Chuck Taylor All Star', product_description: 'Iconic canvas high-top in classic black', product_price: 64.99, stock: 200, subIdx: 15, mfgDaysAgo: 200, expiryDaysAhead: null },
        { product_name: 'New Balance 574', product_description: 'Lifestyle sneaker with ENCAP midsole', product_price: 84.99, stock: 130, subIdx: 15, mfgDaysAgo: 150, expiryDaysAhead: null },
        { product_name: 'Vans Old Skool', product_description: 'Classic skate shoe with side stripe', product_price: 69.99, stock: 175, subIdx: 15, mfgDaysAgo: 160, expiryDaysAhead: null },
        // ── Formal & Dress Shoes (subIdx 16)
        { product_name: 'Clarks Desert Boots', product_description: 'Classic suede ankle boots with crepe sole', product_price: 129.99, stock: 90, subIdx: 16, mfgDaysAgo: 200, expiryDaysAhead: null },
        { product_name: 'Steve Madden Block Heel Pumps', product_description: 'Pointed-toe pumps with 3" block heel', product_price: 89.99, stock: 110, subIdx: 16, mfgDaysAgo: 150, expiryDaysAhead: null },
        { product_name: 'Aldo Oxford Brogues', product_description: "Men's leather brogue Oxford in tan", product_price: 99.99, stock: 80, subIdx: 16, mfgDaysAgo: 180, expiryDaysAhead: null },
        { product_name: 'Nine West Strappy Sandals', product_description: "Women's heeled strappy formal sandals", product_price: 74.99, stock: 95, subIdx: 16, mfgDaysAgo: 100, expiryDaysAhead: null },
        { product_name: 'Rockport Business Loafers', product_description: "Men's slip-on loafers with TruTECH", product_price: 109.99, stock: 75, subIdx: 16, mfgDaysAgo: 220, expiryDaysAhead: null },
        // ── Bags & Wallets (subIdx 17)
        { product_name: 'Michael Kors Tote Bag', product_description: 'Pebbled leather tote with zip closure', product_price: 228.00, stock: 60, subIdx: 17, mfgDaysAgo: 120, expiryDaysAhead: null },
        { product_name: 'Fossil Men Leather Wallet', product_description: 'Slim bifold wallet in genuine leather', product_price: 59.99, stock: 150, subIdx: 17, mfgDaysAgo: 180, expiryDaysAhead: null },
        { product_name: 'Herschel Little America Backpack', product_description: '25L backpack with laptop sleeve', product_price: 99.99, stock: 120, subIdx: 17, mfgDaysAgo: 150, expiryDaysAhead: null },
        { product_name: 'Kate Spade Crossbody Bag', product_description: 'Compact saffiano leather crossbody', product_price: 189.00, stock: 55, subIdx: 17, mfgDaysAgo: 90, expiryDaysAhead: null },
        { product_name: 'Samsonite 20" Carry-On', product_description: 'Hardside carry-on with TSA lock and spinner', product_price: 159.99, stock: 70, subIdx: 17, mfgDaysAgo: 200, expiryDaysAhead: null },
        // ── Fruits & Vegetables (subIdx 18)
        { product_name: 'Organic Banana Bunch (6pcs)', product_description: 'Fresh organic bananas rich in potassium', product_price: 2.49, stock: 500, subIdx: 18, mfgDaysAgo: 3, expiryDaysAhead: 7 },
        { product_name: 'Red Apple Pack (1kg)', product_description: 'Crisp and juicy red apples', product_price: 3.99, stock: 400, subIdx: 18, mfgDaysAgo: 2, expiryDaysAhead: 14 },
        { product_name: 'Mixed Salad Greens (200g)', product_description: 'Baby spinach, arugula, and romaine mix', product_price: 3.49, stock: 300, subIdx: 18, mfgDaysAgo: 1, expiryDaysAhead: 5 },
        { product_name: 'Cherry Tomatoes (500g)', product_description: 'Sweet cherry tomatoes for salads', product_price: 2.99, stock: 350, subIdx: 18, mfgDaysAgo: 2, expiryDaysAhead: 10 },
        { product_name: 'Avocado (2pcs)', product_description: 'Ripe Hass avocados, rich in healthy fats', product_price: 3.49, stock: 280, subIdx: 18, mfgDaysAgo: 3, expiryDaysAhead: 5 },
        // ── Dairy Products (subIdx 19)
        { product_name: 'Amul Full Cream Milk (1L)', product_description: 'Pasteurized full cream milk', product_price: 1.79, stock: 600, subIdx: 19, mfgDaysAgo: 1, expiryDaysAhead: 7 },
        { product_name: 'Philadelphia Cream Cheese (200g)', product_description: 'Original smooth cream cheese spread', product_price: 3.99, stock: 300, subIdx: 19, mfgDaysAgo: 5, expiryDaysAhead: 30 },
        { product_name: 'Greek Yogurt (500g)', product_description: 'Thick full-fat Greek yogurt', product_price: 4.49, stock: 350, subIdx: 19, mfgDaysAgo: 2, expiryDaysAhead: 14 },
        { product_name: 'Unsalted Butter (250g)', product_description: 'Pure creamery butter for cooking', product_price: 3.29, stock: 400, subIdx: 19, mfgDaysAgo: 7, expiryDaysAhead: 60 },
        { product_name: 'Aged Cheddar Cheese (400g)', product_description: 'Sharp aged cheddar great for cooking', product_price: 5.99, stock: 250, subIdx: 19, mfgDaysAgo: 10, expiryDaysAhead: 45 },
        // ── Eggs & Poultry (subIdx 20)
        { product_name: 'Free Range Eggs (12pcs)', product_description: 'Farm-fresh free range eggs', product_price: 4.99, stock: 500, subIdx: 20, mfgDaysAgo: 3, expiryDaysAhead: 21 },
        { product_name: 'Chicken Breast (500g)', product_description: 'Boneless skinless chicken, hormone-free', product_price: 6.99, stock: 400, subIdx: 20, mfgDaysAgo: 1, expiryDaysAhead: 3 },
        { product_name: 'Whole Chicken (1.2kg)', product_description: 'Fresh whole chicken for roasting', product_price: 9.99, stock: 250, subIdx: 20, mfgDaysAgo: 1, expiryDaysAhead: 3 },
        { product_name: 'Organic Brown Eggs (6pcs)', product_description: 'Certified organic brown eggs with omega-3', product_price: 4.49, stock: 350, subIdx: 20, mfgDaysAgo: 2, expiryDaysAhead: 21 },
        { product_name: 'Chicken Mince (500g)', product_description: 'Fresh ground chicken for kebabs', product_price: 5.49, stock: 300, subIdx: 20, mfgDaysAgo: 1, expiryDaysAhead: 2 },
        // ── Chips & Crackers (subIdx 21)
        { product_name: "Lay's Classic Salted Chips (200g)", product_description: 'Crispy lightly salted potato chips', product_price: 2.49, stock: 600, subIdx: 21, mfgDaysAgo: 30, expiryDaysAhead: 180 },
        { product_name: 'Pringles Original (165g)', product_description: 'Stackable potato crisps in iconic tube', product_price: 2.99, stock: 500, subIdx: 21, mfgDaysAgo: 45, expiryDaysAhead: 180 },
        { product_name: 'Oreo Original Cookies (300g)', product_description: 'Classic chocolate sandwich cookies', product_price: 3.49, stock: 450, subIdx: 21, mfgDaysAgo: 20, expiryDaysAhead: 180 },
        { product_name: 'Ritz Crackers (200g)', product_description: 'Buttery round crackers for cheese and dip', product_price: 2.79, stock: 400, subIdx: 21, mfgDaysAgo: 25, expiryDaysAhead: 180 },
        { product_name: 'Doritos Nacho Cheese (170g)', product_description: 'Bold nacho cheese tortilla chips', product_price: 2.99, stock: 550, subIdx: 21, mfgDaysAgo: 15, expiryDaysAhead: 180 },
        // ── Juices & Soft Drinks (subIdx 22)
        { product_name: 'Tropicana Orange Juice (1L)', product_description: '100% pure squeezed OJ no added sugar', product_price: 4.49, stock: 400, subIdx: 22, mfgDaysAgo: 7, expiryDaysAhead: 30 },
        { product_name: 'Coca-Cola 1.5L', product_description: 'Original Coca-Cola family bottle', product_price: 2.49, stock: 600, subIdx: 22, mfgDaysAgo: 14, expiryDaysAhead: 365 },
        { product_name: 'Red Bull Energy Drink (250ml)', product_description: 'Original energy drink with taurine', product_price: 2.79, stock: 500, subIdx: 22, mfgDaysAgo: 30, expiryDaysAhead: 365 },
        { product_name: 'Minute Maid Apple Juice (1L)', product_description: 'Apple juice with natural fruit flavors', product_price: 3.29, stock: 350, subIdx: 22, mfgDaysAgo: 10, expiryDaysAhead: 60 },
        { product_name: 'Evian Natural Water (1.5L)', product_description: 'Natural mineral water from French Alps', product_price: 1.99, stock: 700, subIdx: 22, mfgDaysAgo: 90, expiryDaysAhead: 730 },
        // ── Tea & Coffee (subIdx 23)
        { product_name: 'Nescafe Gold Blend (200g)', product_description: 'Premium instant coffee rich and smooth', product_price: 8.99, stock: 300, subIdx: 23, mfgDaysAgo: 60, expiryDaysAhead: 730 },
        { product_name: 'Lipton Yellow Label Tea (250g)', product_description: 'Classic black tea bags', product_price: 4.49, stock: 400, subIdx: 23, mfgDaysAgo: 90, expiryDaysAhead: 730 },
        { product_name: 'Starbucks Pike Place Ground (340g)', product_description: 'Medium roast coffee balanced flavors', product_price: 12.99, stock: 200, subIdx: 23, mfgDaysAgo: 30, expiryDaysAhead: 365 },
        { product_name: 'Twinings Green Tea (50 bags)', product_description: 'Pure green tea with natural antioxidants', product_price: 6.49, stock: 350, subIdx: 23, mfgDaysAgo: 45, expiryDaysAhead: 730 },
        { product_name: 'Nespresso Vertuo Pods (10pcs)', product_description: 'Coffee pods in various roast intensities', product_price: 9.99, stock: 280, subIdx: 23, mfgDaysAgo: 20, expiryDaysAhead: 365 },
        // ── Rice & Grains (subIdx 24)
        { product_name: 'Basmati Rice Premium (5kg)', product_description: 'Aged long-grain basmati from India', product_price: 12.99, stock: 300, subIdx: 24, mfgDaysAgo: 120, expiryDaysAhead: 730 },
        { product_name: 'Quaker Rolled Oats (1kg)', product_description: '100% whole grain rolled oats', product_price: 5.49, stock: 400, subIdx: 24, mfgDaysAgo: 90, expiryDaysAhead: 365 },
        { product_name: 'Organic White Quinoa (500g)', product_description: 'Complete protein organic quinoa', product_price: 7.99, stock: 250, subIdx: 24, mfgDaysAgo: 150, expiryDaysAhead: 730 },
        { product_name: 'Whole Wheat Flour (2kg)', product_description: 'Stone-ground whole wheat for baking', product_price: 4.99, stock: 350, subIdx: 24, mfgDaysAgo: 60, expiryDaysAhead: 180 },
        { product_name: 'Brown Rice (2kg)', product_description: 'Nutritious whole grain brown rice', product_price: 6.99, stock: 280, subIdx: 24, mfgDaysAgo: 100, expiryDaysAhead: 365 },
        // ── Oils & Condiments (subIdx 25)
        { product_name: 'Extra Virgin Olive Oil (500ml)', product_description: 'Cold-pressed olive oil for cooking', product_price: 9.99, stock: 300, subIdx: 25, mfgDaysAgo: 90, expiryDaysAhead: 730 },
        { product_name: 'Heinz Tomato Ketchup (700g)', product_description: 'Classic tomato ketchup sweet-tangy', product_price: 3.99, stock: 500, subIdx: 25, mfgDaysAgo: 60, expiryDaysAhead: 365 },
        { product_name: "Hellmann's Real Mayonnaise (400g)", product_description: 'Real mayo with cage-free eggs', product_price: 4.49, stock: 400, subIdx: 25, mfgDaysAgo: 30, expiryDaysAhead: 365 },
        { product_name: 'Naturally Brewed Soy Sauce (300ml)', product_description: 'All-purpose naturally brewed soy sauce', product_price: 2.49, stock: 350, subIdx: 25, mfgDaysAgo: 100, expiryDaysAhead: 730 },
        { product_name: 'Virgin Coconut Oil (500ml)', product_description: 'Cold-pressed coconut oil for cooking', product_price: 7.99, stock: 280, subIdx: 25, mfgDaysAgo: 80, expiryDaysAhead: 730 },
        // ── Spices & Herbs (subIdx 26)
        { product_name: 'McCormick Black Pepper (100g)', product_description: 'Ground black pepper bold flavor', product_price: 3.49, stock: 400, subIdx: 26, mfgDaysAgo: 120, expiryDaysAhead: 1095 },
        { product_name: 'Turmeric Powder (200g)', product_description: 'Pure ground turmeric earthy flavor', product_price: 2.99, stock: 350, subIdx: 26, mfgDaysAgo: 100, expiryDaysAhead: 1095 },
        { product_name: 'Whole Cumin Seeds (100g)', product_description: 'Cumin seeds for tempering and blends', product_price: 2.49, stock: 380, subIdx: 26, mfgDaysAgo: 90, expiryDaysAhead: 1095 },
        { product_name: 'Ceylon Cinnamon Sticks (50g)', product_description: 'Whole cinnamon for beverages and baking', product_price: 3.99, stock: 300, subIdx: 26, mfgDaysAgo: 150, expiryDaysAhead: 1095 },
        { product_name: 'Crushed Chilli Flakes (80g)', product_description: 'Red chilli flakes for adding heat', product_price: 2.29, stock: 420, subIdx: 26, mfgDaysAgo: 80, expiryDaysAhead: 730 },
        // ── Pots & Pans (subIdx 27)
        { product_name: 'Tefal Non-Stick Frying Pan 28cm', product_description: 'PTFE non-stick pan with Thermo-Spot', product_price: 34.99, stock: 150, subIdx: 27, mfgDaysAgo: 180, expiryDaysAhead: null },
        { product_name: 'Prestige Pressure Cooker 5L', product_description: 'Stainless steel cooker with safety valve', product_price: 49.99, stock: 120, subIdx: 27, mfgDaysAgo: 200, expiryDaysAhead: null },
        { product_name: 'Cast Iron Skillet 10"', product_description: 'Pre-seasoned skillet stovetop and oven', product_price: 39.99, stock: 100, subIdx: 27, mfgDaysAgo: 240, expiryDaysAhead: null },
        { product_name: 'Stainless Saucepan Set (3pcs)', product_description: '3-piece saucepan set with glass lids', product_price: 59.99, stock: 90, subIdx: 27, mfgDaysAgo: 160, expiryDaysAhead: null },
        { product_name: 'Le Creuset Dutch Oven 4.2L', product_description: 'Enameled cast iron for braising', product_price: 349.99, stock: 30, subIdx: 27, mfgDaysAgo: 120, expiryDaysAhead: null },
        // ── Kitchen Appliances (subIdx 28)
        { product_name: 'Philips Air Fryer HD9270', product_description: '7L capacity air fryer rapid air tech', product_price: 149.99, stock: 80, subIdx: 28, mfgDaysAgo: 100, expiryDaysAhead: null },
        { product_name: 'KitchenAid Stand Mixer 4.3L', product_description: 'Tilt-head stand mixer with 10 speeds', product_price: 449.99, stock: 35, subIdx: 28, mfgDaysAgo: 150, expiryDaysAhead: null },
        { product_name: 'Breville 4-Slice Toaster', product_description: '6 browning levels and defrost function', product_price: 49.99, stock: 120, subIdx: 28, mfgDaysAgo: 180, expiryDaysAhead: null },
        { product_name: 'Instant Pot Duo 7-in-1 6Qt', product_description: 'Multi-cooker pressure and slow cooker', product_price: 89.99, stock: 70, subIdx: 28, mfgDaysAgo: 120, expiryDaysAhead: null },
        { product_name: 'Ninja Professional Blender', product_description: '1000W blender with single-serve cups', product_price: 79.99, stock: 90, subIdx: 28, mfgDaysAgo: 100, expiryDaysAhead: null },
        // ── Bakeware & Utensils (subIdx 29)
        { product_name: 'Silicone Baking Mat (2pcs)', product_description: 'Non-stick reusable baking sheets', product_price: 14.99, stock: 200, subIdx: 29, mfgDaysAgo: 200, expiryDaysAhead: null },
        { product_name: 'Nordic Ware Bundt Pan', product_description: 'Aluminium bundt pan for cakes', product_price: 29.99, stock: 100, subIdx: 29, mfgDaysAgo: 250, expiryDaysAhead: null },
        { product_name: 'OXO Silicone Spatula Set (3pcs)', product_description: 'Spatula set for mixing and folding', product_price: 19.99, stock: 180, subIdx: 29, mfgDaysAgo: 180, expiryDaysAhead: null },
        { product_name: 'Stainless Steel Balloon Whisk', product_description: 'Whisk for eggs and mixing batters', product_price: 9.99, stock: 250, subIdx: 29, mfgDaysAgo: 200, expiryDaysAhead: null },
        { product_name: 'Ceramic Mixing Bowl Set (3pcs)', product_description: 'Nested ceramic bowls for prep', product_price: 34.99, stock: 130, subIdx: 29, mfgDaysAgo: 150, expiryDaysAhead: null },
        // ── Living Room Furniture (subIdx 30)
        { product_name: 'IKEA EKTORP 3-Seat Sofa', product_description: 'Classic sofa with washable linen cover', product_price: 599.99, stock: 20, subIdx: 30, mfgDaysAgo: 300, expiryDaysAhead: null },
        { product_name: 'Acacia Wood Coffee Table', product_description: 'Solid acacia wood table with shelf', product_price: 229.99, stock: 40, subIdx: 30, mfgDaysAgo: 180, expiryDaysAhead: null },
        { product_name: '5-Tier Industrial Bookshelf', product_description: 'Metal and wood floating bookshelf', product_price: 149.99, stock: 55, subIdx: 30, mfgDaysAgo: 200, expiryDaysAhead: null },
        { product_name: 'Velvet Armchair with Ottoman', product_description: 'Upholstered accent chair with footstool', product_price: 349.99, stock: 30, subIdx: 30, mfgDaysAgo: 150, expiryDaysAhead: null },
        { product_name: 'Modern TV Unit with Drawers', product_description: 'TV cabinet with drawers for 65" screens', product_price: 299.99, stock: 35, subIdx: 30, mfgDaysAgo: 120, expiryDaysAhead: null },
        // ── Lighting & Lamps (subIdx 31)
        { product_name: 'Philips Hue Smart Bulb Starter Kit', product_description: '3 smart color bulbs with bridge', product_price: 79.99, stock: 80, subIdx: 31, mfgDaysAgo: 100, expiryDaysAhead: null },
        { product_name: 'Industrial Edison Pendant Light', product_description: 'Vintage pendant lamp for dining rooms', product_price: 49.99, stock: 70, subIdx: 31, mfgDaysAgo: 180, expiryDaysAhead: null },
        { product_name: 'Bedside Touch Lamp', product_description: '3-way dimmable lamp with USB charging', product_price: 34.99, stock: 120, subIdx: 31, mfgDaysAgo: 150, expiryDaysAhead: null },
        { product_name: 'LED Arc Floor Lamp with Shelf', product_description: 'LED floor lamp with USB and shelf', product_price: 89.99, stock: 60, subIdx: 31, mfgDaysAgo: 130, expiryDaysAhead: null },
        { product_name: 'RGB LED Strip Lights (5m)', product_description: 'Color LED strip with remote control', product_price: 19.99, stock: 200, subIdx: 31, mfgDaysAgo: 90, expiryDaysAhead: null },
        // ── Wall Art & Decor (subIdx 32)
        { product_name: 'Abstract Canvas Print 60x80cm', product_description: 'Modern abstract art on canvas', product_price: 44.99, stock: 80, subIdx: 32, mfgDaysAgo: 200, expiryDaysAhead: null },
        { product_name: 'Wooden Silent Wall Clock 40cm', product_description: 'Quartz wall clock with wood frame', product_price: 29.99, stock: 100, subIdx: 32, mfgDaysAgo: 150, expiryDaysAhead: null },
        { product_name: 'Handmade Macrame Wall Hanging', product_description: 'Boho macrame tapestry in natural cotton', product_price: 34.99, stock: 90, subIdx: 32, mfgDaysAgo: 120, expiryDaysAhead: null },
        { product_name: 'Photo Frame Collage Set (7pcs)', product_description: 'Multi-photo wall frame set', product_price: 24.99, stock: 130, subIdx: 32, mfgDaysAgo: 180, expiryDaysAhead: null },
        { product_name: 'Ceramic Decorative Vase Set (3pcs)', product_description: 'Modern vases in earthy tones', product_price: 39.99, stock: 110, subIdx: 32, mfgDaysAgo: 160, expiryDaysAhead: null },
        // ── Bed Sheets & Covers (subIdx 33)
        { product_name: 'Egyptian Cotton Sheet Set King', product_description: '400TC Egyptian cotton with pillowcases', product_price: 89.99, stock: 100, subIdx: 33, mfgDaysAgo: 200, expiryDaysAhead: null },
        { product_name: 'Microfiber Duvet Cover Set', product_description: 'Soft duvet cover with 2 pillowcases', product_price: 44.99, stock: 150, subIdx: 33, mfgDaysAgo: 150, expiryDaysAhead: null },
        { product_name: 'Bamboo Cooling Bed Sheets', product_description: 'Moisture-wicking bamboo viscose sheets', product_price: 69.99, stock: 120, subIdx: 33, mfgDaysAgo: 100, expiryDaysAhead: null },
        { product_name: 'Flannel Bed Sheet Set Queen', product_description: 'Cozy flannel sheets brushed soft', product_price: 54.99, stock: 110, subIdx: 33, mfgDaysAgo: 180, expiryDaysAhead: null },
        { product_name: 'French Linen Duvet Cover Double', product_description: '100% French linen breathable duvet', product_price: 119.99, stock: 70, subIdx: 33, mfgDaysAgo: 120, expiryDaysAhead: null },
        // ── Towels & Robes (subIdx 34)
        { product_name: 'Egyptian Cotton Towel Set (6pcs)', product_description: 'Hotel-quality 600GSM cotton towels', product_price: 49.99, stock: 150, subIdx: 34, mfgDaysAgo: 180, expiryDaysAhead: null },
        { product_name: 'Waffle Weave Bath Robe', product_description: 'Lightweight cotton waffle robe', product_price: 54.99, stock: 100, subIdx: 34, mfgDaysAgo: 150, expiryDaysAhead: null },
        { product_name: 'Bamboo Hand Towels (4pcs)', product_description: 'Soft bamboo cotton hand towels', product_price: 24.99, stock: 200, subIdx: 34, mfgDaysAgo: 200, expiryDaysAhead: null },
        { product_name: 'Quick-Dry Microfiber Beach Towel', product_description: 'Oversized sand-free beach towel', product_price: 19.99, stock: 180, subIdx: 34, mfgDaysAgo: 120, expiryDaysAhead: null },
        { product_name: 'Kids Hooded Bath Towel', product_description: 'Cartoon character hooded towel', product_price: 16.99, stock: 220, subIdx: 34, mfgDaysAgo: 160, expiryDaysAhead: null },
        // ── Pillows & Cushions (subIdx 35)
        { product_name: 'Contour Memory Foam Pillow Queen', product_description: 'Memory foam pillow for neck support', product_price: 44.99, stock: 130, subIdx: 35, mfgDaysAgo: 150, expiryDaysAhead: null },
        { product_name: 'Down Alternative Pillow Pair', product_description: 'Hypoallergenic hotel-style pillow pair', product_price: 39.99, stock: 160, subIdx: 35, mfgDaysAgo: 180, expiryDaysAhead: null },
        { product_name: 'Velvet Cushion Covers (4pcs)', product_description: '18x18" velvet cushion covers', product_price: 22.99, stock: 200, subIdx: 35, mfgDaysAgo: 120, expiryDaysAhead: null },
        { product_name: 'Full Body Pillow with Cover', product_description: '150cm body pillow for side sleepers', product_price: 34.99, stock: 110, subIdx: 35, mfgDaysAgo: 200, expiryDaysAhead: null },
        { product_name: 'Weather-Resistant Outdoor Cushions (4pcs)', product_description: 'Cushions for patio furniture', product_price: 54.99, stock: 90, subIdx: 35, mfgDaysAgo: 160, expiryDaysAhead: null },
        // ── Exercise Equipment (subIdx 36)
        { product_name: 'Hex Rubber Dumbbell Set (2x10kg)', product_description: 'Adjustable rubber dumbbells', product_price: 89.99, stock: 80, subIdx: 36, mfgDaysAgo: 150, expiryDaysAhead: null },
        { product_name: 'Resistance Bands Set (5 levels)', product_description: 'Color-coded latex bands for home gym', product_price: 24.99, stock: 200, subIdx: 36, mfgDaysAgo: 120, expiryDaysAhead: null },
        { product_name: 'Doorway Pull-Up Bar', product_description: 'Adjustable doorway bar no screws', product_price: 29.99, stock: 160, subIdx: 36, mfgDaysAgo: 180, expiryDaysAhead: null },
        { product_name: 'Weighted Jump Rope 1LB', product_description: 'Ball bearing weighted jump rope', product_price: 19.99, stock: 250, subIdx: 36, mfgDaysAgo: 150, expiryDaysAhead: null },
        { product_name: 'Vinyl Coated Kettlebell 16kg', product_description: 'Cast iron kettlebell with vinyl grip', product_price: 44.99, stock: 100, subIdx: 36, mfgDaysAgo: 200, expiryDaysAhead: null },
        // ── Yoga & Pilates (subIdx 37)
        { product_name: 'Manduka PRO Yoga Mat 6mm', product_description: 'Lifetime guarantee yoga mat', product_price: 120.00, stock: 75, subIdx: 37, mfgDaysAgo: 100, expiryDaysAhead: null },
        { product_name: 'Cork Yoga Block Set (2pcs)', product_description: 'Natural cork blocks for alignment', product_price: 29.99, stock: 150, subIdx: 37, mfgDaysAgo: 130, expiryDaysAhead: null },
        { product_name: 'Cotton Yoga Strap 8ft', product_description: 'Yoga strap with D-ring for stretching', product_price: 12.99, stock: 200, subIdx: 37, mfgDaysAgo: 150, expiryDaysAhead: null },
        { product_name: 'High-Density Foam Roller 33cm', product_description: 'Foam roller for deep tissue massage', product_price: 24.99, stock: 180, subIdx: 37, mfgDaysAgo: 120, expiryDaysAhead: null },
        { product_name: 'Pilates Magic Circle Ring', product_description: 'Flexible toning ring with padded grips', product_price: 19.99, stock: 160, subIdx: 37, mfgDaysAgo: 140, expiryDaysAhead: null },
        // ── Sports Clothing (subIdx 38)
        { product_name: 'Nike Dri-FIT Running Shorts 7"', product_description: 'Running shorts with inner brief', product_price: 34.99, stock: 180, subIdx: 38, mfgDaysAgo: 130, expiryDaysAhead: null },
        { product_name: 'Adidas Full-Length Compression Tights', product_description: 'Moisture-managing training tights', product_price: 44.99, stock: 160, subIdx: 38, mfgDaysAgo: 120, expiryDaysAhead: null },
        { product_name: 'Under Armour Tech T-Shirt', product_description: 'Semi-fitted moisture-wicking tee', product_price: 29.99, stock: 200, subIdx: 38, mfgDaysAgo: 150, expiryDaysAhead: null },
        { product_name: 'Puma Running Windbreaker', product_description: 'Lightweight wind-resistant run jacket', product_price: 59.99, stock: 120, subIdx: 38, mfgDaysAgo: 100, expiryDaysAhead: null },
        { product_name: 'Gymshark Legacy Hoodie', product_description: 'Fleece-lined heavyweight training hoodie', product_price: 69.99, stock: 110, subIdx: 38, mfgDaysAgo: 80, expiryDaysAhead: null },
        // ── Face Care (subIdx 39)
        { product_name: 'CeraVe Moisturizing Cream (340g)', product_description: 'Fragrance-free cream for dry skin', product_price: 16.99, stock: 300, subIdx: 39, mfgDaysAgo: 90, expiryDaysAhead: 1095 },
        { product_name: 'The Ordinary Niacinamide 10% Serum', product_description: 'Vitamin B3 serum for pores', product_price: 8.99, stock: 400, subIdx: 39, mfgDaysAgo: 60, expiryDaysAhead: 730 },
        { product_name: 'Neutrogena Hydro Boost Gel Cream', product_description: 'Hyaluronic acid gel moisturizer', product_price: 19.99, stock: 350, subIdx: 39, mfgDaysAgo: 80, expiryDaysAhead: 730 },
        { product_name: 'La Roche-Posay Facial Cleanser (400ml)', product_description: 'Gentle foaming cleanser sensitive skin', product_price: 22.99, stock: 280, subIdx: 39, mfgDaysAgo: 70, expiryDaysAhead: 1095 },
        { product_name: 'Retinol Anti-Aging Eye Cream 15ml', product_description: 'Retinol cream for dark circles', product_price: 29.99, stock: 220, subIdx: 39, mfgDaysAgo: 100, expiryDaysAhead: 730 },
        // ── Body Lotions & Oils (subIdx 40)
        { product_name: 'Vaseline Intensive Care Lotion (400ml)', product_description: 'Deep moisture body lotion', product_price: 6.99, stock: 500, subIdx: 40, mfgDaysAgo: 60, expiryDaysAhead: 1095 },
        { product_name: "Palmer's Cocoa Butter Formula (400ml)", product_description: 'Deep moisturizing cocoa butter lotion', product_price: 9.99, stock: 350, subIdx: 40, mfgDaysAgo: 90, expiryDaysAhead: 730 },
        { product_name: 'Bio-Oil Skincare (125ml)', product_description: 'Multi-use oil for scars and stretch marks', product_price: 14.99, stock: 280, subIdx: 40, mfgDaysAgo: 80, expiryDaysAhead: 1095 },
        { product_name: 'Aveeno Daily Moisturizing Lotion (532ml)', product_description: 'Oat-enriched body lotion daily use', product_price: 11.99, stock: 320, subIdx: 40, mfgDaysAgo: 70, expiryDaysAhead: 730 },
        { product_name: "L'Occitane Shea Butter Body Cream (200ml)", product_description: '25% shea butter for intense hydration', product_price: 39.99, stock: 150, subIdx: 40, mfgDaysAgo: 100, expiryDaysAhead: 1095 },
        // ── Sunscreen & SPF (subIdx 41)
        { product_name: 'Neutrogena Ultra Sheer SPF 50 (88ml)', product_description: 'Lightweight broad-spectrum sunscreen', product_price: 14.99, stock: 350, subIdx: 41, mfgDaysAgo: 60, expiryDaysAhead: 730 },
        { product_name: 'La Roche-Posay Anthelios SPF 60', product_description: 'Melt-in sunscreen with broad protection', product_price: 29.99, stock: 250, subIdx: 41, mfgDaysAgo: 80, expiryDaysAhead: 730 },
        { product_name: 'Banana Boat Sport SPF 50 (240ml)', product_description: 'Water-resistant outdoor sunscreen', product_price: 12.99, stock: 300, subIdx: 41, mfgDaysAgo: 70, expiryDaysAhead: 730 },
        { product_name: 'EltaMD UV Clear Tinted SPF 46', product_description: 'Facial sunscreen with niacinamide', product_price: 39.99, stock: 180, subIdx: 41, mfgDaysAgo: 90, expiryDaysAhead: 730 },
        { product_name: 'Coppertone Sport SPF 30 (237ml)', product_description: 'Sweat resistant sunscreen lotion', product_price: 9.99, stock: 320, subIdx: 41, mfgDaysAgo: 60, expiryDaysAhead: 730 },
        // ── Hair Care (subIdx 42)
        { product_name: 'Pantene Pro-V Shampoo (600ml)', product_description: 'Nourishing shampoo for smooth hair', product_price: 8.99, stock: 400, subIdx: 42, mfgDaysAgo: 90, expiryDaysAhead: 730 },
        { product_name: 'Dove Moisturizing Conditioner (400ml)', product_description: 'Daily conditioner Pro-Moisture Complex', product_price: 7.99, stock: 380, subIdx: 42, mfgDaysAgo: 80, expiryDaysAhead: 730 },
        { product_name: 'Olaplex No.3 Hair Perfector (100ml)', product_description: 'At-home treatment to reduce breakage', product_price: 28.99, stock: 200, subIdx: 42, mfgDaysAgo: 60, expiryDaysAhead: 1095 },
        { product_name: 'Moroccanoil Treatment (100ml)', product_description: 'Argan oil treatment for shine and frizz', product_price: 34.99, stock: 180, subIdx: 42, mfgDaysAgo: 70, expiryDaysAhead: 730 },
        { product_name: 'Head & Shoulders Anti-Dandruff (400ml)', product_description: 'Anti-dandruff shampoo zinc pyrithione', product_price: 9.99, stock: 450, subIdx: 42, mfgDaysAgo: 100, expiryDaysAhead: 730 },
        // ── Oral Care (subIdx 43)
        { product_name: 'Oral-B Smart 4500 Electric Toothbrush', product_description: 'Rechargeable toothbrush 3 modes', product_price: 59.99, stock: 150, subIdx: 43, mfgDaysAgo: 120, expiryDaysAhead: null },
        { product_name: 'Colgate Total Whitening Toothpaste (150g)', product_description: 'Whitening toothpaste antibacterial', product_price: 4.49, stock: 500, subIdx: 43, mfgDaysAgo: 60, expiryDaysAhead: 730 },
        { product_name: 'Listerine Cool Mint Mouthwash (1L)', product_description: 'Antiseptic mouthwash 12h protection', product_price: 7.99, stock: 400, subIdx: 43, mfgDaysAgo: 90, expiryDaysAhead: 730 },
        { product_name: 'Waterpik Cordless Water Flosser', product_description: 'Cordless flosser interdental cleaning', product_price: 49.99, stock: 120, subIdx: 43, mfgDaysAgo: 150, expiryDaysAhead: null },
        { product_name: 'Charcoal Teeth Whitening Strips', product_description: 'Natural charcoal whitening strips', product_price: 19.99, stock: 250, subIdx: 43, mfgDaysAgo: 80, expiryDaysAhead: 365 },
        // ── Deodorants & Perfumes (subIdx 44)
        { product_name: 'Dove Men+Care Deodorant (150ml)', product_description: '72h anti-perspirant protection', product_price: 5.99, stock: 500, subIdx: 44, mfgDaysAgo: 90, expiryDaysAhead: 1095 },
        { product_name: 'Chanel Chance Eau Tendre 100ml', product_description: 'Feminine floral fresh fragrance', product_price: 119.00, stock: 80, subIdx: 44, mfgDaysAgo: 100, expiryDaysAhead: 1825 },
        { product_name: 'Dior Sauvage EDP 100ml', product_description: 'Masculine woody bergamot fragrance', product_price: 129.00, stock: 75, subIdx: 44, mfgDaysAgo: 90, expiryDaysAhead: 1825 },
        { product_name: 'Nivea Roll-On Deodorant (50ml)', product_description: '48h protection roll-on no alcohol', product_price: 3.49, stock: 600, subIdx: 44, mfgDaysAgo: 60, expiryDaysAhead: 1095 },
        { product_name: "Victoria's Secret Body Mist (250ml)", product_description: 'Lightly scented fresh floral body spray', product_price: 16.99, stock: 300, subIdx: 44, mfgDaysAgo: 80, expiryDaysAhead: 1095 },
    ];

    const savedProducts: Products[] = [];
    for (const p of productTemplates) {
        const product = productRepo.create({
            product_name: p.product_name,
            product_description: p.product_description,
            product_price: p.product_price,
            stock: p.stock,
            manufacturing_date: daysAgo(p.mfgDaysAgo),
            expiry_date: p.expiryDaysAhead ? daysAhead(p.expiryDaysAhead) : null as unknown as Date,
            subCategories: savedSubCategories[p.subIdx],
            is_deleted: false,
        });
        savedProducts.push(await productRepo.save(product));
    }
    console.log(`Seeded ${savedProducts.length} products`);

    // ─── PRODUCT IMAGES ───────────────────────────────────────────────────────
    for (const product of savedProducts) {
        await productImagesRepo.save(productImagesRepo.create({
            image_path: `/images/products/${product.product_id}_1.jpg`,
            is_primary: true,
            product,
        }));
        await productImagesRepo.save(productImagesRepo.create({
            image_path: `/images/products/${product.product_id}_2.jpg`,
            is_primary: false,
            product,
        }));
    }
    console.log(`Seeded product images`);

    // ─── USERS ────────────────────────────────────────────────────────────────
    const defaultHash = await bcrypt.hash('Password123!', 10);
    const adminHash = await bcrypt.hash('Admin@UrbanKart1', 10);

    const usersData = [
        { name: 'Admin User', email: 'admin@urbankart.com', phone: '9800000001', role: UserRole.Admin, isActive: true, passwordHash: adminHash },
        { name: 'Alice Johnson', email: 'alice.johnson@email.com', phone: '9800000002', role: UserRole.Customer, isActive: true, passwordHash: defaultHash },
        { name: 'Bob Smith', email: 'bob.smith@email.com', phone: '9800000003', role: UserRole.Customer, isActive: true, passwordHash: defaultHash },
        { name: 'Carol Williams', email: 'carol.williams@email.com', phone: '9800000004', role: UserRole.Customer, isActive: true, passwordHash: defaultHash },
        { name: 'David Brown', email: 'david.brown@email.com', phone: '9800000005', role: UserRole.Customer, isActive: true, passwordHash: defaultHash },
        { name: 'Eva Martinez', email: 'eva.martinez@email.com', phone: '9800000006', role: UserRole.Customer, isActive: true, passwordHash: defaultHash },
        { name: 'Frank Wilson', email: 'frank.wilson@email.com', phone: '9800000007', role: UserRole.Customer, isActive: true, passwordHash: defaultHash },
        { name: 'Grace Lee', email: 'grace.lee@email.com', phone: '9800000008', role: UserRole.Customer, isActive: true, passwordHash: defaultHash },
        { name: 'Henry Taylor', email: 'henry.taylor@email.com', phone: '9800000009', role: UserRole.Customer, isActive: true, passwordHash: defaultHash },
        { name: 'Isla Anderson', email: 'isla.anderson@email.com', phone: '9800000010', role: UserRole.Customer, isActive: true, passwordHash: defaultHash },
        { name: 'Jack Thomas', email: 'jack.thomas@email.com', phone: '9800000011', role: UserRole.Customer, isActive: true, passwordHash: defaultHash },
        { name: 'Karen Jackson', email: 'karen.jackson@email.com', phone: '9800000012', role: UserRole.Customer, isActive: true, passwordHash: defaultHash },
        { name: 'Liam White', email: 'liam.white@email.com', phone: '9800000013', role: UserRole.Customer, isActive: true, passwordHash: defaultHash },
        { name: 'Mia Harris', email: 'mia.harris@email.com', phone: '9800000014', role: UserRole.Customer, isActive: true, passwordHash: defaultHash },
        { name: 'Noah Clark', email: 'noah.clark@email.com', phone: '9800000015', role: UserRole.Customer, isActive: true, passwordHash: defaultHash },
    ];

    const savedUsers: Users[] = [];
    for (const u of usersData) {
        savedUsers.push(await userRepo.save(userRepo.create(u)));
    }
    console.log(`Seeded ${savedUsers.length} users`);

    // ─── ADDRESSES ────────────────────────────────────────────────────────────
    // 2 addresses per customer (savedUsers[1..14])
    const addressStrings = [
        ['42 Maple Avenue, Brooklyn, New York, NY 11201, USA', '100 Work Plaza Suite 5, Manhattan, NY 10001, USA'],
        ['7 Oak Street, Austin, Texas, TX 78701, USA', '350 Congress Ave, Austin, TX 78702, USA'],
        ['23 Rose Lane, Los Angeles, California, CA 90001, USA', '88 Sunset Blvd, West Hollywood, CA 90028, USA'],
        ['15 Cedar Road, Chicago, Illinois, IL 60601, USA', '200 Michigan Ave, Chicago, IL 60601, USA'],
        ['9 Palm Street, Miami, Florida, FL 33101, USA', '500 Brickell Key Dr, Miami, FL 33131, USA'],
        ['31 Birch Lane, Seattle, Washington, WA 98101, USA', '1st Ave & Pike Place, Seattle, WA 98101, USA'],
        ['12 Cherry Blossom Ct, San Francisco, CA 94102, USA', '1 Market Street, San Francisco, CA 94105, USA'],
        ['77 Elm Drive, Boston, Massachusetts, MA 02101, USA', '123 Boylston Street, Boston, MA 02116, USA'],
        ['45 Willow Way, Denver, Colorado, CO 80201, USA', '1600 Glenarm Place, Denver, CO 80202, USA'],
        ['8 Pine Circle, Nashville, Tennessee, TN 37201, USA', '500 Broadway, Nashville, TN 37203, USA'],
        ['66 Oak Park, Phoenix, Arizona, AZ 85001, USA', '2 E Congress St, Phoenix, AZ 85004, USA'],
        ['18 Poplar Crescent, Portland, Oregon, OR 97201, USA', '100 SW Main St, Portland, OR 97204, USA'],
        ['3 Magnolia Avenue, Atlanta, Georgia, GA 30301, USA', '190 Marietta St NW, Atlanta, GA 30303, USA'],
        ['50 Aspen Way, Las Vegas, Nevada, NV 89101, USA', '3600 Las Vegas Blvd S, Las Vegas, NV 89109, USA'],
    ];

    const savedAddresses: Address[] = [];

    for (let i = 0; i < addressStrings.length; i++) {
        const user = savedUsers[i + 1];

        const homeAddress = addressRepo.create({
            address: addressStrings[i][0],
            address_title: 'Home',
            is_default: true,
            user: user,
            is_deleted: false
        });

        const workAddress = addressRepo.create({
            address: addressStrings[i][1],
            address_title: 'Work',
            is_default: false,
            user: user,
            is_deleted: false
        });

        savedAddresses.push(await addressRepo.save(homeAddress));
        savedAddresses.push(await addressRepo.save(workAddress));
    }

    console.log(`Seeded ${savedAddresses.length} addresses with Titles and Default flags.`);
    // ─── ORDERS + ORDERED PRODUCTS + PAYMENTS ─────────────────────────────────
    // All scenarios covered:
    //   OrderStatus:    pending | shipped | delivered | cancelled
    //   PaymentMethod:  Credit card | Debit card | Cash on Delivery | Bank Transfer
    //   PaymentStatus:  pending | completed | Refunded
    const scenarios: Array<{
        status: OrderStatus;
        payMethod: PaymentMethod;
        payStatus: PaymentStatus;
    }> = [
            // Delivered + all payment methods (all completed)
            { status: OrderStatus.Delivered, payMethod: PaymentMethod.Credit, payStatus: PaymentStatus.Completed },
            { status: OrderStatus.Delivered, payMethod: PaymentMethod.Debit, payStatus: PaymentStatus.Completed },
            { status: OrderStatus.Delivered, payMethod: PaymentMethod.Cash, payStatus: PaymentStatus.Completed },
            { status: OrderStatus.Delivered, payMethod: PaymentMethod.Bank, payStatus: PaymentStatus.Completed },
            // Shipped + paid online (completed) or COD (still pending)
            { status: OrderStatus.Shipped, payMethod: PaymentMethod.Credit, payStatus: PaymentStatus.Completed },
            { status: OrderStatus.Shipped, payMethod: PaymentMethod.Debit, payStatus: PaymentStatus.Completed },
            { status: OrderStatus.Shipped, payMethod: PaymentMethod.Cash, payStatus: PaymentStatus.Pending },
            { status: OrderStatus.Shipped, payMethod: PaymentMethod.Bank, payStatus: PaymentStatus.Completed },
            // Pending order - paid online (processing) or unpaid COD/bank
            { status: OrderStatus.Pending, payMethod: PaymentMethod.Credit, payStatus: PaymentStatus.Completed },
            { status: OrderStatus.Pending, payMethod: PaymentMethod.Debit, payStatus: PaymentStatus.Completed },
            { status: OrderStatus.Pending, payMethod: PaymentMethod.Cash, payStatus: PaymentStatus.Pending },
            { status: OrderStatus.Pending, payMethod: PaymentMethod.Bank, payStatus: PaymentStatus.Pending },
            // Cancelled - paid then cancelled (refunded) or cancelled before payment
            { status: OrderStatus.Cancelled, payMethod: PaymentMethod.Credit, payStatus: PaymentStatus.Refunded },
            { status: OrderStatus.Cancelled, payMethod: PaymentMethod.Debit, payStatus: PaymentStatus.Refunded },
            { status: OrderStatus.Cancelled, payMethod: PaymentMethod.Bank, payStatus: PaymentStatus.Refunded },
            { status: OrderStatus.Cancelled, payMethod: PaymentMethod.Cash, payStatus: PaymentStatus.Pending },
        ];

    const customers = savedUsers.slice(1); // exclude admin
    let orderCount = 0;

    for (let i = 0; i < 64; i++) {
        const customerIdx = i % customers.length;       // 0..13
        const customer = customers[customerIdx];
        const scenario = scenarios[i % scenarios.length];

        // Pick address: alternate between the 2 addresses for this customer
        const address = savedAddresses[customerIdx * 2 + (i % 2)];

        // 1 to 3 items per order
        const numItems = (i % 3) + 1;
        const lineItems: { product: Products; quantity: number; price: number }[] = [];
        let total = 0;

        for (let j = 0; j < numItems; j++) {
            const product = savedProducts[(i * 3 + j * 7) % savedProducts.length];
            const quantity = (j % 3) + 1;
            const price = Number(product.product_price);
            lineItems.push({ product, quantity, price });
            total += price * quantity;
        }
        total = Math.round(total * 100) / 100;

        const order = await orderRepo.save(orderRepo.create({
            user: customer,
            address,
            status: scenario.status,
            totalAmount: total,
        }));

        for (const item of lineItems) {
            await orderedProductsRepo.save(orderedProductsRepo.create({
                order,
                product: item.product,
                quantity: item.quantity,
                price: item.price,
            }));
        }

        const payDate = daysAgo(Math.floor(i * 1.5) % 90 + 1);
        await paymentsRepo.save(paymentsRepo.create({
            order,
            amount_paid: total,
            payment_date: payDate,
            payment_method: scenario.payMethod,
            payment_status: scenario.payStatus,
        }));

        orderCount++;
    }
    console.log(`Seeded ${orderCount} orders with payments`);

    // ─── REVIEWS ──────────────────────────────────────────────────────────────
    const reviewPool = [
        'Absolutely love this product! Exceeded my expectations.',
        'Great value for money. Would definitely recommend.',
        'Good quality, fast shipping. Very satisfied.',
        'Exactly as described. Arrived in perfect condition.',
        'This is my second purchase. Quality is consistently good.',
        'Decent product but delivery took a bit longer than expected.',
        'Works perfectly! Setup was easy and clear.',
        'Amazing quality for the price. Outstanding build.',
        'Not exactly what I expected but still usable.',
        'Excellent! Has become an essential part of my daily routine.',
        'Very happy with this purchase. Fast delivery.',
        'Five stars! Worth every penny.',
        'Good product, slightly pricey but quality is there.',
        'Customer support sorted a minor issue quickly. Happy overall.',
        'Best purchase this month. Highly recommend!',
        'Solid product. Does what it says on the tin.',
        'Surprised by how good the quality is. Better than expected.',
        'Great for everyday use. Will buy again.',
        'Perfect gift idea. The recipient loved it!',
        'Outstanding quality, arrived earlier than expected.',
    ];

    let reviewCount = 0;
    for (let i = 0; i < savedProducts.length; i++) {
        const numReviews = (i % 2) + 2;
        for (let j = 0; j < numReviews; j++) {
            const user = customers[(i + j * 3) % customers.length];
            const rating = 3.0 + ((i + j) % 5) * 0.5;
            await reviewsRepo.save(reviewsRepo.create({
                product: savedProducts[i],
                user,
                rating,
                comments: reviewPool[(i + j) % reviewPool.length],
                is_deleted: false,
            }));
            reviewCount++;
        }
    }
    console.log(`Seeded ${reviewCount} reviews`);

    console.log('\n--- Seed Complete ---');
    console.log(`Types:         ${savedTypes.length}`);
    console.log(`Categories:    ${savedCategories.length}`);
    console.log(`SubCategories: ${savedSubCategories.length}`);
    console.log(`Products:      ${savedProducts.length}`);
    console.log(`Users:         ${savedUsers.length}  (1 admin + 14 customers)`);
    console.log(`Addresses:     ${savedAddresses.length}`);
    console.log(`Orders:        ${orderCount}  (all status/payment combos covered)`);
    console.log(`Reviews:       ${reviewCount}`);

    await dataSource.destroy();
}

// seed().catch(err => {
//     console.error('Seeding failed:', err);
//     process.exit(1);
// });
