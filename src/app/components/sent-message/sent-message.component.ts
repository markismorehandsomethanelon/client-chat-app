import { Component, Input, OnInit } from '@angular/core';
import { Message } from 'src/app/models/message';

@Component({
  selector: 'app-sent-message',
  templateUrl: './sent-message.component.html',
  styleUrls: ['./sent-message.component.css']
})
export class SentMessageComponent implements OnInit {


  @Input() messageType: string;

  @Input() message: Message;

  constructor() { }

  ngOnInit(): void {
  }

}
