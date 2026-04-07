import { Routes } from "@angular/router";

export const PRODUCTROUTES:Routes = [
    {
        path:'',
        loadComponent:() => import('./product/product.component').then(m => m.ProductComponent)
    },
    {
        path:'categories',
        loadComponent:() => import('./categories/categories.component').then(m => m.CategoriesComponent)
    },
]