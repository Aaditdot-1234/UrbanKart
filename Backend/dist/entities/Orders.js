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
exports.Orders = exports.OrderStatus = void 0;
const typeorm_1 = require("typeorm");
const Users_1 = require("./Users");
const OrderedProducts_1 = require("./OrderedProducts");
const Address_1 = require("./Address");
const Payments_1 = require("./Payments");
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["Pending"] = "pending";
    OrderStatus["Completed"] = "completed";
    OrderStatus["Delivered"] = "delivered";
    OrderStatus["Cancelled"] = "cancelled";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
let Orders = class Orders {
};
exports.Orders = Orders;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Orders.prototype, "order_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 2, default: 0.00 }),
    __metadata("design:type", Number)
], Orders.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "simple-enum", enum: OrderStatus, default: OrderStatus.Pending }),
    __metadata("design:type", String)
], Orders.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Users_1.Users, (user) => user.orders),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    __metadata("design:type", Users_1.Users)
], Orders.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => OrderedProducts_1.OrderedProducts, (op) => op.order, { cascade: true }),
    __metadata("design:type", Array)
], Orders.prototype, "orderProducts", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Address_1.Address, (address) => address.orders),
    (0, typeorm_1.JoinColumn)({ name: "address_id" }),
    __metadata("design:type", Address_1.Address)
], Orders.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Payments_1.Payments, (payment) => payment.order, { cascade: true }),
    __metadata("design:type", Payments_1.Payments)
], Orders.prototype, "payment", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Orders.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Orders.prototype, "updatedAt", void 0);
exports.Orders = Orders = __decorate([
    (0, typeorm_1.Entity)('orders')
], Orders);
