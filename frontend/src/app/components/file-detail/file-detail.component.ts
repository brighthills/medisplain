import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../enviroments/env';
import { PageHeaderComponent } from '../page-header/page-header.component';
import { AISummary, FileMetadata } from '../../interfaces';

@Component({
  standalone: true,
  selector: 'app-file-detail',
  templateUrl: './file-detail.component.html',
  styleUrls: ['./file-detail.component.scss'],
  imports: [CommonModule, PageHeaderComponent]
})
export class FileDetailComponent implements OnInit {
  summary: AISummary = {
    shortExplanation: '',
    keyFindings: '',
    detailedExplanation: '',
    doctorRecommendation: ''
  };

  createdAt: string = '';

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);

  ngOnInit(): void {
    const filename = this.route.snapshot.paramMap.get('id');
    if (!filename) return;

    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const url = `${environment.api.fileDetail}?filename=${encodeURIComponent(filename+'.pdf')}`;

    this.http.get<FileMetadata>(url, { headers }).subscribe({
      next: (data) => {
        try {
          const parsed: AISummary = typeof data.aiSummary === 'string'
            ? JSON.parse(data.aiSummary)
            : data.aiSummary;
          this.createdAt = data.createdAt;
          this.summary = {
            shortExplanation: parsed.shortExplanation ?? '',
            keyFindings: parsed.keyFindings ?? '',
            detailedExplanation: parsed.detailedExplanation ?? '',
            doctorRecommendation: parsed.doctorRecommendation ?? ''
          };
        } catch (err) {
          console.error('❌ Failed to parse aiSummary:', err);
        }
      },
      error: (err) => {
        console.error('❌ Failed to fetch file metadata:', err);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['']);
  }
}
