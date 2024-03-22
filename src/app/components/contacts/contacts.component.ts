import { Component, OnInit } from '@angular/core';
import { ConfirmModalService } from 'src/app/services/confirm-modal.service';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { Contact } from 'src/app/models/contact';
import { Subscription } from 'rxjs';
import { SessionService } from 'src/app/services/session.service';
import { ContactService } from 'src/app/services/contact.service';
import { User } from 'src/app/models/user';
import { Util } from 'src/app/utils/util';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {

  private contacts: Contact[] = [];
  filteredContacts: Contact[] = [];

  private conversationsSubscription: Subscription;

  private DELETE_CONTACT_CONTENT: string = "Are you sure to delete this contact?";

  constructor(private confirmModalService: ConfirmModalService,
    private contactService: ContactService) { }

  ngOnInit(): void {

    this.contactService.onContactsChanged().subscribe(
      (contacts: Contact[]) => {
        this.contacts = contacts;
        this.filteredContacts = contacts;
      }
    );

    this.contactService.findContacts(SessionService.getCurrentUser()).subscribe();
  }

  ngOnDestroy(): void {

  }

  getAvatar(contact: Contact): string {
    const CURRENT_USER: User = SessionService.getCurrentUser();
    const user: User = (CURRENT_USER.id === contact.sender.id) ? contact.receiver : contact.sender;
    return Util.getBase64FromBinary(user.avatarFile.data, user.avatarFile.contentType);

  }

  getContactName(contact: Contact): string {
    const CURRENT_USER: User = SessionService.getCurrentUser();
    return (CURRENT_USER.id === contact.sender.id) ? contact.receiver.name : contact.sender.name;
  }

  onDeleted(contact: Contact): void {
    this.confirmModalService.openModal(ConfirmModalComponent, this.DELETE_CONTACT_CONTENT, 
      () => this.onDeletedCallback(contact));
  }

  onDeletedCallback(contact: Contact): void {
    this.contactService.deleteContact(contact).subscribe(
      () => {
        this.confirmModalService.closeModal();
      },
      (errorRes) => {
        console.log(errorRes.error.message);
      }
    );
  }
}
