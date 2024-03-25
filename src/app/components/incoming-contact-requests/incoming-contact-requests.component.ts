import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Contact } from 'src/app/models/contact';
import { IncomingContactRequestService } from 'src/app/services/incoming-contact-request.service';
import { ConfirmModalService } from 'src/app/services/confirm-modal.service';
import { SessionService } from 'src/app/services/session.service';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { FileUtil } from 'src/app/utils/file-util';

@Component({
  selector: 'app-incoming-contact-requests',
  templateUrl: './incoming-contact-requests.component.html',
  styleUrls: ['./incoming-contact-requests.component.css']
})
export class IncomingContactRequestComponent implements OnInit {

  private incomingContactRequests: Contact[] = [];
  filteredIncomingContactRequests: Contact[] = [];

  private incomingContactRequestsSubscription: Subscription;

  private ACCEPT_REQUEST_CONTENT: string = "Are you sure to accept this request?";
  private DECLINE_REQUEST_CONTENT: string = "Are you sure to decline this request?";

  constructor(private confirmModalService: ConfirmModalService,
    private incomingContactRequestService: IncomingContactRequestService) { }

  ngOnInit(): void {
    this.incomingContactRequestsSubscription = this.incomingContactRequestService.onIncomingContactRequestsChanged().subscribe(
      (incomingContactRequests: Contact[]) => {
        this.incomingContactRequests = incomingContactRequests;
        this.filteredIncomingContactRequests = this.incomingContactRequests;
      }
    );
    this.incomingContactRequestService.findContactRequest(SessionService.getCurrentUser()).subscribe();
  }

  ngOnDestroy(): void {
    this.incomingContactRequestsSubscription.unsubscribe();
  }

  getAvatar(contact: Contact): string {
    return FileUtil.getBase64FromBinary(contact.sender.avatarFile.data, contact.sender.avatarFile.contentType);
  }

  onAccepted(incomingContactRequest: Contact): void {
    this.confirmModalService.openModal(ConfirmModalComponent, this.ACCEPT_REQUEST_CONTENT, 
      () => this.onAcceptedCallback(incomingContactRequest)
    );
  }

  onDeclined(incomingContactRequest: Contact): void {
    this.confirmModalService.openModal(ConfirmModalComponent, this.DECLINE_REQUEST_CONTENT,
      () => this.onDeclinedCallback(incomingContactRequest)
    );
  }

  onAcceptedCallback(incomingContactRequest: Contact): void {
    this.incomingContactRequestService.acceptRequest(incomingContactRequest).subscribe(
      () => {
        this.confirmModalService.closeModal();
      },
      (errorRes: any) => {
        alert(errorRes.error.message);
      }
    );
  }

  onDeclinedCallback(incomingContactRequest: Contact): void {
    this.incomingContactRequestService.declineRequest(incomingContactRequest).subscribe(
      () => {
        this.confirmModalService.closeModal();
      },
      (errorRes: any) => {
        alert(errorRes.error.message);
      }
    );
  }
}
