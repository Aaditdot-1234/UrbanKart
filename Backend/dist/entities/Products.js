"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Products = void 0;
const typeorm_1 = require("typeorm");
const SubCategories_1 = require("./SubCategories");
const ProductImages_1 = require("./ProductImages");
const Reviews_1 = require("./Reviews");
const CartItems_1 = require("./CartItems");
const OrderedProducts_1 = require("./OrderedProducts");
let Products = class Products {
};
exports.Products = Products;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Products.prototype, "product_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 150 }),
    __metadata("design:type", String)
], Products.prototype, "product_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Products.prototype, "product_description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0.00 }),
    __metadata("design:type", Number)
], Products.prototype, "product_price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Products.prototype, "manufacturing_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Products.prototype, "expiry_date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Products.prototype, "stock", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Products.prototype, "is_deleted", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => SubCategories_1.SubCategories, (sub) => sub.products),
    (0, typeorm_1.JoinColumn)({ name: "subCategory_id" }),
    __metadata("design:type", SubCategories_1.SubCategories)
], Products.prototype, "subCategories", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ProductImages_1.ProductImages, (images) => images.product, { cascade: true }),
    __metadata("design:type", Array)
], Products.prototype, "productImages", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => CartItems_1.CartItems, (item) => item.product),
    __metadata("design:type", Array)
], Products.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Reviews_1.Reviews, (review) => review.product, { cascade: true }),
    __metadata("design:type", Array)
], Products.prototype, "reviews", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => OrderedProducts_1.OrderedProducts, (op) => op.product),
    __metadata("design:type", Array)
], Products.prototype, "orderItems", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Products.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Products.prototype, "updatedAt", void 0);
exports.Products = Products = __decorate([
    (0, typeorm_1.Entity)('products')
], Products);
