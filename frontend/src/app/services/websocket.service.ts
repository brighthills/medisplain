import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/env';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket: WebSocket | null = null;
  private messageSubject = new Subject<any>();

  constructor() {}

  connect(token: string): void {
    const email = encodeURIComponent(localStorage.getItem('email') ?? '');
    const socketUrl = `${environment.api.webSocketBaseUrl}?email=${email}`;
    this.socket = new WebSocket(socketUrl);

    this.socket.onopen = () => {
      console.log('WebSocket connected');
      this.socket?.send(JSON.stringify({ action: 'authenticate', token }));
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.messageSubject.next(data); // 🔥 üzenet továbbítása
    };

    this.socket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  // Observable stream
  get messages$(): Observable<any> {
    return this.messageSubject.asObservable();
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      console.log('WebSocket disconnected');
    }
  }
}
