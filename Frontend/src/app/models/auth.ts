export interface User extends Register {
    id: string;
    role: 'user' | 'customer' | 'admin';
    isActive: boolean;
    isLocked: boolean;
    createdAt?: string,
    updatedAt?: string,
}

export interface Register {
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
}

export interface RegisterResponse {
    message: string;
    user: Omit<User, 'password'>;
}

export interface Login {
    email: string;
    password: string;
}

export interface LogoutResponse {
    message: string;
}

export interface OTPResponse {
    message: string,
    otp: string;
}

export interface Meta {
    totalItems: number,
    itemCount: number,
    itemsPerPage: number,
    totalPages: number,
    currentPage: number,
}

export interface GetAllUsers {
    message: string;
    users: User[],
    meta: Meta;
}