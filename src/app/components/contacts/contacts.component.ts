import { Component, OnInit } from '@angular/core';
import { ConfirmModalService } from 'src/app/services/confirm-modal.service';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { Contact } from 'src/app/models/contact';
import { Subscription } from 'rxjs';
import { SessionService } from 'src/app/services/session.service';
import { ContactService } from 'src/app/new-services/contact.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {

  contacts: Contact[] = [];
  filteredContacts: Contact[] = [];

  conversationsSubscription: Subscription;

  constructor(private confirmModalService: ConfirmModalService,
    private contactService: ContactService) { }

  ngOnInit(): void {

    this.contactService.onContactsChanged().subscribe(
      (contacts: Contact[]) => {
        this.contacts = contacts;
      }
    );

    this.contactService.findContacts(SessionService.getCurrentUser()).subscribe();
  }

  ngOnDestroy(): void {

  }

  openConfirmModal(): void {
    // const modalRef = this.confirmModalService.openModal(ConfirmModalComponent);
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
