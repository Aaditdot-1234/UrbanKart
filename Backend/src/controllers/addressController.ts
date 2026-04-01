import { Request, Response } from "express";
import { asyncHandler } from "../errors/asyncHandler";
import { AddressService } from "../services/addressService";
import { Users } from "../entities/Users";

export interface AddAddress{
    address: string, 
    title:string, 
    setAsDefault: boolean,
}

export class AddressController {
    static addAddress = asyncHandler(async (req: Request<{}, any, AddAddress>, res: Response) => {
        const user = req.user as Users;

        const addressInfo = await AddressService.addAddress(user.id, req.body);

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

    static updateAddress = asyncHandler(async (req: Request<{addressId: number}, any, Partial<AddAddress>>, res: Response) => {
        const user = req.user as Users;
        const {addressId} = req.params;
        
        const addressInfo = await AddressService.updateAddress(user.id, addressId, req.body);
        
        res.status(200).json({
            message: "Address updated successfully.",
            address: addressInfo,
        });
    });
    
    static deleteAddress = asyncHandler(async (req: Request<{addressId: number}>, res: Response) => {
        const user = req.user as Users;
        const {addressId} = req.params;

        await AddressService.deleteAddress(user.id, addressId);

        res.status(200).json({
            message: "Address deleted successfully.",
        });
    });
}