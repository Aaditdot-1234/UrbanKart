import { Routes } from '@angular/router';
import { authGuard } from './Auth/guards/auth.guard';
import { adminGuard } from './Auth/guards/admin.guard';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "/home",
        pathMatch: "full"
    },
    {
        path: "home",
        loadComponent: () => import("./home/home.component").then(m => m.HomeComponent)
    },
    {
        path: "auth",
        loadChildren: () => import("./Auth/auth.routes").then(m => m.AUTHROUTES)
    },
    {
        path: "products",
        loadChildren: () => import("./Products/product.route").then(m => m.PRODUCTROUTES)
    },
    {
        path: "order",
        canActivate: [authGuard],
        loadChildren: () => import('./Order/order.routes').then(m => m.ORDERROUTES)
    },
    {
        path: "profile",
        canActivate: [authGuard],
        loadChildren: () => import('./Customer/customer.routes').then(m => m.CUSTOMERROUTES)
    },
    {
        path: "admin",
        canActivate: [authGuard, adminGuard],
        loadChildren: () => import('./Admin/admin.routes').then(m => m.ADMINROUTES)
    },
];

