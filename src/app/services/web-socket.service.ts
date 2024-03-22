import { Injectable } from '@angular/core';
import * as SockJS from 'sockjs-client';
import { Stomp, StompConfig, StompSubscription } from '@stomp/stompjs';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private URL: string = 'http://localhost:8080/ws';
  private socket: any;
  private stompClient: any;
  private stompSubscriptions: Map<string, StompSubscription>;

  connectedSubject = new Subject<void>();
  
  constructor() { }

  w(): void {
    this.socket = new SockJS(this.URL);
    this.stompClient = Stomp.over(this.socket);

    this.stompSubscriptions = new Map();
    this.stompClient.connect({}, (frame: any) => {
      console.log('Connected: ' + frame);
      console.log(this.stompClient.maxWebSocketFrameSize);
      this.connectedSubject.next();
    }, error => {
      console.log('Connection error: ' + error);
    });
  }

  disconnect(): void {
    if (this.stompClient.connected) {
        this.stompClient.disconnect(() => {
            console.log('Disconnected');
        });
    }
  }

  subscribe(destination: string, callback: (res: any) => void): void {
    if (!this.stompSubscriptions.has(destination)) {
        const subscription = this.stompClient.subscribe(destination, (res: any) => {
          callback(JSON.parse(res.body));
        });

        this.stompSubscriptions.set(destination, subscription);
    }
  }

  unsubscribe(destination: string, callback: () => void): void {
    if (this.stompSubscriptions.has(destination)) {
        const subscription = this.stompSubscriptions.get(destination);
        if (subscription) {
            subscription.unsubscribe();
            this.stompSubscriptions.delete(destination);
            callback();
        }
    }
  }

  send(destination: string, body: any): void {
    this.stompClient.send(destination, {}, JSON.stringify(body));
  }

  onConnected(): Observable<void> {
    return this.connectedSubject.asObservable();
  }

  
}
