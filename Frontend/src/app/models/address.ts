import { User } from "./auth";

export interface Address {
    address_title: string;
    is_default: boolean;
    address: string;
    user: Pick<User, 'id'>;
    address_id:number;
    is_deleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateAddress{
    message: string;
    address: Address; 
}

export interface GetAddress{
    message: string;
    addresses: Omit<Address, 'user'>[];
}

export interface UpdateAddress{
    message:string;
    address: Omit<Address, 'user'>;
} 
