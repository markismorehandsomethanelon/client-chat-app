import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { JoinGroupConversationRequest } from 'src/app/requests/join-group-conversation.request';
import { ConversationService } from 'src/app/new-services/new-conversation.service';
import { JoinGroupConversationModalService } from 'src/app/services/join-group-conversation-modal.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-join-group-conversation-modal',
  templateUrl: './join-group-conversation-modal.component.html',
  styleUrls: ['./join-group-conversation-modal.component.css']
})
export class JoinGroupConversationModalComponent implements OnInit {

  @ViewChild("conversationLinkInput") conversationLinkInput: ElementRef;

  errorMessage?: string;

  constructor(private joinGroupConversationModalService: JoinGroupConversationModalService,
    private conversationService: ConversationService){

  }
  
  ngOnInit(): void {
  }

  onJoin(): void {
    const req: JoinGroupConversationRequest = new JoinGroupConversationRequest();
    req.joinerId = SessionService.getCurrentUser().id;
    req.conversationLink = this.conversationLinkInput.nativeElement.value;
    
    this.conversationService.joinGroupConversation(req).subscribe(
      (successRes: any) => {
        this.joinGroupConversationModalService.closeModal();
      },
      (errorRes: any) => {
        this.errorMessage = errorRes.error.message;
      }
    )
  }

  onClose(): void {
    this.joinGroupConversationModalService.closeModal();
  }
}
