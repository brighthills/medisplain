import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  uploadSuccessMessage = '';
  email = ''

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private userService: UserService,
    private apiService: ApiService,
  ) {
  }
  ngOnInit(): void {
    this.userService.email$.subscribe(email => {
      this.email = email;
    });
  }

  uploadFile(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/pdf';

    input.onchange = () => {
      const file = input.files?.[0];
      if (file) {
        this.apiService.uploadPdf(file).subscribe({
          next: () => {
            this.toastService.show('✅ File uploaded successfully');
          },
          error: () => {
            this.toastService.show('❌ Upload failed. Please try again', 'error');
          },
        });
      }
    };

    input.click();
  }

  logout(): void {
    this.authService.logout();
  }
}
