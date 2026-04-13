"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressService = void 0;
const datasource_1 = __importDefault(require("../datasource"));
const Address_1 = require("../entities/Address");
const appError_1 = require("../errors/appError");
class AddressService {
    static async addAddress(userId, data) {
        if (data.setAsDefault) {
            await this.addressRepo.update({ user: { id: userId } }, { is_default: false });
        }
        const addressInfo = this.addressRepo.create({
            user: { id: userId },
            address: data.address,
            address_title: data.title,
            is_default: data.setAsDefault,
        });
        return await this.addressRepo.save(addressInfo);
    }
    static async getAddressesByUser(userId) {
        return await this.addressRepo.find({
            where: { user: { id: userId } },
        });
    }
    static async updateAddress(userId, addressId, data) {
        const addressInfo = await this.addressRepo.findOne({
            where: { address_id: addressId, user: { id: userId } },
        });
        if (!addressInfo) {
            throw new appError_1.NotFound("Address not found");
        }
        addressInfo.address = data.address ?? addressInfo.address;
        addressInfo.address_title = data.title ?? addressInfo.address_title;
        addressInfo.is_default = data.setAsDefault ?? addressInfo.is_default;
        return await this.addressRepo.save(addressInfo);
    }
    static async deleteAddress(userId, addressId) {
        const addressInfo = await this.addressRepo.findOne({
            where: { address_id: addressId, user: { id: userId } },
        });
        if (!addressInfo) {
            throw new appError_1.NotFound("Address not found");
        }
        if (addressInfo.is_default) {
            const another = await this.addressRepo.findOne({ where: { user: { id: userId } } });
            if (another) {
                another.is_default = true;
                await this.addressRepo.save(another);
            }
        }
        addressInfo.is_deleted = true;
        return await this.addressRepo.save(addressInfo);
    }
}
exports.AddressService = AddressService;
AddressService.addressRepo = datasource_1.default.getRepository(Address_1.Address);
