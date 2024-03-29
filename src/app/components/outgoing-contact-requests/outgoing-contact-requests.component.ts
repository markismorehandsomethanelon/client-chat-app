import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Contact } from 'src/app/models/contact';
import { OutgoingContactRequestService } from 'src/app/services/outcoming-contact-request.service';
import { ConfirmModalService } from 'src/app/services/confirm-modal.service';
import { SessionService } from 'src/app/services/session.service';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { FileUtil } from 'src/app/utils/file-util';

@Component({
  selector: 'app-outgoing-contact-requests',
  templateUrl: './outgoing-contact-requests.component.html',
  styleUrls: ['./outgoing-contact-requests.component.css']
})
export class OutgoingContactRequestComponent implements OnInit, OnDestroy {

  private outgoingContactRequests: Contact[] = [];
  filteredOutgoingContactRequests: Contact[] = [];

  private outgoingContactRequestsSubscription: Subscription;

  private DELETE_OUTGOING_REQUEST_CONTENT: string = "Are you sure to delete this request?";

  constructor(private confirmModalService: ConfirmModalService,
    private outgoingContactRequestService: OutgoingContactRequestService) { }

  ngOnInit(): void {
    this.outgoingContactRequestsSubscription = this.outgoingContactRequestService.onOutgoingContactRequestsChanged().subscribe(
      (outgoingContactRequests: Contact[]) => {
        this.outgoingContactRequests = outgoingContactRequests;
        this.filteredOutgoingContactRequests = this.outgoingContactRequests;
      }
    );
    this.outgoingContactRequestService.findOutgoingContactRequests(SessionService.getCurrentUser()).subscribe();
  }

  ngOnDestroy(): void {
    this.outgoingContactRequestsSubscription.unsubscribe();
  }

  search(value: string): void {
    if (value === ''){
      this.filteredOutgoingContactRequests = this.outgoingContactRequests;
      return;
    }

    const foundOutgoingContactRequests: Contact[] = this.outgoingContactRequests.filter(contact => {
      const lowercaseValue = value.toLowerCase();
      return contact.receiver.name.toLowerCase().includes(lowercaseValue);
    });

    this.filteredOutgoingContactRequests = foundOutgoingContactRequests;
  }

  getAvatar(contact: Contact): string {
    return FileUtil.getBase64FromBinary(contact.receiver.avatarFile.data, contact.receiver.avatarFile.contentType);
  }

  onDeleted(outgoingContactRequest: Contact): void {
    this.confirmModalService.openModal(ConfirmModalComponent, this.DELETE_OUTGOING_REQUEST_CONTENT,
      () => this.onDeletedCallback(outgoingContactRequest)
    );
  }

  onDeletedCallback(outgoingContactRequest: Contact): void {
    this.outgoingContactRequestService.deleteOutgoingContactRequest(outgoingContactRequest).subscribe(
      () => {
        this.confirmModalService.closeModal();
      },
      (errorRes: any) => {
        alert(errorRes.error.message);
      }
    );
  }
}
