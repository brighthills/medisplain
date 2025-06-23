import { Component } from '@angular/core';
import { UploadService } from '../../services/upload.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  selectedFile: File | null = null;
  message: string = '';

  constructor(private loadingService:LoadingService,private uploadService: UploadService,
    private authService: AuthService
  ) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.message = '';
    }
  }

  uploadFile(): void {
    if (!this.selectedFile) return;

    this.uploadService.uploadPdf(this.selectedFile).subscribe(
      {
      next: (res: any) => {
        console.log('✅ Upload successful:', res);
        this.message = 'Upload successful!';
      },
      error: (err: any) => {
        console.error('❌ Upload error:', err);
        this.message = 'Upload error!';
      },
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
