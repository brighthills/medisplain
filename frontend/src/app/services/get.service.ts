import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../../enviroments/env';

@Injectable({
  providedIn: 'root',
})
export class GetService {
  constructor(private api: ApiService) {}

  getAllFiles(): Observable<any[]> {
    return this.api.get<any[]>(environment.api.uploadUrl);
  }
}
