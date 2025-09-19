import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'posts' },
  {
    path: 'posts',
    loadComponent: () =>
      import('./features/posts-list/posts-list.component').then((m) => m.PostsListComponent),
  },
  {
    path: 'posts/:id',
    loadComponent: () =>
      import('./features/post-details/post-details.component').then((m) => m.PostDetailsComponent),
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./features/favorites/favorites.component').then((m) => m.FavoritesComponent),
  },
  {
    path: 'gantt',
    loadComponent: () => import('./features/gantt/gantt.component').then((m) => m.GanttComponent),
  },
  { path: '**', redirectTo: 'posts' },
];
