import { Injectable } from '@angular/core';
import { InjectableRxStompConfig, RxStompService, StompHeaders } from '@stomp/ng2-stompjs';
import { RxStompState } from '@stomp/rx-stomp';
import { Observable, Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

const myRxStompConfig: InjectableRxStompConfig = {
  brokerURL: 'ws://localhost:8080/ws',

  connectHeaders: {
  },

  splitLargeFrames: true,
  heartbeatIncoming: 0, // Typical value 0 - disabled
  heartbeatOutgoing: 20000, // Typical value 20000 - every 20 seconds

  reconnectDelay: 5000,
  debug: (msg: string): void => {
    console.log(new Date(), msg);
  }
};

@Injectable({
  providedIn: 'root',
})
export class StompService {

  private stompSubscriptions: Map<string, Subscription>;

  constructor(private rxStompService: RxStompService) {
  }

  connect(): void {
    this.rxStompService.configure(myRxStompConfig);
    this.rxStompService.activate();
    this.stompSubscriptions = new Map();
  }

  onConnected(): Observable<RxStompState> {
    return this.rxStompService.connected$;
  }

  disconnect(): void {
    this.rxStompService.deactivate();
  }

  watch(destination: string, callback: (res: any) => void): void {
    if (!this.stompSubscriptions.has(destination)) {
      const subscription: Subscription = this.rxStompService.watch(destination).subscribe(
        (res: any) => {
          callback(JSON.parse(res.body));
        }
      );
      this.stompSubscriptions.set(destination, subscription);
    } 
  }

  unwatch(destination: string, callback: () => void): void {
    if (this.stompSubscriptions.has(destination)) {
      const subscription = this.stompSubscriptions.get(destination);
      if (subscription) {
          subscription.unsubscribe();
          this.stompSubscriptions.delete(destination);
          callback();
      }
    } 
  }

  publish(topic: string, body: any): void {
    this.rxStompService.publish({ destination: topic, body: JSON.stringify(body)});
  }  
}