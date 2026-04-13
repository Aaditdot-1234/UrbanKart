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
exports.Categories = void 0;
const typeorm_1 = require("typeorm");
const SubCategories_1 = require("./SubCategories");
const Types_1 = require("./Types");
let Categories = class Categories {
};
exports.Categories = Categories;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Categories.prototype, "category_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, unique: true }),
    __metadata("design:type", String)
], Categories.prototype, "category_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], Categories.prototype, "category_description", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => SubCategories_1.SubCategories, (sc) => sc.categories),
    __metadata("design:type", Array)
], Categories.prototype, "subCategory", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Types_1.Types, (t) => t.categories),
    (0, typeorm_1.JoinColumn)({ name: "type_id" }),
    __metadata("design:type", Types_1.Types)
], Categories.prototype, "types", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Categories.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Categories.prototype, "updatedAt", void 0);
exports.Categories = Categories = __decorate([
    (0, typeorm_1.Entity)('categories')
], Categories);
