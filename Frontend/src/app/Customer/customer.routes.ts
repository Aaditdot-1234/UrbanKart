import { Routes } from "@angular/router";

export const CUSTOMERROUTES: Routes = [
    {
        path: ':id/orders',
        loadComponent: () => import('./manage-orders/manage-orders.component').then(m => m.ManageOrdersComponent)
    },
    {
        path: ':id/payments',
        loadComponent: () => import('./manage-payments/manage-payments.component').then(m => m.ManagePaymentsComponent)
    },
    {
        path: ':id',
        loadComponent: () => import('./profile-page/profile-page.component').then(m => m.ProfilePageComponent)
    },
]