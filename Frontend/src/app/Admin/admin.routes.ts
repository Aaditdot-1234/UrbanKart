import { Routes } from "@angular/router";

export const ADMINROUTES: Routes = [
    {
        path: ":id/dashboard",
        loadComponent: () => import("./dashboard/dashboard.component").then(m => m.DashboardComponent)
    },
    {
        path: "users",
        loadComponent: () => import("./manage-users/manage-users.component").then(m => m.ManageUsersComponent)
    },
    {
        path: "products",
        loadComponent: () => import("./adminproducts/adminproducts.component").then(m => m.AdminproductsComponent)
    },
    {
        path: "products/:id/edit",
        loadComponent: () => import("./admin-products-detail/admin-products-detail.component").then(m => m.AdminProductsDetailComponent)
    },
]