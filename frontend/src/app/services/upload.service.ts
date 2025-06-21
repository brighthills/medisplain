import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/env';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private apiUrl = environment.api.uploadUrl;

  constructor(private apiService: ApiService) {}

  uploadPdf(file: File): Observable<any> {
    return this.apiService.post(this.apiUrl, file, 'application/pdf');
  }
}
