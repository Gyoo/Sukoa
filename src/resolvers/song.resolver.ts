import { ResolveFn } from '@angular/router';
import {inject} from "@angular/core";
import {TachiClientService} from "../services/tachi-client.service";
import {Song} from "../model/Song";

export const songResolver: ResolveFn<Song[]> = (route, state) => {
  const tachiService = inject(TachiClientService);
  return tachiService.getSongs();
};
