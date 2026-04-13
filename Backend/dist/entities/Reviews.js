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
exports.Reviews = void 0;
const typeorm_1 = require("typeorm");
const Users_1 = require("./Users");
const Products_1 = require("./Products");
let Reviews = class Reviews {
};
exports.Reviews = Reviews;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Reviews.prototype, "review_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 2, default: 0.00 }),
    __metadata("design:type", Number)
], Reviews.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], Reviews.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Reviews.prototype, "is_deleted", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Users_1.Users, (user) => user.reviews),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    __metadata("design:type", Users_1.Users)
], Reviews.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Products_1.Products, (product) => product.reviews),
    (0, typeorm_1.JoinColumn)({ name: "product_id" }),
    __metadata("design:type", Products_1.Products)
], Reviews.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Reviews.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Reviews.prototype, "updatedAt", void 0);
exports.Reviews = Reviews = __decorate([
    (0, typeorm_1.Entity)('reviews')
], Reviews);
