import { Routes } from '@angular/router';
import { MainLayout } from './core/layouts/main-layout/main-layout';
import { PhotoDetails } from './features/photos/pages/photo-details-page/photo-details';

export const routes: Routes = [
    {
        path: '',
        component: MainLayout,
        children: [
            {
                path: '',
                pathMatch: 'full',
                loadComponent: () => import('./features/photos/pages/photos-page/photos').then(m => m.Photos),
                data: { reuse: true },
                title: 'Photos'
            },
            {
                path: 'favorites',
                loadComponent: () => import('./features/favorites/pages/favorites-page/favorites').then(m => m.Favorites),
                data: { reuse: true },
                title: 'Favorites'
            },
            {
                path: 'photos/:id',
                loadComponent: () => import('./features/photos/pages/photo-details-page/photo-details').then(m => m.PhotoDetails),
                title: 'Photo details'
            },
        ],
    },

    { path: '**', redirectTo: '' },
];
