import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../enviroments/env';
import { PageHeaderComponent } from '../page-header/page-header.component';

@Component({
  standalone: true,
  selector: 'app-file-detail',
  templateUrl: './file-detail.component.html',
  styleUrls: ['./file-detail.component.scss'],
  imports: [CommonModule, PageHeaderComponent]
})
export class FileDetailComponent implements OnInit {
  shortExplanation = '';
  keyFindings = '';
  detailedExplanation = '';
  doctorRecommendation = '';

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);

  ngOnInit(): void {
    const filename = this.route.snapshot.paramMap.get('filename');
    if (!filename) return;

    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const url = `${environment.api.fileDetail}?filename=${encodeURIComponent(filename)}`;

    this.http.get<any>(url, { headers }).subscribe({
      next: (data) => {
        this.shortExplanation = data.shortExplanation;
        this.keyFindings = data.keyFindings;
        this.detailedExplanation = data.detailedExplanation;
        this.doctorRecommendation = data.doctorRecommendation;
      },
      error: (err) => {
        console.error('❌ Failed to fetch file meta:', err);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['']);
  }
}
