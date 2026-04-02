import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "/home",
        pathMatch: "full"
    },
    {
        path:"auth",
        loadChildren: () => import("./Auth/auth.routes").then(m => m.AUTHROUTES)
    }
];
