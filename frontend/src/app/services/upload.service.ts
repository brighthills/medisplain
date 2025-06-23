import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../../enviroments/env';
import { FileStoreService } from './file-store.service';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  constructor(
    private api: ApiService,
    private fileStore: FileStoreService
  ) { }

  uploadPdf(file: File): Observable<any> {
    return new Observable((observer) => {
      const reader = new FileReader();

      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];

        const body = {
          file_base64: base64,
          filename: file.name // opcionális, ha a backend elfogadja
        };

        this.api.post(environment.api.uploadUrl, body, 'text/plain').subscribe({
          next: (res: any) => {
            if (res?.filename && res?.metadata?.['upload-timestamp']) {
              this.fileStore.addFile({
                ...res,
                createdAt: res?.['upload-timestamp'] ?? new Date().toISOString(),
                status:'processing'
              });
            }
            observer.next(res);
          },
          error: (err) => observer.error(err),
          complete: () => observer.complete()
        });
      };

      reader.onerror = (error) => observer.error(error);
      reader.readAsDataURL(file);
    });
  }
}
