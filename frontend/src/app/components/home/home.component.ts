import { Component } from '@angular/core';
import { UploadService } from '../../services/upload.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';
import { LoadingService } from '../../services/loading.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FileListComponent } from '../file-list/file-list.component';
import { ToastService } from '../../services/toast.service';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, FileListComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent {

  selectedFile: File | null = null;
  message: string = '';
  files = [];

  constructor(
    private uploadService: UploadService,
    private authService: AuthService,
    private toastService: ToastService,
  ) { }

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
          this.toastService.show('File uploaded successfully!');
        },
        error: (err: any) => {
          console.error('❌ Upload error:', err);
          this.toastService.show('Upload failed. Please try again.', 'error');

        },
      });
  }

  logout(): void {
    this.authService.logout();
  }
}
