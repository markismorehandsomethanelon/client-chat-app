import { Component, Input, OnInit } from '@angular/core';
import { Message } from 'src/app/models/message';

@Component({
  selector: 'app-received-message',
  templateUrl: './received-message.component.html',
  styleUrls: ['./received-message.component.css']
})
export class ReceivedMessageComponent implements OnInit {

  @Input() message: Message;

  constructor() { }

  ngOnInit(): void {
  }

}
