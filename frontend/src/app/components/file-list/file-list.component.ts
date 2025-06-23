import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { environment } from '../../../enviroments/env';
import { CommonModule } from '@angular/common';
import { FileStoreService } from '../../services/file-store.service';
import { WebSocketService } from '../../services/websocket.service';
import { Subscription } from 'rxjs';

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
    private ws: WebSocketService
  ) {}

  ngOnInit(): void {
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

    this.fileStore.files$.subscribe((updated) => {
      this.files = updated;
    });

    // 🔁 Feliratkozás a központi WebSocket szolgáltatásra
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

  ngOnDestroy(): void {
    if (this.wsSub) {
      this.wsSub.unsubscribe();
    }
  }
}
