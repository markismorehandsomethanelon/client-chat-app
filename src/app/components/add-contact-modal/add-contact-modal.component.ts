import { Component, OnInit } from '@angular/core';
import { Contact } from 'src/app/models/contact';
import { User } from 'src/app/models/user';
import { ContactRequestService } from 'src/app/new-services/contact-request.service';
import { ContactService } from 'src/app/new-services/contact.service';
import { AddContactModalService } from 'src/app/services/add-contact-modal.service';
import { SessionService } from 'src/app/services/session.service';
import { UserService } from 'src/app/services/user.service';

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
    private contactRequestService: ContactRequestService,
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
    const user1: User = new User();
    const user2: User = new User();

    user1.id = SessionService.getCurrentUser().id;
    user2.id = this.foundUser.id;

    contact.user1 = user1;
    contact.user2 = user2;

    this.contactRequestService.sendRequest(contact).subscribe(
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
