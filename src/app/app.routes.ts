import { Routes } from '@angular/router';
import { MainLayout } from './core/layouts/main-layout/main-layout';
import { Photos } from './features/photos/photos/photos';
import { Favorites } from './features/favorites/favorites/favorites';

export const routes: Routes = [
    {
        path: '',
        component: MainLayout,
        children: [
            { path: '', pathMatch: 'full', component: Photos },
            { path: 'favorites', component: Favorites },
        ],
    },

    { path: '**', redirectTo: '' },
];
