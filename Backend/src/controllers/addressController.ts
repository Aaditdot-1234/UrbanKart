import { Request, Response } from "express";
import { asyncHandler } from "../errors/asyncHandler";
import { AddressService } from "../services/addressService";
import { Users } from "../entities/Users";

export class AddressController {
    static addAddress = asyncHandler(async (req: Request, res: Response) => {
        const user = req.user as Users;
        const { address } = req.body;

        const addressInfo = await AddressService.addAddress(user.id, address);

        res.status(201).json({
            message: "Address added successfully.",
            address: addressInfo,
        });
    });

    static getAllAddresses = asyncHandler(async (req: Request, res: Response) => {
        const user = req.user as Users;
        const addresses = await AddressService.getAddressesByUser(user.id);

        res.status(200).json({
            message: "Addresses fetched successfully.",
            addresses,
        });
    });

    static updateAddress = asyncHandler(async (req: Request, res: Response) => {
        const user = req.user as Users;
        const { address } = req.body;
        
        const addressInfo = await AddressService.updateAddress(user.id, address);
        
        res.status(200).json({
            message: "Address updated successfully.",
            address: addressInfo,
        });
    });
    
    static deleteAddress = asyncHandler(async (req: Request, res: Response) => {
        const user = req.user as Users;

        await AddressService.deleteAddress(user.id);

        res.status(200).json({
            message: "Address deleted successfully.",
        });
    });
}