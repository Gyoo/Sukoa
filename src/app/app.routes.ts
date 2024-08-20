import { Routes } from '@angular/router';
import {MainComponent} from "../components/main/main.component";
import {songResolver} from "../resolvers/song.resolver";
import {chartResolver} from "../resolvers/chart.resolver";

export const routes: Routes = [
  { path: '',
    component: MainComponent,
    resolve: {
      songs: songResolver,
      charts: chartResolver,
    }
  }
];
