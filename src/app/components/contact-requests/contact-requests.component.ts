import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Contact } from 'src/app/models/contact';
import { ContactRequestService } from 'src/app/new-services/contact-request.service';
import { ConfirmModalService } from 'src/app/services/confirm-modal.service';
import { SessionService } from 'src/app/services/session.service';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-contact-requests',
  templateUrl: './contact-requests.component.html',
  styleUrls: ['./contact-requests.component.css']
})
export class ContactRequestsComponent implements OnInit {

  contactRequests: Contact[] = [];
  filteredContactRequest: Contact[] = [];

  contactsRequestSubscription: Subscription;

  constructor(private confirmModalService: ConfirmModalService,
    private contactRequestService: ContactRequestService) { }

  ngOnInit(): void {
    this.contactRequestService.onContactRequestsChanged().subscribe(
      (contacts: Contact[]) => {
        this.contactRequests = contacts;
        this.filteredContactRequest = this.contactRequests;
      }
    );

    this.contactRequestService.findContactRequest(SessionService.getCurrentUser()).subscribe();
  }

  openConfirmModal(): void {
    
  }

  onAccepted(contactRequest: Contact): void {
    this.confirmModalService.openModal(ConfirmModalComponent, "ACCCEP_CONTACT_REQUEST", contactRequest);
  }

  onDeclined(contactRequest: Contact): void {
    this.confirmModalService.openModal(ConfirmModalComponent, "DECLINE_CONTACT_REQUEST", contactRequest);
  }

  getContactAvatar(contact: Contact): string {
    if (SessionService.getCurrentUser().id != contact.user1.id){
      return contact.user1.avatar;
    }
    return contact.user2.avatar;
  }

  getContactName(contact: Contact): string {
    if (SessionService.getCurrentUser().id != contact.user1.id){
      return contact.user1.name;
    }
    return contact.user2.name;
  }

}
