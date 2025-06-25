import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../enviroments/env';
import { FileStoreService } from './file-store.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient,
    private fileStore: FileStoreService
  ) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      throw new Error('❌ Nincs access token');
    }

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  post<T>(url: string, body: any, contentType = 'application/json'): Observable<T> {
    const headers = this.getAuthHeaders().set('Content-Type', contentType);

    return this.http.post<T>(url, body, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('❌ API POST error:', error);
        return throwError(() => error);
      })
    );
  }

  get<T>(url: string): Observable<T> {
    const headers = this.getAuthHeaders();

    return this.http.get<T>(url, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('❌ API GET error:', error);
        return throwError(() => error);
      })
    );
  }

  getSignedUrl(url: string): Observable<string> {
    const headers = this.getAuthHeaders();

    return this.http.get(url, {
      headers,
      responseType: 'text'  // FONTOS: ne JSON-nak kezelje
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Signed URL GET error:', error);
        return throwError(() => error);
      })
    );
  }

  getBlob(url: string): Observable<Blob> {
    return this.http.get(url, {
      responseType: 'blob'  // Signed URL nem igényel header-t
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('❌ File blob GET error:', error);
        return throwError(() => error);
      })
    );
  }

  uploadPdf(file: File): Observable<any> {
    return new Observable((observer) => {
      const reader = new FileReader();

      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];

        const body = {
          file_base64: base64,
          original_filename: file.name
        };

        this.post(environment.api.uploadUrl, body, 'text/plain').subscribe({
          next: (res: any) => {
            if (res?.filename && res?.metadata?.['upload-timestamp']) {
              this.fileStore.addFile({
                ...res,
                originalFilename: res.original_filename,
                createdAt: res?.['upload-timestamp'] ?? new Date().toISOString(),
                status: 'processing'
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
