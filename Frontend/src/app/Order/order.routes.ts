import { Routes } from "@angular/router";

export const ORDERROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./order/order.component').then(m => m.OrderComponent)
    },
    {
        path: 'payments',
        loadComponent: () => import('./payment/payment.component').then(m => m.PaymentComponent),
    }
]