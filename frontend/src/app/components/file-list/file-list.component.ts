// src/app/pages/file-list/file-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { environment } from '../../../enviroments/env';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-files',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent implements OnInit {
  files: any[] = [];
  error: string | null = null;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.get<string[]>(environment.api.filesUrl)
      .subscribe({
        next: (res) => {
          this.files = res;
        },
        error: (err) => {
          this.error = 'Failed to load files.';
          console.error(err);
        }
      });
  }
}
