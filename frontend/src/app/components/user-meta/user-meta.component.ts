import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { environment } from '../../../enviroments/env';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-meta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-meta.component.html',
  styleUrl: './user-meta.component.scss'
})
export class UserMetaComponent implements OnInit {
  userMetadata: any = null;
  loading = false;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchUserMetadata();
  }

  fetchUserMetadata(): void {
    this.loading = true;
    this.apiService.get(environment.api.userMetaUrl).subscribe({
      next: (data) => {
        this.userMetadata = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to fetch user metadata.';
        console.error('❌ User metadata error:', err);
        this.loading = false;
      }
    });
  }
}
