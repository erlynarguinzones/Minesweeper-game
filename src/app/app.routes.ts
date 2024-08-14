import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'juego',
    loadChildren: () =>
      import('./juego/juego.module').then((m) => m.JuegoModule),
  },
];
