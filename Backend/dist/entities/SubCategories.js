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
exports.SubCategories = void 0;
const typeorm_1 = require("typeorm");
const Products_1 = require("./Products");
const Categories_1 = require("./Categories");
let SubCategories = class SubCategories {
};
exports.SubCategories = SubCategories;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SubCategories.prototype, "subcategory_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, unique: true }),
    __metadata("design:type", String)
], SubCategories.prototype, "subcategory_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], SubCategories.prototype, "subcategory_description", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Products_1.Products, (product) => product.subCategories),
    __metadata("design:type", Array)
], SubCategories.prototype, "products", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Categories_1.Categories, (category) => category.subCategory),
    (0, typeorm_1.JoinColumn)({ name: "category_id" }),
    __metadata("design:type", Categories_1.Categories)
], SubCategories.prototype, "categories", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SubCategories.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], SubCategories.prototype, "updatedAt", void 0);
exports.SubCategories = SubCategories = __decorate([
    (0, typeorm_1.Entity)('sub-categories')
], SubCategories);
