import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../errors/asyncHandler";
import AppDataSource from "../datasource";
import { Address } from "../entities/Address";
import { NotFound } from "../errors/appError";

export class AddressController {
    static addAddress = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const LoggedInUser = (req as any).user;
        const { address } = req.body;
        const addressRepo = AppDataSource.getRepository(Address);

        const addressInfo = addressRepo.create({
            user: LoggedInUser.id,
            address: address,
        })

        await addressRepo.save(addressInfo);

        res.status(201).json({
            message: "Address added successfully.",
            address: addressInfo,
        })
    })

    static getAllAddresses = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const LoggedInUser = (req as any).user;
        const addressRepo = AppDataSource.getRepository(Address);

        const addresses = await addressRepo.find({
            where: { user: { id: LoggedInUser.id } },
        })

        res.status(200).json({
            message: "Addresses fetched successfully.",
            addresses: addresses,
        })
    })

    static updateAddress = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const LoggedInUser = (req as any).user;
        const { address } = req.body;
        const addressRepo = AppDataSource.getRepository(Address);

        const addressInfo = await addressRepo.findOne({
            where: { user: { id: LoggedInUser.id } },
        })

        if (!addressInfo) {
            throw new NotFound("Address not found");
        }

        addressInfo.address = address;
        await addressRepo.save(addressInfo);

        res.status(200).json({
            message: "Address updated successfully.",
            address: addressInfo,
        })
    })

    static deleteAddress = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const LoggedInUser = (req as any).user;
        const addressRepo = AppDataSource.getRepository(Address);

        const addressInfo = await addressRepo.findOne({
            where: { user: { id: LoggedInUser.id } },
        })

        if (!addressInfo) {
            throw new NotFound("Address not found");
        }

        await addressRepo.remove(addressInfo);

        res.status(200).json({
            message: "Address deleted successfully.",
        })
    })
}