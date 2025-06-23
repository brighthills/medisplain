import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { environment } from '../../../enviroments/env';
import { CommonModule } from '@angular/common';
import { FileStoreService } from '../../services/file-store.service';

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

  constructor(
    private api: ApiService,
    private fileStore: FileStoreService
  ) {}

  ngOnInit(): void {
    // 1. Eredeti API hívás
    this.api.get<any[]>(environment.api.filesUrl)
      .subscribe({
        next: (res) => {
          const sorted = res.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          this.files = sorted;
          this.fileStore.setFiles(sorted); 
        },
        error: (err) => {
          this.error = 'Failed to load files.';
          console.error(err);
        }
      });

    this.fileStore.files$.subscribe((updated) => {
      this.files = updated;
    });
  }
}
