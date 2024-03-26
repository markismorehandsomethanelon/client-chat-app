import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfirmModalService } from 'src/app/services/confirm-modal.service';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { Contact } from 'src/app/models/contact';
import { Subscription } from 'rxjs';
import { SessionService } from 'src/app/services/session.service';
import { ContactService } from 'src/app/services/contact.service';
import { User } from 'src/app/models/user';
import { FileUtil } from 'src/app/utils/file-util';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit, OnDestroy {

  private contacts: Contact[] = [];
  filteredContacts: Contact[] = [];

  private contactsSubscription: Subscription;

  private DELETE_CONTACT_CONTENT: string = "Are you sure to delete this contact?";

  constructor(private confirmModalService: ConfirmModalService,
    private contactService: ContactService) { }

  ngOnInit(): void {

    this.contactsSubscription = this.contactService.onContactsChanged().subscribe(
      (contacts: Contact[]) => {
        this.contacts = contacts;
        this.filteredContacts = contacts;
      }
    );

    this.contactService.findContacts(SessionService.getCurrentUser()).subscribe();
  }

  ngOnDestroy(): void {
    this.contactsSubscription.unsubscribe();
  }

  search(value: string): void {
    if (value === ''){
      this.filteredContacts = this.contacts;
      return;
    }

    const foundContacts: Contact[] = this.contacts.filter(contact => {
      const lowercaseValue = value.toLowerCase();
      const CURRENT_USER = SessionService.getCurrentUser();
      
      const foundName: string = (contact.sender.id === CURRENT_USER.id) ? contact.receiver.name : contact.sender.name;

      return foundName.toLowerCase().includes(lowercaseValue);
    });

    this.filteredContacts = foundContacts;
  }

  getAvatar(contact: Contact): string {
    const CURRENT_USER: User = SessionService.getCurrentUser();
    const user: User = (CURRENT_USER.id === contact.sender.id) ? contact.receiver : contact.sender;
    return FileUtil.getBase64FromBinary(user.avatarFile.data, user.avatarFile.contentType);
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
