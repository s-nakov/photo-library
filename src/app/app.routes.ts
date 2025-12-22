import { Routes } from '@angular/router';
import { MainLayout } from './core/layouts/main-layout/main-layout';
import { Photos } from './features/photos/pages/photos-page/photos';
import { Favorites } from './features/favorites/pages/favorites-page/favorites';
import { PhotoDetails } from './features/photos/pages/photo-details-page/photo-details';

export const routes: Routes = [
    {
        path: '',
        component: MainLayout,
        children: [
            { path: '', pathMatch: 'full', component: Photos, title: 'Photos' },
            { path: 'favorites', component: Favorites, title: 'Favorites' },
            { path: 'photos/:id', component: PhotoDetails, title: 'Photo details' },
        ],
    },

    { path: '**', redirectTo: '' },
];
