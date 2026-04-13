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
exports.Users = exports.UserRole = void 0;
const typeorm_1 = require("typeorm");
const Address_1 = require("./Address");
const Orders_1 = require("./Orders");
const Reviews_1 = require("./Reviews");
const Cart_1 = require("./Cart");
var UserRole;
(function (UserRole) {
    UserRole["Guest"] = "guest";
    UserRole["Customer"] = "customer";
    UserRole["Admin"] = "admin";
})(UserRole || (exports.UserRole = UserRole = {}));
let Users = class Users {
};
exports.Users = Users;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Users.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: false }),
    __metadata("design:type", String)
], Users.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, unique: true, nullable: false }),
    __metadata("design:type", String)
], Users.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: false, select: false }),
    __metadata("design:type", String)
], Users.prototype, "passwordHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, nullable: false }),
    __metadata("design:type", String)
], Users.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "simple-enum", enum: UserRole, default: UserRole.Guest }),
    __metadata("design:type", String)
], Users.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Users.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Users.prototype, "isLocked", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Address_1.Address, (address) => address.user, { cascade: true }),
    __metadata("design:type", Array)
], Users.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Orders_1.Orders, (order) => order.user, { cascade: true }),
    __metadata("design:type", Array)
], Users.prototype, "orders", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Reviews_1.Reviews, (review) => review.user, { cascade: true }),
    __metadata("design:type", Array)
], Users.prototype, "reviews", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Cart_1.Cart, (cart) => cart.user, { cascade: true }),
    __metadata("design:type", Array)
], Users.prototype, "carts", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Users.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Users.prototype, "updatedAt", void 0);
exports.Users = Users = __decorate([
    (0, typeorm_1.Entity)('users')
], Users);
