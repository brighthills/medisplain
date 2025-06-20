import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../enviroments/env';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: []
})
export class HomeComponent {
  selectedFile: File | null = null;
  message: string = '';

  constructor(private http: HttpClient) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
      this.message = '';
    } else {
      this.selectedFile = null;
      this.message = 'Csak PDF fájl tölthető fel.';
    }
  }

  uploadFile(): void {
    if (!this.selectedFile) {
      this.message = 'Először válassz ki egy PDF fájlt.';
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    const token = localStorage.getItem('accessToken');

    if (!token) {
      this.message = 'Hiányzik a hozzáférési token.';
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // ⬅️ Itt a javítás
    });

    this.http.post(`${environment.api.uploadUrl}`, formData, { headers }).subscribe({
      next: () => {
        this.message = 'A fájl sikeresen feltöltve!';
        this.selectedFile = null;
      },
      error: (err) => {
        console.error('Feltöltési hiba:', err);
        this.message = 'Hiba történt a feltöltés során.';
      }
    });
  }
}
