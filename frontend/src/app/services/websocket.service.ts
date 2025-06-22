// websocket.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket: WebSocket | null = null;

  constructor() {}

  // Connect to the WebSocket after successful login
  connect(token: string): void {
    const email = 'rmezes@brighthills.com';

    const socketUrl = `wss://a9iwmgn508.execute-api.eu-central-1.amazonaws.com/dev/?email=${encodeURIComponent(email)}`;
    this.socket = new WebSocket(socketUrl);

    // Send the access token once connected
    this.socket.onopen = () => {
      console.log('WebSocket connected');
      this.socket?.send(JSON.stringify({ action: 'authenticate', token }));
    };

    // Handle incoming messages
    this.socket.onmessage = (event) => {
      console.log('Received message:', event.data);
    };

    // Handle WebSocket close
    this.socket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    // Handle WebSocket errors
    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  // Disconnect WebSocket when logging out
  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      console.log('WebSocket disconnected');
    }
  }
}
