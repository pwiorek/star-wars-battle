import { Routes } from '@angular/router';
import { HomeComponent } from "./pages/home/home.component";
import { GameComponent } from "./pages/game/game.component";
import { resourceSelectedGuard } from "./guards/resource-selected.guard";

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'game',
    component: GameComponent,
    canActivate: [resourceSelectedGuard]
  },
  {
    path: '**',
    redirectTo: '/'
  }
];
