import { Component, OnInit } from '@angular/core';
import { Contact } from 'src/app/models/contact';
import { User } from 'src/app/models/user';
import { AddContactModalService } from 'src/app/services/add-contact-modal.service';
import { SessionService } from 'src/app/services/session.service';
import { UserService } from 'src/app/services/user.service';
import { OutgoingContactRequestService } from 'src/app/new-services/outcoming-contact-request.service';

@Component({
  selector: 'app-add-contact-modal',
  templateUrl: './add-contact-modal.component.html',
  styleUrls: ['./add-contact-modal.component.css']
})
export class AddContactModalComponent implements OnInit {

  ceditable: boolean;

  image: string | ArrayBuffer | null = '';

  foundUser?: User;
  
  errorMessage?: string;

  constructor(private addContactModalService: AddContactModalService,
    private outgoingContactRequestService: OutgoingContactRequestService,
    private userService: UserService
    ){

  }
  
  ngOnInit(): void {
  }

  onSend(): void {

    if (!this.foundUser) {
      return;
    }

    const contact: Contact = new Contact();
    const sender: User = new User();
    const receiver: User = new User();

    sender.id = SessionService.getCurrentUser().id;
    receiver.id = this.foundUser.id;

    contact.sender = sender;
    contact.receiver = receiver;

    this.outgoingContactRequestService.sendOutgoingContactRequests(contact).subscribe(
      (successRes) => {
        this.onClose();
      },
      (errorRes) => {
        this.errorMessage = errorRes.error.message;
      }
    );
  }

  onFind(value: string): void {
    try {
      const userId: number = Number(value);
      
      if (userId == SessionService.getCurrentUser().id){
        return;
      }

      this.userService.findUser(userId).subscribe(
        (successRes) => {
          this.foundUser = successRes.data;
          this.errorMessage = "";
        },
        (errorRes) => {
          this.foundUser = null;
          this.errorMessage = errorRes.error.message;
        }
      );
    }catch (error) {
      this.errorMessage = "Wrong user id";
    }

  }

  onClose(): void {
    this.addContactModalService.closeModal();
  }

}
