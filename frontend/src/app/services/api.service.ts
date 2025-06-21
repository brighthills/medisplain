import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

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
}
