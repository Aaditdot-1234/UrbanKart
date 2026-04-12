import { Routes } from "@angular/router";

export const ADMINROUTES: Routes = [
    {
        path: ":id/dashboard",
        loadComponent: () => import("./dashboard/dashboard.component").then(m => m.DashboardComponent)
    },
    {
        path: "users",
        loadComponent: () => import("./manage-users/manage-users.component").then(m => m.ManageUsersComponent)
    }
]