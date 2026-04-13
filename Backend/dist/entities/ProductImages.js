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
exports.ProductImages = void 0;
const typeorm_1 = require("typeorm");
const Products_1 = require("./Products");
let ProductImages = class ProductImages {
};
exports.ProductImages = ProductImages;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ProductImages.prototype, "image_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], ProductImages.prototype, "image_path", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], ProductImages.prototype, "is_primary", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Products_1.Products, (product) => product.productImages),
    (0, typeorm_1.JoinColumn)({ name: "product_id" }),
    __metadata("design:type", Products_1.Products)
], ProductImages.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ProductImages.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ProductImages.prototype, "updatedAt", void 0);
exports.ProductImages = ProductImages = __decorate([
    (0, typeorm_1.Entity)('product-images')
], ProductImages);
