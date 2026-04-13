"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressController = void 0;
const asyncHandler_1 = require("../errors/asyncHandler");
const addressService_1 = require("../services/addressService");
class AddressController {
}
exports.AddressController = AddressController;
_a = AddressController;
AddressController.addAddress = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = req.user;
    const addressInfo = await addressService_1.AddressService.addAddress(user.id, req.body);
    res.status(201).json({
        message: "Address added successfully.",
        address: addressInfo,
    });
});
AddressController.getAllAddresses = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = req.user;
    const addresses = await addressService_1.AddressService.getAddressesByUser(user.id);
    res.status(200).json({
        message: "Addresses fetched successfully.",
        addresses,
    });
});
AddressController.updateAddress = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = req.user;
    const { addressId } = req.params;
    const addressInfo = await addressService_1.AddressService.updateAddress(user.id, addressId, req.body);
    res.status(200).json({
        message: "Address updated successfully.",
        address: addressInfo,
    });
});
AddressController.deleteAddress = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = req.user;
    const { addressId } = req.params;
    await addressService_1.AddressService.deleteAddress(user.id, addressId);
    res.status(200).json({
        message: "Address deleted successfully.",
    });
});
