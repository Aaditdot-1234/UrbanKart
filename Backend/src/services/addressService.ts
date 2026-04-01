import { AddAddress } from "../controllers/addressController";
import AppDataSource from "../datasource";
import { Address } from "../entities/Address";
import { NotFound } from "../errors/appError";

export class AddressService {
    private static addressRepo = AppDataSource.getRepository(Address);

    static async addAddress(userId: string, data: AddAddress) {
        if(data.setAsDefault){
            await this.addressRepo.update({user: {id: userId}}, {is_default: false})
        }

        const addressInfo = this.addressRepo.create({
            user: { id: userId } as any,
            address: data.address,
            address_title: data.title,
            is_default: data.setAsDefault,
        });

        return await this.addressRepo.save(addressInfo);
    }

    static async getAddressesByUser(userId: string) {
        return await this.addressRepo.find({
            where: { user: { id: userId } },
        });
    }

    static async updateAddress(userId: string, addressId: number, data: Partial<AddAddress>) {
        const addressInfo = await this.addressRepo.findOne({
            where: { address_id: addressId, user: { id: userId } },
        });

        if (!addressInfo) {
            throw new NotFound("Address not found");
        }

        addressInfo.address = data.address ?? addressInfo.address;
        addressInfo.address_title = data.title ?? addressInfo.address_title;
        addressInfo.is_default = data.setAsDefault ?? addressInfo.is_default;
        
        return await this.addressRepo.save(addressInfo);
    }

    static async deleteAddress(userId: string, addressId: number) {
        const addressInfo = await this.addressRepo.findOne({
            where: { address_id: addressId, user: { id: userId } },
        });

        if (!addressInfo) {
            throw new NotFound("Address not found");
        }

        if(addressInfo.is_default){
            const another = await this.addressRepo.findOne({where: {user: {id: userId}}});
            if(another){
                another.is_default = true;
                await this.addressRepo.save(another);
            }
        }

        addressInfo.is_deleted = true;

        return await this.addressRepo.save(addressInfo);
    }
}