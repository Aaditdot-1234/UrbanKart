import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "/home",
        pathMatch: "full"
    },
    {
        path:"home",
        loadComponent: () => import("./home/home.component").then(m => m.HomeComponent)
    },
    {
        path:"auth",
        loadChildren: () => import("./Auth/auth.routes").then(m => m.AUTHROUTES)
    }
];
