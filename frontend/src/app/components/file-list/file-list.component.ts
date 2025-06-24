import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { environment } from '../../../enviroments/env';
import { CommonModule } from '@angular/common';
import { FileStoreService } from '../../services/file-store.service';
import { WebSocketService } from '../../services/websocket.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-files',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent implements OnInit, OnDestroy {
  files: any[] = [];
  error: string | null = null;
  private wsSub: Subscription | null = null;

  constructor(
    private api: ApiService,
    private fileStore: FileStoreService,
    private ws: WebSocketService,
    private router: Router,

  ) { }

  ngOnInit(): void {
    this.loadFiles();
    this.subscribeToStore();
    this.subscribeToWebSocket();
  }

  private loadFiles(): void {
    this.api.get<any[]>(environment.api.filesUrl).subscribe({
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
  }

  private subscribeToStore(): void {
    this.fileStore.files$.subscribe((updated) => {
      this.files = updated;
    });
  }

  private subscribeToWebSocket(): void {
    this.wsSub = this.ws.messages$.subscribe((message) => {
      if (message.status === 'done' && message.filename) {
        const index = this.files.findIndex(f => f.filename === message.filename);
        if (index !== -1) {
          this.files[index].status = 'done';
          this.fileStore.setFiles([...this.files]);
        }
      }
    });
  }

  fileDownload(filename: string): void {
    const url = `${environment.api.fileUrl}?filename=${encodeURIComponent(filename)}`;

    this.api.getSignedUrl(url).subscribe({
      next: (signedUrl: string) => {
        const a = document.createElement('a');
        a.href = signedUrl;
        a.download = filename; // ez csak akkor működik, ha Content-Disposition is be van állítva CloudFronton
        a.target = '_blank';   // új fülön is nyitható, ha inkább megtekinteni akarod
        a.click();
      },
      error: (err) => {
        console.error('❌ Failed to get signed URL:', err);
      }
    });
  }

  fileDetail(filename: string): void {
    this.router.navigate(['/file', filename]);
  }

  ngOnDestroy(): void {
    if (this.wsSub) {
      this.wsSub.unsubscribe();
    }
  }
}
