import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FileStoreService {
  private filesSubject = new BehaviorSubject<any[]>([]);
  files$ = this.filesSubject.asObservable();

  setFiles(files: any[]) {
    this.filesSubject.next(files);
  }

  addFile(file: any) {
    const current = this.filesSubject.value;
    this.filesSubject.next([file, ...current]);
  }

  clear() {
    this.filesSubject.next([]);
  }
}
