import { Component, OnInit } from '@angular/core';
import { RxStompState } from '@stomp/rx-stomp';
import { Subscription } from 'rxjs';
import { StompService } from 'src/app/services/stomp.service';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  subscription: Subscription;

  render: boolean = false;

  constructor(private stompService: StompService
    ) {}

  ngOnInit(): void {
    this.stompService.connect();
    this.stompService.onConnected().subscribe((state: RxStompState) => { 
      if (state === RxStompState.OPEN) {
        this.render = true;
      }
    });
  }

  ngOnDestroy() {
    this.stompService.disconnect();
  }
}
