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
exports.Payments = exports.PaymentStatus = exports.PaymentMethod = void 0;
const typeorm_1 = require("typeorm");
const Orders_1 = require("./Orders");
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["Credit"] = "Credit Card";
    PaymentMethod["Debit"] = "Debit Card";
    PaymentMethod["Cash"] = "Cash on Delivery";
    PaymentMethod["Bank"] = "Bank Transfer";
    PaymentMethod["Online"] = "Online";
    PaymentMethod["NotSelected"] = "not selected";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["Pending"] = "pending";
    PaymentStatus["Completed"] = "completed";
    PaymentStatus["Cancelled"] = "cancelled";
    PaymentStatus["Refunded"] = "Refunded";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
let Payments = class Payments {
};
exports.Payments = Payments;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Payments.prototype, "payment_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Payments.prototype, "amount_paid", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Payments.prototype, "payment_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-enum', enum: PaymentMethod, default: PaymentMethod.Bank }),
    __metadata("design:type", String)
], Payments.prototype, "payment_method", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-enum', enum: PaymentStatus, default: PaymentStatus.Pending }),
    __metadata("design:type", String)
], Payments.prototype, "payment_status", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Orders_1.Orders, (order) => order.payment),
    (0, typeorm_1.JoinColumn)({ name: 'order_id' }),
    __metadata("design:type", Orders_1.Orders)
], Payments.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Payments.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Payments.prototype, "updatedAt", void 0);
exports.Payments = Payments = __decorate([
    (0, typeorm_1.Entity)('payments')
], Payments);
