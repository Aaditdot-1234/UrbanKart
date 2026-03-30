import AppDataSource from "../datasource";
import { Address } from "../entities/Address";
import { NotFound } from "../errors/appError";

export class AddressService {
    private static addressRepo = AppDataSource.getRepository(Address);

    static async addAddress(userId: string, address: string) {
        const addressInfo = this.addressRepo.create({
            user: { id: userId } as any,
            address: address,
        });

        return await this.addressRepo.save(addressInfo);
    }

    static async getAddressesByUser(userId: string) {
        return await this.addressRepo.find({
            where: { user: { id: userId } },
        });
    }

    static async updateAddress(userId: string, newAddress: string) {
        const addressInfo = await this.addressRepo.findOne({
            where: { user: { id: userId } },
        });

        if (!addressInfo) {
            throw new NotFound("Address not found");
        }

        addressInfo.address = newAddress;
        return await this.addressRepo.save(addressInfo);
    }

    static async deleteAddress(userId: string) {
        const addressInfo = await this.addressRepo.findOne({
            where: { user: { id: userId } },
        });

        if (!addressInfo) {
            throw new NotFound("Address not found");
        }

        addressInfo.is_deleted = true;

        return await this.addressRepo.save(addressInfo);
    }
}