import { Component, OnInit } from '@angular/core';
import { Contact } from 'src/app/models/contact';
import { User } from 'src/app/models/user';
import { FindContactModalService } from 'src/app/services/find-contact-modal.service';
import { SessionService } from 'src/app/services/session.service';
import { UserService } from 'src/app/services/user.service';
import { OutgoingContactRequestService } from 'src/app/services/outcoming-contact-request.service';
import { ConversationService } from 'src/app/services/conversation.service';
import { IndividualConversation } from 'src/app/models/individual-conversation';
import { Util } from 'src/app/utils/util';

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
    private userService: UserService,
    private conversationService: ConversationService
    ){

  }
  
  ngOnInit(): void {
  }

  getAvatar(): string {
    return Util.getBase64FromBinary(this.foundUser.avatarFile.data, this.foundUser.avatarFile.contentType);
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

  onStart(): void {

    if (!this.foundUser) {
      return;
    }

    const individualConversation: IndividualConversation  = new IndividualConversation();
    const member1: User = new User();
    const member2: User = new User();

    member1.id = SessionService.getCurrentUser().id;
    member2.id = this.foundUser.id;

    individualConversation.members = [member1, member2];
    this.conversationService.createConversation(individualConversation).subscribe(
      (successRes: any) => {
        this.onClose();
      },
      (errorRes: any) => {
        this.errorMessage = errorRes.error.message;
      }
    );
  }

  onClose(): void {
    this.findContactModalService.closeModal();
  }

}
