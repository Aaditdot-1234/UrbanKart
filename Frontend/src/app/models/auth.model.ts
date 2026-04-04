export interface User extends Register{
    id: string;
    role: 'user' | 'customer' | 'admin';
    isActive: boolean;
    isLocked: boolean;
}

export interface Register{
    name: string;
    email:string;
    password:string;
    phone:string;
    address:string;
}

export interface RegisterResponse{
    message: string;
    user: Omit<User, 'password'>;
}

export interface Login{
    email:string;
    password:string;
}

export interface LogoutResponse{
    message:string;
}