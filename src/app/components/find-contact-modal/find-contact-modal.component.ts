import { Component, OnInit } from '@angular/core';
import { Contact } from 'src/app/models/contact';
import { User } from 'src/app/models/user';
import { FindContactModalService } from 'src/app/services/find-contact-modal.service';
import { SessionService } from 'src/app/services/session.service';
import { UserService } from 'src/app/services/user.service';
import { OutgoingContactRequestService } from 'src/app/services/outcoming-contact-request.service';
import { FileUtil } from 'src/app/utils/file-util';

@Component({
  selector: 'app-find-contact-modal',
  templateUrl: './find-contact-modal.component.html',
  styleUrls: ['./find-contact-modal.component.css']
})
export class FindContactModelComponent implements OnInit {

  ceditable: boolean;

  image: string | ArrayBuffer | null = '';

  foundUser?: User;
  
  errorMessage?: string;

  constructor(private findContactModalService: FindContactModalService,
    private outgoingContactRequestService: OutgoingContactRequestService,
    private userService: UserService
    ){

  }
  
  ngOnInit(): void {
  }

  getAvatar(): string {
    return FileUtil.getBase64FromBinary(this.foundUser.avatarFile.data, this.foundUser.avatarFile.contentType);
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
    this.findContactModalService.closeModal();
  }

}
