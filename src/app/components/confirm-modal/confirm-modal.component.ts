import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Contact } from 'src/app/models/contact';
import { ContactRequestService } from 'src/app/new-services/contact-request.service';
import { ContactService } from 'src/app/new-services/contact.service';
import { ConversationService } from 'src/app/new-services/new-conversation.service';
import { LeaveGroupConversationRequest } from 'src/app/requests/leave-group-conversation.request';
import { ConfirmModalService } from 'src/app/services/confirm-modal.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent implements OnInit {

  leavedConversationSubject: Subject<void>;

  errorMessage?: string;

  data: any;

  constructor(private confirmModalService: ConfirmModalService,
    private conversationService: ConversationService,
    private contactService: ContactService,
    private contactRequestService: ContactRequestService,
    private router: Router){

  }

  setData(data: any): void {
    this.data = data;
  }
  
  ngOnInit(): void {
  }

  onConfirm(): void {
    const action: string = this.confirmModalService.action;
    if (action === "LEAVE_GROUP") {
      const leaveGroupConversationRequest: LeaveGroupConversationRequest = new LeaveGroupConversationRequest();
      
      leaveGroupConversationRequest.conversationId = this.data.id;
      leaveGroupConversationRequest.leaverId = SessionService.getCurrentUser().id;

      this.conversationService.leaveGroupConversation(leaveGroupConversationRequest).subscribe(
        (successRes) => {
          this.onClose();
          this.router.navigate(['/conversations']);
        },
        (errorRes) => {
          console.log(errorRes);
        });
    }else if (action === "ACCEPT_CONTACT_REQUEST") {
      const contactRequest: Contact = this.data;
      this.contactRequestService.acceptRequest(contactRequest).subscribe(
        (successRes: any) => {
          if (!successRes.success) {
            this.errorMessage = successRes.message;  
            return;
          }
          this.onClose();
        },
        (errorRes: any) => {
          this.errorMessage = errorRes.error.message;
        }
      );
    }else if (action === "DECLINE_CONTACT_REQUEST") {
      const contactRequest: Contact = this.data;
      this.contactRequestService.declineRequest(contactRequest).subscribe(
        (successRes: any) => {
          if (!successRes.success) {
            this.errorMessage = successRes.message;  
            return;
          }
          this.onClose();
        },
        (errorRes: any) => {
          this.errorMessage = errorRes.error.message;
        }
      );
    }
  }

  onClose(): void {
    this.confirmModalService.closeModal();
  }
}
