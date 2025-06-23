import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error';

interface ToastMessage {
  message: string;
  type: ToastType;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private messageSubject = new BehaviorSubject<ToastMessage | null>(null);
  message$ = this.messageSubject.asObservable();

  show(message: string, type: ToastType = 'success', duration = 3000) {
    this.messageSubject.next({ message, type });
    setTimeout(() => this.clear(), duration);
  }

  clear() {
    this.messageSubject.next(null);
  }
}
