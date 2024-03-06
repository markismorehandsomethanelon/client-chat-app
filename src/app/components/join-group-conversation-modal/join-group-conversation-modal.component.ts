import { Component, OnInit } from '@angular/core';
import { JoinGroupConversationModalService } from 'src/app/services/join-group-conversation-modal.service';

@Component({
  selector: 'app-join-group-conversation-modal',
  templateUrl: './join-group-conversation-modal.component.html',
  styleUrls: ['./join-group-conversation-modal.component.css']
})
export class JoinGroupConversationModalComponent implements OnInit {

  constructor(private joinGroupConversationModalService: JoinGroupConversationModalService){

  }
  
  ngOnInit(): void {
  }

  onJoin(): void {
  }

  onClose(): void {
    this.joinGroupConversationModalService.closeModal();
  }
}
