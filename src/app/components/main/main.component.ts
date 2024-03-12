import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  subscription: Subscription;

  render: boolean = false;

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit(): void {
    this.webSocketService.connect();
    this.webSocketService.onConnected().subscribe(() => {
      this.render = true;
    });
  }

  ngOnDestroy() {
    this.webSocketService.disconnect();
  }
}
