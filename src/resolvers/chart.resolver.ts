import { ResolveFn } from '@angular/router';
import {inject} from "@angular/core";
import {TachiClientService} from "../services/tachi-client.service";
import {Chart} from "../model/Chart";

export const chartResolver: ResolveFn<Chart[]> = (route, state) => {
  const tachiService = inject(TachiClientService);
  return tachiService.getCharts();
};
